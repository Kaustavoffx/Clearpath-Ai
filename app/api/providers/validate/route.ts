import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { GoogleGenAI } from '@google/genai'

export async function POST(request: Request) {
  try {
    const { provider, apiKey } = await request.json()

    if (!provider || !apiKey) {
      return NextResponse.json({ error: 'Provider and apiKey are required' }, { status: 400 })
    }

    const startTime = Date.now()

    if (provider === 'openai') {
      const openai = new OpenAI({ apiKey })
      // Lightweight validation: list models
      await openai.models.list()
      const latency = Date.now() - startTime
      return NextResponse.json({ success: true, latency })
    }

    if (provider === 'gemini') {
      const ai = new GoogleGenAI({ apiKey })
      // Lightweight validation
      await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: 'ping',
        config: { maxOutputTokens: 1 }
      })
      const latency = Date.now() - startTime
      return NextResponse.json({ success: true, latency })
    }

    if (provider === 'deepgram') {
      const res = await fetch('https://api.deepgram.com/v1/projects', {
        headers: { 'Authorization': `Token ${apiKey}` }
      })
      if (!res.ok) throw new Error('Invalid Deepgram API Key')
      
      const latency = Date.now() - startTime
      return NextResponse.json({ success: true, latency })
    }

    return NextResponse.json({ error: 'Unsupported provider' }, { status: 400 })

  } catch (error: unknown) {
    const err = error as Error
    return NextResponse.json({ success: false, error: err.message }, { status: 401 })
  }
}
