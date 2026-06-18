import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { GoogleGenAI } from '@google/genai'
import { z } from 'zod'
import { rateLimit } from '@/lib/security/rate-limit'
import { logger } from '@/lib/logger'
import { env } from '@/lib/env'
import sanitizeHtml from 'sanitize-html'

// Input Validation Schema
const processRequestSchema = z.object({
  filePath: z.string().min(1).optional(),
  url: z.string().url().optional(),
}).refine(data => data.filePath || data.url, {
  message: "Either filePath or url must be provided"
});

export async function POST(request: Request) {
  try {
    const rawBody = await request.json()
    const parsedBody = processRequestSchema.safeParse(rawBody)

    if (!parsedBody.success) {
      logger.warn({ errors: parsedBody.error.flatten() }, 'Invalid input payload')
      return NextResponse.json({ error: 'Invalid input payload' }, { status: 400 })
    }

    const { filePath, url } = parsedBody.data

    const supabase = await createClient()

    // 1. Authentication & Authorization
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      logger.warn('Unauthorized API access attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Rate Limiting (5 requests per minute per user)
    const rateLimitResult = await rateLimit(`process_api_${user.id}`, 5, 60000)
    if (!rateLimitResult.success) {
      logger.warn({ userId: user.id }, 'Rate limit exceeded')
      return NextResponse.json({ error: 'Too Many Requests. Please wait a minute before trying again.' }, { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': rateLimitResult.limit.toString(),
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': rateLimitResult.reset.toString()
        }
      })
    }

    let inlineData = null
    let rawTextContext = null

    // 3. Fetch input data securely
    if (filePath) {
      // Basic path traversal protection (Supabase Storage handles most, but defense in depth)
      if (filePath.includes('..')) {
         logger.error({ userId: user.id, filePath }, 'Attempted path traversal')
         return NextResponse.json({ error: 'Invalid file path' }, { status: 400 })
      }

      const { data: fileData, error: downloadError } = await supabase.storage
        .from('opportunities')
        .download(filePath)

      if (downloadError || !fileData) {
        logger.error({ error: downloadError }, 'Failed to download file from Supabase')
        return NextResponse.json({ error: 'Failed to download file' }, { status: 500 })
      }

      const arrayBuffer = await fileData.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      
      inlineData = {
        data: buffer.toString('base64'),
        mimeType: filePath.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg'
      }
    } else if (url) {
      logger.info({ userId: user.id, url }, 'Fetching external URL')
      const res = await fetch(url)
      const html = await res.text()
      
      // Strip basic HTML
      rawTextContext = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                           .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                           .replace(/<[^>]+>/g, ' ')
                           .replace(/\s+/g, ' ')
                           .trim()
    }

    // 4. Prompt Injection Protection & Execution
    const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY })

    const prompt = `
      You are an expert, highly precise educational consultant AI.
      Analyze the provided document (or text extracted from a URL) and extract structured information.
      
      CRITICAL RULES:
      - NEVER hallucinate or guess.
      - NEVER invent deadlines.
      - NEVER invent eligibility requirements.
      - If specific information is unavailable or not explicitly stated in the document, you MUST return the exact string: "Not Found In Document".
      
      Return ONLY a valid JSON object matching this schema perfectly:
      {
        "title": "String, name of the opportunity",
        "category": "Scholarship | Circular | School Circular | Government Scheme | Scheme | Internship | Competition | Other",
        "document_type": "String, type of document analyzed",
        "plain_language_summary": "String, a simple 2-3 sentence explanation",
        "important_dates": {
          "deadline": "ISO 8601 Date String or 'Not Found In Document'",
          "other_dates": ["String: Event - Date"]
        },
        "eligibility_analysis": {
          "requirements": ["String" or "Not Found In Document"],
          "is_student_eligible_by_default": "Boolean or null"
        },
        "required_documents": ["String" or "Not Found In Document"],
        "opportunity_value": "String, exact value/prize/grant or 'Not Found In Document'",
        "opportunity_loss_analysis": "String, what the student concretely loses if they miss this",
        "readiness_score": "Integer 0-100",
        "risk_score": "Integer 0-100",
        "confidence_score": "Integer 0-100, your confidence in the extraction based on document clarity",
        "evidence_references": [
          { "claim": "String", "quote_from_document": "String" }
        ],
        "action_checklist": [
          { "step_number": 1, "title": "String", "description": "String" }
        ]
      }
    `

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const contents: any[] = [prompt]
    if (inlineData) {
      contents.push({ inlineData })
    } else if (rawTextContext) {
      // Prompt Injection Delimiters
      contents.push(`--- START OF USER URL CONTENT ---\n\n${rawTextContext}\n\n--- END OF USER URL CONTENT ---`)
    }

    logger.info({ userId: user.id }, 'Initiating Gemini generation')
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        responseMimeType: "application/json"
      }
    })

    const responseText = response.text
    if (!responseText) {
      throw new Error("Empty response from Gemini")
    }

    let rawAiResult: any = {}
    try {
      rawAiResult = JSON.parse(responseText)
    } catch (e) {
      throw new Error("Failed to parse JSON from Gemini")
    }

    const aiResponseSchema = z.object({
      title: z.string().optional(),
      category: z.string().optional(),
      plain_language_summary: z.string().optional(),
      important_dates: z.any().optional(),
      eligibility_analysis: z.any().optional(),
      required_documents: z.any().optional(),
      opportunity_value: z.string().optional(),
      opportunity_loss_analysis: z.string().optional(),
      readiness_score: z.coerce.number().optional(),
      risk_score: z.coerce.number().optional(),
      confidence_score: z.coerce.number().optional(),
      funding_amount: z.coerce.number().optional(),
      urgency_score: z.coerce.number().optional(),
      deadline_days_remaining: z.coerce.number().optional(),
      evidence_references: z.any().optional(),
      action_checklist: z.array(z.any()).optional(),
    }).passthrough()

    const parsedAiResult = aiResponseSchema.safeParse(rawAiResult)
    
    if (!parsedAiResult.success) {
      logger.error({ 
        errors: parsedAiResult.error.flatten(), 
        rawGeminiResponse: rawAiResult 
      }, 'Failed to validate Gemini response schema')
      
      return NextResponse.json({ 
        error: 'The AI generated an invalid response format.', 
        details: parsedAiResult.error.flatten() 
      }, { status: 422 })
    }

    const aiResult = parsedAiResult.data

    logger.info({ 
      rawGeminiResponse: rawAiResult, 
      parsedGeminiResponse: aiResult 
    }, 'Successfully parsed and validated Gemini response')

    const rawCategory = aiResult.category || 'Unknown'
    const normalizedCategory = rawCategory.toUpperCase().trim()

    const categoryMapping: Record<string, string> = {
      'SCHOLARSHIP': 'SCHOLARSHIP',
      'CIRCULAR': 'CIRCULAR',
      'SCHOOL CIRCULAR': 'CIRCULAR',
      'GOVERNMENT SCHEME': 'SCHEME',
      'SCHEME': 'SCHEME',
      'INTERNSHIP': 'INTERNSHIP',
      'COMPETITION': 'COMPETITION',
    }

    let finalCategory = categoryMapping[normalizedCategory] || 'OTHER'

    const validCategories = [
      'SCHOLARSHIP',
      'CIRCULAR',
      'SCHEME',
      'INTERNSHIP',
      'COMPETITION',
      'OTHER'
    ]

    if (!validCategories.includes(finalCategory)) {
      finalCategory = 'OTHER'
    }

    logger.info({ 
      rawCategory, 
      normalizedCategory, 
      finalDatabaseCategory: finalCategory 
    }, 'Category Normalization')

    // 5. Output Sanitization (XSS Protection)
    const sanitizeOptions = { allowedTags: [], allowedAttributes: {} }
    const sanitizedTitle = sanitizeHtml(aiResult.title || 'Unknown Opportunity', sanitizeOptions)
    const sanitizedSummary = sanitizeHtml(aiResult.plain_language_summary || '', sanitizeOptions)
    const sanitizedValue = sanitizeHtml(aiResult.opportunity_value || '', sanitizeOptions)
    const sanitizedLoss = sanitizeHtml(aiResult.opportunity_loss_analysis || '', sanitizeOptions)

    // 6. Save to Database securely
    const { data: oppRecord, error: oppError } = await supabase
      .from('opportunities')
      .insert({
        user_id: user.id,
        title: sanitizedTitle,
        category: finalCategory,
        storage_path: filePath || url || 'url-input',
        simplified_summary: sanitizedSummary,
        deadline: aiResult.important_dates?.deadline !== 'Not Found In Document' ? new Date(aiResult.important_dates?.deadline).toISOString() : null,
        eligibility_analysis: aiResult.eligibility_analysis || {},
        required_documents: aiResult.required_documents || [],
        opportunity_value: sanitizedValue,
        opportunity_loss_prediction: sanitizedLoss,
        readiness_score: aiResult.readiness_score || 0,
        risk_score: aiResult.risk_score || 0,
        confidence_score: aiResult.confidence_score || 0,
        evidence_references: aiResult.evidence_references || [],
        status: 'PROCESSED'
      })
      .select()
      .single()

    if (oppError || !oppRecord) {
      logger.error({ error: oppError }, 'Failed to insert opportunity into DB')
      throw new Error('Failed to save opportunity to database')
    }

    // 7. Save Action Steps
    if (aiResult.action_checklist && aiResult.action_checklist.length > 0) {
      const stepsToInsert = aiResult.action_checklist.map((step: { step_number: number, title: string, description: string }) => ({
        opportunity_id: oppRecord.id,
        step_number: step.step_number,
        title: sanitizeHtml(step.title, sanitizeOptions),
        description: sanitizeHtml(step.description, sanitizeOptions),
        status: 'PENDING'
      }))

      await supabase.from('action_steps').insert(stepsToInsert)
    }

    logger.info({ userId: user.id, opportunityId: oppRecord.id }, 'Successfully processed opportunity')
    
    return NextResponse.json({ id: oppRecord.id })

  } catch (error: unknown) {
    const err = error as Error
    logger.error({ error: err.message, stack: err.stack }, 'Fatal API Route Error')
    // Generic error to client, hide internal stack
    return NextResponse.json({ error: 'An unexpected error occurred during processing.' }, { status: 500 })
  }
}
