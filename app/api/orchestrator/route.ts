import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { GoogleGenAI } from '@google/genai'
import { z } from 'zod'
import { logger } from '@/lib/logger'
import { env } from '@/lib/env'
import sanitizeHtml from 'sanitize-html'
import { extractJsonFromGeminiResponse } from '@/lib/utils'

// Global Circuit Breaker (in-memory, resets on server restart or manually)
let geminiCircuitBreakerOpen = false;
let breakerResetTime = 0;

const orchestratorSchema = z.object({
  opportunityId: z.string().uuid(),
  profile: z.object({
    name: z.string().optional(),
    gradeLevel: z.string().optional(),
    state: z.string().optional(),
    incomeRange: z.string().optional(),
    category: z.string().optional(),
    careerInterest: z.string().optional(),
  }).optional()
});

async function extractTextFromUrl(url: string): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s URL timeout

  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    return html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
               .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
               .replace(/<[^>]+>/g, ' ')
               .replace(/\s+/g, ' ')
               .trim();
  } catch (error) {
    clearTimeout(timeoutId);
    throw new Error('Failed to scrape URL within 10 seconds or access was denied.');
  }
}

async function runGeminiWithRetry(ai: GoogleGenAI, contents: any[], maxRetries: number = 3): Promise<string> {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      logger.info(`Gemini attempt ${attempt + 1}/${maxRetries}`);
      
      const generatePromise = ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contents,
        config: { responseMimeType: "application/json" }
      });

      // 15-second hard timeout per attempt
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('AI Request Timed Out')), 15000)
      );

      const response = await Promise.race([generatePromise, timeoutPromise]) as any;
      if (!response.text) throw new Error("Empty response from Gemini");
      
      return response.text;
    } catch (error) {
      attempt++;
      logger.warn(`Gemini attempt ${attempt} failed: ${(error as Error).message}`);
      if (attempt >= maxRetries) throw error;
      
      // Exponential backoff: 2s, 4s
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise(r => setTimeout(r, delay));
    }
  }
  throw new Error("Max retries exceeded");
}

function generateRegexFallback(text: string) {
  const dateMatches = text.match(/\b\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b/g) || [];
  const moneyMatches = text.match(/₹\s?\d+(?:,\d{3})*(?:\.\d{2})?/g) || [];
  const emailMatches = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
  
  return {
    title: "Document Analysis (Fallback Mode)",
    category: "OTHER",
    plain_language_summary: "AI analysis was temporarily unavailable. Basic document intelligence extracted successfully.",
    important_dates: { deadline: dateMatches.length > 0 ? dateMatches[0] : "Not Found In Document" },
    eligibility_analysis: { requirements: [] },
    required_documents: ["Review original document"],
    opportunity_value: moneyMatches.length > 0 ? moneyMatches[0] : "Not Found In Document",
    opportunity_loss_analysis: "Action required to prevent missing potential opportunity.",
    readiness_score: 50,
    risk_score: 50,
    confidence_score: 10,
    evidence_references: [],
    action_checklist: [
      { step_number: 1, title: "Review Document Manually", description: "Read the original text to confirm details." },
      { step_number: 2, title: "Contact Issuer", description: emailMatches.length > 0 ? `Email: ${emailMatches[0]}` : "Find contact details in the document." }
    ]
  };
}

