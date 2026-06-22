'use server'

import { GoogleGenAI } from '@google/genai';
import OpenAI from 'openai';
import { createClient } from '@/lib/supabase/server';
import { env } from '@/lib/env';

export async function askAiAdvisor(opportunityId: string, prompt: string) {
  const startTime = Date.now();
  const supabase = await createClient();

  // 1. Fetch comprehensive context
  const { data: opp } = await supabase.from('opportunities').select('*').eq('id', opportunityId).single();
  const { data: docs } = await supabase.from('opportunity_documents').select('*').eq('opportunity_id', opportunityId);
  const { data: tasks } = await supabase.from('action_steps').select('*').eq('opportunity_id', opportunityId);
  
  if (!opp) {
    return "Error: Could not retrieve context for this opportunity.";
  }

  const context = `
You are the ClearPath OS V3 AI Advisor. 
Answer the user's question accurately based strictly on the following real database records for this opportunity.
Do not hallucinate external details. If the answer is not in the context, say so.

### Opportunity: ${opp.title}
Funding Value: ${opp.opportunity_value || 'Unknown'}
Deadline: ${opp.deadline || 'None'}
Eligibility Analysis: ${JSON.stringify(opp.eligibility_analysis)}
Required Documents: ${JSON.stringify(opp.required_documents)}

### Action Tasks:
${tasks?.map(t => `- ${t.title} (Status: ${t.status}, Due: ${t.due_date || 'None'})`).join('\n') || 'No tasks'}

### Uploaded Documents:
${docs?.map(d => `- ${d.name} (Status: ${d.status})`).join('\n') || 'No documents'}

### User Question:
${prompt}
  `;

  let responseText = "";
  let providerUsed = 'Gemini';
  let fallbackTriggered = false;

  try {
    if (!env.GEMINI_API_KEY) throw new Error("Missing Gemini API Key");
    const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: context,
    });
    responseText = response.text || "";
    if (!responseText) throw new Error("Empty response from Gemini");
  } catch (geminiError) {
    console.warn("Gemini AI Action failed. Triggering OpenAI fallback:", geminiError);
    fallbackTriggered = true;
    providerUsed = 'OpenAI';
    
    try {
      if (!env.OPENAI_API_KEY) throw new Error("Missing OpenAI API Key");
      const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: context }],
        temperature: 0.1,
      });
      responseText = response.choices[0].message.content || "";
    } catch (openaiError) {
      console.error("OpenAI fallback also failed:", openaiError);
      providerUsed = 'GracefulFallback';
      responseText = "ClearPath Advisor is temporarily unavailable. Please try again in a few moments.";
    }
  }

  const latency = Date.now() - startTime;
  const tokenEstimate = Math.round(context.length / 4);

  // Log to usage_logs
  try {
    await supabase.from('usage_logs').insert({
      user_id: opp.user_id,
      service: providerUsed,
      operation: 'Opportunity AI Action',
      token_estimate: tokenEstimate,
      request_count: 1,
      latency: latency,
      fallback_triggered: fallbackTriggered
    });
  } catch (e) {
    console.error("Failed to log usage:", e);
  }

  // Also log this query in the activity feed
  try {
    await supabase.from('activity_feed').insert({
      opportunity_id: opportunityId,
      user_id: opp.user_id,
      activity_type: 'AI_ADVICE_REQUESTED',
      description: `Consulted AI Advisor regarding: "${prompt}"`,
      metadata: { prompt }
    });
  } catch (e) {
    // Ignore activity feed log errors
  }

  return responseText;
}
