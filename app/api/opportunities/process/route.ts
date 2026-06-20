import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { rateLimit } from '@/lib/security/rate-limit'
import { logger } from '@/lib/logger'

// Input Validation Schema
const processRequestSchema = z.object({
  filePath: z.string().min(1).optional(),
  url: z.string().url().optional(),
  profile: z.object({
    name: z.string().optional(),
    gradeLevel: z.string().optional(),
    state: z.string().optional(),
    incomeRange: z.string().optional(),
    category: z.string().optional(),
    careerInterest: z.string().optional(),
  }).optional()
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

    const { filePath, url, profile, documentHash } = parsedBody.data as any

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

    if (filePath && filePath.includes('..')) {
      logger.error({ userId: user.id, filePath }, 'Attempted path traversal')
      return NextResponse.json({ error: 'Invalid file path' }, { status: 400 })
    }

    // 3. Duplicate Prevention
    if (documentHash) {
      const { data: existingOpp } = await supabase
        .from('opportunities')
        .select('id')
        .eq('user_id', user.id)
        .eq('document_hash', documentHash)
        .single();
        
      if (existingOpp) {
        logger.info({ userId: user.id, oppId: existingOpp.id }, 'Duplicate document detected. Returning existing opportunity.');
        return NextResponse.json({ id: existingOpp.id, isDuplicate: true });
      }
    }

    const { data: jobRecord, error: jobError } = await supabase
      .from('processing_jobs')
      .insert({
        user_id: user.id,
        file_name: filePath || url || 'unknown',
        document_hash: documentHash || null,
        status: 'queued',
        stage: 'Initializing',
        progress: 0
      })
      .select()
      .single()

    if (jobError || !jobRecord) {
      logger.error({ error: jobError }, 'Failed to insert processing job into DB')
      throw new Error('Failed to create processing job')
    }

    logger.info({ userId: user.id, jobId: jobRecord.id }, 'Successfully created processing job')
    
    // 4. Return immediately for background processing UI
    return NextResponse.json({ id: jobRecord.id })

  } catch (error: unknown) {
    const err = error as Error
    logger.error({ error: err.message, stack: err.stack }, 'Fatal API Route Error in Ingestion')
    return NextResponse.json({ error: 'An unexpected error occurred during ingestion.' }, { status: 500 })
  }
}
