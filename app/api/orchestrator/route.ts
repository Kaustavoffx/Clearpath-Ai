import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { GoogleGenAI } from '@google/genai'
import OpenAI from 'openai'
import { env } from '@/lib/env'
import { logger } from '@/lib/logger'

// Initialize AI clients
const gemini = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY })
const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY || 'dummy' })

export async function POST(request: Request) {
  try {
    const { transcript, activeDocumentContext } = await request.json()
    
    if (!transcript) {
      return NextResponse.json({ error: 'Transcript is required' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    // 1. Conversation Agent: Understand Intent
    logger.info({ transcript }, 'Orchestrating user intent')
    
    const intentPrompt = `
      You are the Master Orchestrator for ClearPath AI.
      The user just said: "${transcript}"
      
      Active Document Context provided by frontend: ${activeDocumentContext ? 'YES' : 'NO'}
      
      Determine the intent. Respond with ONLY a JSON object:
      {
        "intent": "ANALYZE_DOCUMENT" | "QUESTION_ANSWERING" | "PLAN_REVIEW" | "GENERAL_GREETING",
        "requires_document": boolean
      }
    `
    
    const intentResponse = await gemini.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: intentPrompt,
      config: { responseMimeType: "application/json" }
    })
    
    const intentData = JSON.parse(intentResponse.text || '{}')
    let synthesizedResponseText = ""

    // 2. Agents Execution based on intent
    if (intentData.intent === 'ANALYZE_DOCUMENT' || (intentData.requires_document && activeDocumentContext)) {
       // Document Intelligence Agent & Opportunity Risk Agent
       const analysisPrompt = `
         Analyze this document context: ${activeDocumentContext || 'None provided.'}
         The user asked: "${transcript}"
         
         Provide a natural, spoken-word response (no markdown) summarizing the opportunity, highlighting the deadline, the readiness score you calculate, and the opportunity loss if they miss it. Keep it conversational, empathetic, and under 4 sentences.
       `
       const analysisResponse = await gemini.models.generateContent({
         model: 'gemini-2.5-flash',
         contents: analysisPrompt
       })
       synthesizedResponseText = analysisResponse.text || "I've analyzed the document."
       
    } else if (intentData.intent === 'GENERAL_GREETING') {
       synthesizedResponseText = "Hello! I am ClearPath AI. You can drop a document here or ask me a question about your educational opportunities. How can I help you today?"
    } else {
       // General conversational agent
       const generalPrompt = `
         The user said: "${transcript}"
         Provide a natural, helpful, spoken-word response. Keep it conversational.
       `
       const generalResponse = await gemini.models.generateContent({
         model: 'gemini-2.5-flash',
         contents: generalPrompt
       })
       synthesizedResponseText = generalResponse.text || "I'm here to help."
    }

    logger.info({ synthesizedResponseText }, 'Synthesized AI Response')

    // 3. Voice Experience Agent (OpenAI TTS)
    let audioBase64 = null
    
    if (env.OPENAI_API_KEY && env.OPENAI_API_KEY !== 'dummy') {
      try {
        const mp3 = await openai.audio.speech.create({
          model: "tts-1",
          voice: "nova", // Nova is a very natural, friendly voice
          input: synthesizedResponseText,
        })
        const buffer = Buffer.from(await mp3.arrayBuffer())
        audioBase64 = buffer.toString('base64')
      } catch (e: any) {
         logger.error('OpenAI TTS failed, falling back to text only', e.message)
      }
    }

    return NextResponse.json({
      text: synthesizedResponseText,
      audioBase64: audioBase64,
      intent: intentData.intent
    })

  } catch (error: any) {
    logger.error({ error: error.message }, 'Orchestrator failed')
    return NextResponse.json({ error: 'Orchestrator failed' }, { status: 500 })
  }
}
