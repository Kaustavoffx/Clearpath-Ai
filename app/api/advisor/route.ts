import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import OpenAI from 'openai'
import { env } from '@/lib/env'
import { logger } from '@/lib/logger'

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY || 'dummy' })

export async function POST(request: Request) {
  try {
    const { messages, mockDataOverrides } = await request.json()
    
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 })
    }

    // Retain only last 20 messages for session memory
    const memory = messages.slice(-20)

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    // In a real app we'd fetch these from Supabase. 
    // Using mock overrides for the Judge Demo Moment.
    const contextObject = {
      profile: mockDataOverrides?.profile || {
        name: user?.user_metadata?.full_name || "John Student",
        state: "Maharashtra",
        income_range: "Below 2.5 LPA",
        category: "General",
        career_interest: "Engineering",
        education_level: "High School Senior"
      },
      active_opportunities: mockDataOverrides?.opportunities || [
        { title: "OASIS Scholarship", type: "State", readiness_score: 72, status: "Action Required", deadline: "2026-07-15", impact_score: 85, missing_documents: ["Income Certificate"] },
        { title: "SVMCM Scholarship", type: "Merit", readiness_score: 40, status: "Not Started", deadline: "2026-08-01", impact_score: 95, missing_documents: ["Income Certificate", "Mark Sheet"] }
      ],
      missing_documents: mockDataOverrides?.missing_documents || [
        "Income Certificate"
      ],
      activity_logs: mockDataOverrides?.activity_logs || [
        "Viewed OASIS Scholarship details",
        "Completed profile onboarding"
      ]
    }

    const systemPrompt = `
      You are ClearPath Advisor.
      Your purpose is helping students understand and act on opportunities discovered inside ClearPath OS.

      You ONLY have access to the following context:
      ${JSON.stringify(contextObject, null, 2)}

      FORBIDDEN BEHAVIOR:
      Never answer questions about Programming, Politics, History, Math, Health, Medical, Legal, Current Events, General Knowledge, School Homework, Coding Help, or Personal Opinions.
      If asked out of scope, respond: "I can only answer questions related to your ClearPath opportunities, documents, profile, and action plans."

      If information is unavailable: "I cannot determine that from your ClearPath data."
      Never invent deadlines. Never invent requirements. Never invent eligibility.

      Always prioritize: Actionability, Evidence, Student success, Transparency.

      Determine the Highest Impact Action, Fastest Completion, Biggest Readiness Increase, Most Urgent Deadline, and Most Valuable Opportunity based on the context.

      Respond ONLY in the following JSON format matching this schema:
      {
        "bestAction": string,
        "reason": string,
        "expectedGain": string,
        "estimatedTime": string,
        "message": string,
        "basedOn": { "opportunities": number, "profile": number, "documents": number },
        "confidence": "High" | "Medium" | "Low"
      }
      
      Ensure your "message" explains what to do in a conversational way as an Advisor.
      Always end the conversational message with exactly:
      "Final decisions remain yours. Review original requirements before submitting any application."
    `

    if (!env.OPENAI_API_KEY || env.OPENAI_API_KEY === 'dummy') {
      logger.warn('No OpenAI API key found, returning mock Advisor response for demo purposes.');
      // Mock for Hackathon / Judge Demo
      return NextResponse.json({
        bestAction: "Upload Income Certificate",
        reason: "Required for 2 high-impact opportunities (OASIS, SVMCM)",
        expectedGain: "+18 readiness",
        estimatedTime: "10 minutes",
        message: "Good evening. The highest priority action today is uploading your Income Certificate. This single document is blocking both the OASIS and SVMCM scholarships. Resolving this will significantly increase your readiness score.\n\nFinal decisions remain yours. Review original requirements before submitting any application.",
        basedOn: { opportunities: 2, profile: 1, documents: 0 },
        confidence: "High"
      })
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Fast reasoning model
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
