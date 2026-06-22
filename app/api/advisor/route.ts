import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { GoogleGenAI } from '@google/genai'
import OpenAI from 'openai'
import { env } from '@/lib/env'
import { logger } from '@/lib/logger'
import { rateLimit, LIMITS } from '@/lib/rate-limit'
import { checkAndIncrementUsage } from '@/lib/supabase/usage'

export async function POST(request: Request) {
  const startTime = Date.now()
  try {
    // 1. IP Rate Limiting
    const ip = request.headers.get('x-forwarded-for') || 'anonymous'
    const limitResult = await rateLimit(`advisor_${ip}`, LIMITS.ADVISOR.limit, LIMITS.ADVISOR.windowMs)
    
    if (!limitResult.success) {
      return NextResponse.json({ error: 'Rate limit exceeded. Please try again later.' }, { status: 429 })
    }

    const { messages } = await request.json()
    
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Admin bypass for hackathon
    const isAdmin = user.email === 'admin@clearpath.ai' || user.email?.includes('admin')

    if (!isAdmin) {
      // 2. Limit Validation Logic
      const usageStatus = await checkAndIncrementUsage(user.id, 'advisor_session')
      
      if (!usageStatus.hasFreeUsage) {
        return NextResponse.json({ 
          error: 'LIMIT_REACHED', 
          message: 'Free Access Complete' 
        }, { status: 403 })
      }
    }

    // Retain only last 20 messages for session memory
    const memory = messages.slice(-20)
    let textPrompt = memory.map((m: any) => `${m.role === 'user' ? 'User' : 'Advisor'}: ${m.content}`).join('\n')

    // ─── REAL CONTEXT INJECTION ───
    let profileData = {
      name: "Student", state: "Not set", income_range: "Not set",
      category: "General", career_interest: "Not set", education_level: "Not set"
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profile) {
      profileData = {
        name: profile.first_name ? `${profile.first_name} ${profile.last_name}`.trim() : "Student",
        state: profile.state || user.user_metadata?.state || "Not set",
        income_range: profile.income_range || user.user_metadata?.income_range || "Not set",
        category: profile.category || user.user_metadata?.category || "General",
        career_interest: profile.career_interest || user.user_metadata?.career_interest || "Not set",
        education_level: profile.grade_level || user.user_metadata?.grade || "Not set"
      }
    }

    let opportunitiesData: any[] = []
    const { data: opportunities } = await supabase
      .from('opportunities')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    if (opportunities && opportunities.length > 0) {
      opportunitiesData = opportunities.map(opp => ({
        title: opp.title || 'Untitled',
        type: opp.category || 'Document',
        readiness_score: opp.readiness_score || 0,
        status: opp.readiness_score >= 80 ? 'Ready' : opp.readiness_score >= 50 ? 'Action Required' : 'Not Started',
        deadline: opp.deadline || 'No deadline',
        missing_documents: opp.missing_documents || []
      }))
    }

    const allMissingDocs = [...new Set(opportunitiesData.flatMap(o => o.missing_documents))]

    const contextObject = {
      profile: profileData,
      active_opportunities: opportunitiesData.length > 0 ? opportunitiesData : [],
      missing_documents: allMissingDocs,
      activity_logs: ["Accessed ClearPath Advisor"]
    }

    const systemPrompt = `
      You are ClearPath Advisor — a calm, intelligent, premium AI guidance system.
      
      Your personality: Think Apple Siri meets a caring academic advisor. You are warm but precise. You never waste words. You speak with authority but empathy.

      You ONLY have access to the following student context:
      ${JSON.stringify(contextObject, null, 2)}

      STRICT GUARDRAILS:
      - ONLY answer questions about: opportunities, deadlines, readiness, documents, eligibility, application planning, scholarships, educational support, and the student's profile.
      - If asked about Programming, Politics, History, Math, Health, Medical, Legal, Current Events, General Knowledge, School Homework, Coding, or Personal Opinions: respond ONLY with "I am ClearPath Advisor. My role is limited to your educational opportunities, eligibility, documents, deadlines, readiness score, and action planning."
      - If information is unavailable in the context: say "I cannot determine that from your ClearPath data."
      - Never invent deadlines, requirements, or eligibility criteria.
      - Never hallucinate opportunity names that don't exist in the context.

      RESPONSE BEHAVIOR:
      - Prioritize: Actionability > Evidence > Brevity
      - Always identify: Highest Impact Action, Closest Deadline, Biggest Readiness Gap
      - Keep conversational responses under 3 sentences unless the user asks for detail.
      - End every response with: "Final decisions remain yours. Review original requirements before submitting."

      Respond ONLY in JSON matching this schema:
      {
        "bestAction": "string or null",
        "reason": "string",
        "expectedGain": "string or null",
        "estimatedTime": "string or null",
        "message": "string",
        "basedOn": { "opportunities": 0, "profile": 0, "documents": 0 },
        "confidence": "High"
      }
    `

    let resultJson: any = null;
    let providerUsed = 'Gemini';
    let fallbackTriggered = false;

    try {
      if (!env.GEMINI_API_KEY) throw new Error("Gemini API key missing");
      const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `${systemPrompt}\n\nConversation History:\n${textPrompt}`,
        config: { responseMimeType: "application/json" }
      });
      
      const resultText = response.text;
      if (!resultText) throw new Error("Empty response from Gemini");
      resultJson = JSON.parse(resultText);
    } catch (geminiError) {
      logger.warn(`Gemini failed. Triggering OpenAI fallback: ${geminiError}`);
      fallbackTriggered = true;
      providerUsed = 'OpenAI';
      
      try {
        if (!env.OPENAI_API_KEY) throw new Error("OpenAI API key missing");
        const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            ...memory
          ],
          response_format: { type: "json_object" },
          temperature: 0.1,
        });

        const resultText = response.choices[0].message.content || "{}"
        resultJson = JSON.parse(resultText)
      } catch (openaiError) {
        logger.error(`OpenAI fallback failed: ${openaiError}`);
        // Graceful Response
        resultJson = {
          bestAction: null,
          reason: "System maintenance",
          expectedGain: null,
          estimatedTime: null,
          message: "ClearPath Advisor is temporarily unavailable. Please try again in a few moments.",
          basedOn: { opportunities: 0, profile: 0, documents: 0 },
          confidence: "Low"
        };
        providerUsed = 'GracefulFallback';
      }
    }

    const latency = Date.now() - startTime;
    const tokenEstimate = Math.round((systemPrompt.length + textPrompt.length) / 4); // Rough estimate

    // Admin Monitoring Logging
    try {
      await supabase.from('usage_logs').insert({
        user_id: user.id,
        service: providerUsed,
        operation: 'Advisor Chat',
        token_estimate: tokenEstimate,
        request_count: 1,
        latency: latency,
        fallback_triggered: fallbackTriggered
      });
    } catch (logError) {
      logger.error({ error: logError }, 'Failed to write usage log');
    }

    return NextResponse.json(resultJson)

  } catch (error: unknown) {
    const err = error as Error
    logger.error({ error: err.message }, 'Advisor API failed catastrophically')
    // Ensure we NEVER expose 500 Provider Error to the user
    return NextResponse.json({
        bestAction: null,
        reason: "System maintenance",
        expectedGain: null,
        estimatedTime: null,
        message: "ClearPath Advisor is temporarily unavailable. Please try again in a few moments.",
        basedOn: { opportunities: 0, profile: 0, documents: 0 },
        confidence: "Low"
    })
  }
}