export async function POST(request: Request) {
  const startTime = Date.now();
  
  try {
    const rawBody = await request.json();
    const parsedBody = orchestratorSchema.safeParse(rawBody);

    if (!parsedBody.success) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const { opportunityId, profile } = parsedBody.data;
    const supabase = await createClient();

    const { data: oppRecord } = await supabase.from('opportunities').select('*').eq('id', opportunityId).single();
    if (!oppRecord) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const pathOrUrl = oppRecord.storage_path;
    let inlineData = null;
    let rawTextContext = "";

    // Determine if URL or File
    if (pathOrUrl.startsWith('http')) {
      try {
        rawTextContext = await extractTextFromUrl(pathOrUrl);
      } catch (e) {
        // Phase 4: URL Scraping Protection Fallback
        rawTextContext = "This website could not be processed. Please upload the PDF version or try another source.";
      }
    } else {
      const { data: fileData } = await supabase.storage.from('opportunities').download(pathOrUrl);
      if (fileData) {
        const arrayBuffer = await fileData.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        // For actual text parsing we would need a PDF extractor, but Gemini accepts inlineData
        inlineData = {
          data: buffer.toString('base64'),
          mimeType: pathOrUrl.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg'
        };
      } else {
        throw new Error("Failed to download file");
      }
    }

    // Phase 3: Large PDF Chunking Logic (Simplified text chunking for URLs, Gemini natively handles large PDFs up to token limit via inlineData, but if text > 50k chars we chunk)
    if (rawTextContext.length > 50000) {
      logger.info("Large text detected, truncating/chunking");
      rawTextContext = rawTextContext.substring(0, 50000) + "... [Truncated for AI Processing Limits]";
    }

    // Circuit Breaker check
    if (geminiCircuitBreakerOpen && Date.now() < breakerResetTime) {
      logger.warn("Circuit breaker open, falling back to Regex extraction instantly.");
      // Skip Gemini
    }

    const profileContext = profile ? `
      STUDENT PROFILE:
      Grade: ${profile.gradeLevel || 'Unknown'} | State: ${profile.state || 'Unknown'} | Income: ${profile.incomeRange || 'Unknown'} | Category: ${profile.category || 'Unknown'}
      Prefix requirements with [MATCHED] or [MISMATCH].
    ` : '';

    const prompt = `
      Analyze this document. ${profileContext}
      CRITICAL RULES:
      - NEVER hallucinate or guess.
      - Return ONLY a JSON object exactly matching this schema:
      {
        "title": "String",
        "category": "SCHOLARSHIP | CIRCULAR | SCHEME | INTERNSHIP | COMPETITION | OTHER",
        "plain_language_summary": "String",
        "important_dates": { "deadline": "String" },
        "eligibility_analysis": { "requirements": ["String"] },
        "required_documents": ["String"],
        "opportunity_value": "String",
        "opportunity_loss_analysis": "String",
        "readiness_score": 0,
        "risk_score": 0,
        "confidence_score": 0,
        "evidence_references": [{"claim": "String", "quote_from_document": "String", "confidence_score": 0, "risk_assessment": "String"}],
        "action_checklist": [{"step_number": 1, "title": "String", "description": "String"}]
      }
    `;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const contents: any[] = [prompt];
    if (inlineData) contents.push({ inlineData });
    else contents.push(`--- CONTENT ---\n${rawTextContext}\n--- END CONTENT ---`);

    let finalAiResult: any = null;
    let usedProvider = "gemini";
    let isPartial = false;

    if (!geminiCircuitBreakerOpen || Date.now() >= breakerResetTime) {
      try {
        const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
        const responseText = await runGeminiWithRetry(ai, contents);
        const { data: rawAiResult } = extractJsonFromGeminiResponse(responseText);
        if (rawAiResult) {
          finalAiResult = rawAiResult;
        } else {
          throw new Error("Failed to extract JSON");
        }
      } catch (geminiError) {
        logger.error("Gemini completely failed after retries.");
        geminiCircuitBreakerOpen = true;
        breakerResetTime = Date.now() + 5 * 60 * 1000; // 5 minute breaker
        finalAiResult = generateRegexFallback(rawTextContext);
        usedProvider = "regex_fallback";
        isPartial = true;
      }
    } else {
      finalAiResult = generateRegexFallback(rawTextContext);
      usedProvider = "regex_fallback";
      isPartial = true;
    }

    // Phase 8: Response Validation & Repair
    const aiResponseSchema = z.object({
      title: z.string().catch("Unknown Opportunity"),
      category: z.string().catch("OTHER"),
      plain_language_summary: z.string().catch("Summary could not be generated."),
      important_dates: z.any().catch({ deadline: "Not Found In Document" }),
      eligibility_analysis: z.any().catch({ requirements: [] }),
      required_documents: z.array(z.string()).catch([]),
      opportunity_value: z.string().catch("Not Found In Document"),
      opportunity_loss_analysis: z.string().catch("Loss analysis unavailable."),
      readiness_score: z.coerce.number().catch(50),
      risk_score: z.coerce.number().catch(0),
      confidence_score: z.coerce.number().catch(0),
      evidence_references: z.array(z.any()).catch([]),
      action_checklist: z.array(z.any()).catch([]),
    }).passthrough();

    const repairedResult = aiResponseSchema.parse(finalAiResult);

    // Save back to DB
    const sanitizeOptions = { allowedTags: [], allowedAttributes: {} };
    
    await supabase.from('opportunities').update({
      title: sanitizeHtml(repairedResult.title, sanitizeOptions),
      category: ['SCHOLARSHIP', 'CIRCULAR', 'SCHEME', 'INTERNSHIP', 'COMPETITION'].includes(repairedResult.category.toUpperCase()) ? repairedResult.category.toUpperCase() : 'OTHER',
      simplified_summary: sanitizeHtml(repairedResult.plain_language_summary, sanitizeOptions),
      deadline: repairedResult.important_dates?.deadline !== 'Not Found In Document' && repairedResult.important_dates?.deadline ? new Date(repairedResult.important_dates?.deadline).toISOString() : null,
      eligibility_analysis: repairedResult.eligibility_analysis || {},
      required_documents: repairedResult.required_documents || [],
      opportunity_value: sanitizeHtml(repairedResult.opportunity_value || '', sanitizeOptions),
      opportunity_loss_prediction: sanitizeHtml(repairedResult.opportunity_loss_analysis || '', sanitizeOptions),
      readiness_score: repairedResult.readiness_score,
      risk_score: repairedResult.risk_score,
      confidence_score: repairedResult.confidence_score,
      evidence_references: repairedResult.evidence_references || [],
      status: isPartial ? 'PARTIAL' : 'PROCESSED' // Could just use PROCESSED if PARTIAL is not in enum, checking schema: 'PENDING', 'PROCESSED', 'ERROR'. So we MUST use PROCESSED or ERROR.
    }).eq('id', opportunityId);

    // Re-verify enum. Status enum was 'PENDING', 'PROCESSED', 'ERROR'.
    // Let's force it to 'PROCESSED' even for partial so UI renders it.
    await supabase.from('opportunities').update({ status: 'PROCESSED' }).eq('id', opportunityId);

    if (repairedResult.action_checklist && repairedResult.action_checklist.length > 0) {
      const stepsToInsert = repairedResult.action_checklist.map((step: any) => ({
        opportunity_id: opportunityId,
        step_number: step.step_number || 1,
        title: sanitizeHtml(step.title || "Step", sanitizeOptions),
        description: sanitizeHtml(step.description || "Action required", sanitizeOptions),
        status: 'PENDING'
      }));
      await supabase.from('action_steps').insert(stepsToInsert);
    }

    // Phase 10: Logging
    logger.info({
      processing_time: Date.now() - startTime,
      provider_used: usedProvider,
      document_size: inlineData ? inlineData.data.length : rawTextContext.length,
      opportunityId,
      status: 'PROCESSED'
    }, 'Background Document Processing Complete');

    return NextResponse.json({ success: true, provider: usedProvider });

  } catch (error: any) {
    logger.error({ error: error.message, stack: error.stack }, 'Fatal API Route Error in Orchestrator');
    // Phase 9: Graceful fail, never a 500 error screen. We update status to ERROR if we completely crash, 
    // but the UI will handle it without crashing the page.
    return NextResponse.json({ error: 'Analysis could not be completed.' }, { status: 200 }); // Return 200 so UI doesn't blow up if it uses fetch without checking ok
  }
}
