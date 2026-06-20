'use server'

import { GoogleGenAI } from '@google/genai';
import { createClient } from '@/lib/supabase/server';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function askAiAdvisor(opportunityId: string, prompt: string) {
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

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: context,
    });
    
    // Also log this query in the activity feed
    await supabase.from('activity_feed').insert({
      opportunity_id: opportunityId,
      user_id: opp.user_id,
      activity_type: 'AI_ADVICE_REQUESTED',
      description: `Consulted AI Advisor regarding: "${prompt}"`,
      metadata: { prompt }
    });

    return response.text;
  } catch (error) {
    console.error("AI Advisor Error:", error);
    return "The Intelligence Core encountered an error processing your request. Please try again.";
  }
}
