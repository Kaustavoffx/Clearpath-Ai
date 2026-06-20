import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { GoogleGenAI } from '@google/genai'
import { createClient } from '@/lib/supabase/server'
import { encrypt } from '@/lib/encryption'
import { safeDate } from '@/lib/date-utils'

export async function POST(request: Request) {
  try {
    const { provider, apiKey } = await request.json()

    if (!provider || !apiKey) {
      return NextResponse.json({ error: 'Provider and apiKey are required' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const startTime = Date.now()

    // 1. Validate API Key
    if (provider === 'openai') {
      const openai = new OpenAI({ apiKey })
      // Lightweight validation: list models
      await openai.models.list()
    } else if (provider === 'gemini') {
      const ai = new GoogleGenAI({ apiKey })
      // Lightweight validation
      await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: 'ping',
        config: { maxOutputTokens: 1 }
      })
    } else if (provider === 'deepgram') {
      const res = await fetch('https://api.deepgram.com/v1/projects', {
        headers: { 'Authorization': `Token ${apiKey}` }
      })
      if (!res.ok) throw new Error('Invalid Deepgram API Key')
    } else {
      return NextResponse.json({ error: 'Unsupported provider' }, { status: 400 })
    }

    const latency = Date.now() - startTime

    // 2. Encrypt Key
    const encryptedData = encrypt(apiKey)

    // 3. Save using Admin client (to bypass RLS for write, or we can use normal client if RLS allowed, but let's use service key to be safe)
    const adminSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const adminSupabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const { createClient: createAdminClient } = await import('@supabase/supabase-js')
    const adminSupabase = createAdminClient(adminSupabaseUrl, adminSupabaseKey)

    // Upsert the encrypted key
    const { error: keyError } = await adminSupabase
      .from('user_api_keys')
      .upsert({
        user_id: user.id,
        provider: provider,
        ...encryptedData,
        updated_at: safeDate(new Date())
      }, { onConflict: 'user_id, provider' })

    if (keyError) {
      console.error("Failed to save key:", keyError)
      return NextResponse.json({ error: 'Failed to save key securely' }, { status: 500 })
    }

    // Update usage connected status
    await adminSupabase
      .from('user_usage')
      .update({
        [`${provider}_connected`]: true,
        updated_at: safeDate(new Date())
      })
      .eq('user_id', user.id)

    return NextResponse.json({ success: true, latency })

  } catch (error: unknown) {
    const err = error as Error
    return NextResponse.json({ success: false, error: err.message }, { status: 401 })
  }
}
