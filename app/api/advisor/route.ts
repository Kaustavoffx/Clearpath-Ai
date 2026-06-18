import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import OpenAI from 'openai'
import { env } from '@/lib/env'
import { logger } from '@/lib/logger'
import { rateLimit, LIMITS } from '@/lib/rate-limit'
import { checkAndIncrementUsage, getProviderKey } from '@/lib/supabase/usage'
import { decrypt } from '@/lib/encryption'

export async function POST(request: Request) {
  try {
    // 1. IP Rate Limiting (Hackathon simplified version)
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

    // 2. Limit Validation Logic
    const usageStatus = await checkAndIncrementUsage(user.id, 'advisor_session')
    
    if (!usageStatus.hasFreeUsage && !usageStatus.hasProviderConnected) {
      return NextResponse.json({ 
        error: 'LIMIT_REACHED', 
        message: 'Free Access Complete' 
      }, { status: 403 })
    }

    // 3. Provider Priority Routing (OpenAI first for Advisor)
    let finalApiKey = env.OPENAI_API_KEY || 'dummy'
    
    if (usageStatus.hasProviderConnected) {
      const encryptedKeyData = await getProviderKey(user.id, 'openai')
      if (encryptedKeyData) {
        finalApiKey = decrypt(encryptedKeyData)
      } else {
         // Fallback to gemini if we had advanced logic, but spec prioritizes OpenAI for Advisor
         // We will just use platform credits if available, else fail.
      }
    }

    const openai = new OpenAI({ apiKey: finalApiKey })

    // Retain only last 20 messages for session memory
    const memory = messages.slice(-20)

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

    // New Strict System Prompt based on user spec
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
        "bestAction": string | null,
        "reason": string,
        "expectedGain": string | null,
        "estimatedTime": string | null,
        "message": string,
        "basedOn": { "opportunities": number, "profile": number, "documents": number },
        "confidence": "High" | "Medium" | "Low"
      }
    `

    if (finalApiKey === 'dummy') {
      logger.warn('No valid OpenAI API key found, returning contextual mock response.');
      const topOpp = contextObject.active_opportunities[0] || { title: 'Pending Application', readiness_score: 0 }
      const missingDoc = contextObject.missing_documents[0] || 'required documents'
      
      return NextResponse.json({
        bestAction: `Upload ${missingDoc}`,
        reason: `Required for ${topOpp.title} (readiness: ${topOpp.readiness_score}%)`,
        expectedGain: "+15 readiness",
        estimatedTime: "10 minutes",
        message: `Good evening, ${profileData.name}. Your highest priority action is uploading your ${missingDoc}. Resolving this will improve your readiness score.\n\nFinal decisions remain yours. Review original requirements before submitting.`,
        basedOn: { opportunities: contextObject.active_opportunities.length, profile: 1, documents: contextObject.missing_documents.length },
        confidence: "High"
      })
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...memory
      ],
      response_format: { type: "json_object" },
      temperature: 0.1,
    })

    const resultText = response.choices[0].message.content || "{}"
    const resultJson = JSON.parse(resultText)

    return NextResponse.json(resultJson)

  } catch (error: unknown) {
    const err = error as Error
    logger.error({ error: err.message }, 'Advisor API failed')
    return NextResponse.json({ error: 'Advisor API failed' }, { status: 500 })
  }
}
