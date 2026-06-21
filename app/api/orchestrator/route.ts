import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { GoogleGenAI } from '@google/genai'
import { z } from 'zod'
import { logger } from '@/lib/logger'
import { env } from '@/lib/env'
import sanitizeHtml from 'sanitize-html'
import { extractJsonFromGeminiResponse } from '@/lib/utils'
import { RuleEngine } from '@/lib/rule-engine'
import OpenAI from 'openai'
import { safeDate } from '@/lib/date-utils'

const orchestratorSchema = z.object({
  jobId: z.string().uuid(),
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
    
    // Simple metadata extraction for recovery
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    const title = titleMatch ? titleMatch[1] : '';
    const description = descMatch ? descMatch[1] : '';

    const cleanText = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
               .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
               .replace(/<[^>]+>/g, ' ')
               .replace(/\s+/g, ' ')
               .trim();
    
    return `Title: ${title}\nDescription: ${description}\n\n${cleanText}`;
  } catch (error) {
    clearTimeout(timeoutId);
    throw new Error('Failed to scrape URL within 10 seconds or access was denied.');
  }
}

async function runGeminiWithAdaptiveTimeout(ai: GoogleGenAI, contents: any[], textLength: number): Promise<string> {
  // Adaptive Timeout Phase 3
  let timeoutMs = 20000; // Small PDF
  if (textLength > 15000) timeoutMs = 40000; // Medium
  if (textLength > 30000) timeoutMs = 60000; // Large
  if (textLength > 50000) timeoutMs = 90000; // Very Large

  logger.info(`Using adaptive timeout: ${timeoutMs}ms for ${textLength} chars`);

  const generatePromise = ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: contents,
    config: { responseMimeType: "application/json" }
  });

  const timeoutPromise = new Promise((_, reject) => 
    setTimeout(() => reject(new Error('AI Request Timed Out (Adaptive)')), timeoutMs)
  );

  const response = await Promise.race([generatePromise, timeoutPromise]) as any;
  if (!response.text) throw new Error("Empty response from Gemini");
  
  return response.text;
}

async function runOpenAI(textContext: string, prompt: string): Promise<string> {
  if (!env.OPENAI_API_KEY) throw new Error("OpenAI key not configured");
  const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: "You are a helpful assistant that extracts opportunity details in JSON format exactly as requested." },
      { role: "user", content: `${prompt}\n\n--- CONTENT ---\n${textContext}\n--- END CONTENT ---`}
    ]
  }, { timeout: 30000 });

  const result = response.choices[0].message.content;
  if (!result) throw new Error("Empty response from OpenAI");
  return result;
}

export async function POST(request: Request) {
  const startTime = Date.now();
  
  try {
    const rawBody = await request.json();
    const parsedBody = orchestratorSchema.safeParse(rawBody);

    if (!parsedBody.success) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const { jobId, profile } = parsedBody.data;
    const supabase = await createClient();

    // Helper to log status to UI
    const logStatus = async (msg: string, progress: number, status: string = 'processing') => {
      try {
        await supabase.from('processing_jobs').update({ stage: msg, progress, status, updated_at: safeDate(new Date()) }).eq('id', jobId);
      } catch (e) {
        // Ignore DB update errors for status
      }
    };

    const { data: jobRecord } = await supabase.from('processing_jobs').select('*').eq('id', jobId).single();
    if (!jobRecord) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const pathOrUrl = jobRecord.file_name;
    let rawTextContext = "";
    let inlineData = null; // We'll still keep this if we want Gemini to do native PDF, but we'll extract text for fallback/chunking

    await logStatus("Downloading document...", 10);

    // Determine if URL or File
    if (pathOrUrl.startsWith('http')) {
      try {
        await logStatus("Scraping URL...", 20);
        rawTextContext = await extractTextFromUrl(pathOrUrl);
      } catch (e) {
        rawTextContext = "This website could not be processed. Please upload the PDF version or try another source.";
      }
    } else {
      await logStatus("Reading PDF...", 20);
      const { data: fileData } = await supabase.storage.from('opportunities').download(pathOrUrl);
      if (fileData) {
        const arrayBuffer = await fileData.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        try {
          await logStatus("Extracting Text...", 30);
          const pdf = require('pdf-parse');
          const pdfData = await pdf(buffer);
          rawTextContext = pdfData.text;
          
          if (pdfData.numpages > 20) {
            logger.info(`Large PDF detected (${pdfData.numpages} pages)`);
          }
        } catch (e) {
          logger.warn("PDF-Parse failed, will rely entirely on Gemini inlineData if possible");
        }

        // Phase 7: External URL Recovery
        const urlMatch = rawTextContext.match(/(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9.-]+\.gov\.in)/);
        if (urlMatch) {
          try {
            await logStatus("Fetching detected URL for extra context...", 35);
            let fetchUrl = urlMatch[1];
            if (!fetchUrl.startsWith('http')) fetchUrl = 'https://' + fetchUrl;
            const extraText = await extractTextFromUrl(fetchUrl);
            rawTextContext += "\n\n--- SUPPLEMENTAL WEBSITE CONTEXT ---\n" + extraText;
          } catch (e) {
            logger.warn("Failed to fetch supplemental URL");
          }
        }

        inlineData = {
          data: buffer.toString('base64'),
          mimeType: pathOrUrl.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg'
        };
      } else {
        logger.error("Failed to download file");
        rawTextContext = "Document download failed. We could not analyze the contents. Please manually verify requirements.";
      }
    }

    // Phase 2: Document Chunking (Approximate by char length if > 60000 chars roughly 20 pages)
    let chunks: string[] = [];
    if (rawTextContext.length > 60000) {
      await logStatus("Document is large. Chunking into smaller segments...", 40);
      const chunkSize = 15000;
      for (let i = 0; i < rawTextContext.length; i += chunkSize) {
        chunks.push(rawTextContext.substring(i, i + chunkSize));
      }
      logger.info(`Split document into ${chunks.length} chunks`);
    } else {
      chunks = [rawTextContext];
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
      - Every insight MUST be backed by a direct quote from the document.
      - If you cannot find a piece of information, return null or an empty array. Do NOT invent defaults.
      - Return ONLY a JSON object exactly matching this schema:
      {
        "title": "String",
        "category": "SCHOLARSHIP | CIRCULAR | SCHEME | INTERNSHIP | COMPETITION | OTHER",
        "plain_language_summary": "String",
        "important_dates": { "deadline": "String or null if not explicitly found" },
        "eligibility_analysis": {
          "requirements": [
            {
              "value": "String (e.g. [MATCHED] Income below 2.5L)",
              "source_quote": "Exact quote from document",
              "page_number": "String or number",
              "confidence_score": 0-100
            }
          ]
        },
        "required_documents": [
            {
              "value": "String (e.g. Income Certificate)",
              "source_quote": "Exact quote from document",
              "page_number": "String or number",
              "confidence_score": 0-100
            }
        ],
        "opportunity_value": "String",
        "opportunity_loss_analysis": "String",
        "risk_score": 0,
        "confidence_score": 0,
        "evidence_references": [{"claim": "String", "quote_from_document": "String", "confidence_score": 0, "risk_assessment": "String"}],
        "action_checklist": [
          {
            "step_number": 1,
            "title": "String",
            "description": "String",
            "source_quote": "Exact quote from document",
            "page_number": "String or number",
            "confidence_score": 0-100
          }
        ]
      }
    `;

    let finalAiResult: any = null;
    let usedProvider = "gemini";
    let successfulChunks = 0;
    
    // We will process up to 5 chunks to avoid timeouts on extremely large files
    const chunksToProcess = chunks.slice(0, 5);

    for (let i = 0; i < chunksToProcess.length; i++) {
      const targetChunk = chunksToProcess[i];
      await logStatus(`Analyzing chunk ${i + 1} of ${chunksToProcess.length}...`, 40 + (i * 5));
      
      const contents: any[] = [prompt];
      if (inlineData && chunks.length === 1) {
        contents.push({ inlineData });
      } else {
        contents.push(`--- CONTENT ---\n${targetChunk}\n--- END CONTENT ---`);
      }

      let chunkResult = null;

      try {
        const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
        const responseText = await runGeminiWithAdaptiveTimeout(ai, contents, targetChunk.length);
        const { data: rawAiResult } = extractJsonFromGeminiResponse(responseText);
        if (rawAiResult) chunkResult = rawAiResult;
      } catch (geminiError) {
        logger.warn(`Gemini failed on chunk ${i}. Trying OpenAI fallback...`);
        try {
          const responseText = await runOpenAI(targetChunk, prompt);
          chunkResult = JSON.parse(responseText);
          usedProvider = "openai";
        } catch (openAiError) {
          logger.error(`OpenAI failed on chunk ${i}.`);
        }
      }

      if (chunkResult) {
        successfulChunks++;
        if (!finalAiResult) {
          finalAiResult = chunkResult; // take first chunk as base
        } else {
          // Merge arrays
          if (chunkResult.action_checklist) {
            finalAiResult.action_checklist = [...(finalAiResult.action_checklist || []), ...chunkResult.action_checklist];
          }
          if (chunkResult.evidence_references) {
            finalAiResult.evidence_references = [...(finalAiResult.evidence_references || []), ...chunkResult.evidence_references];
          }
          if (chunkResult.required_documents) {
            finalAiResult.required_documents = [...(finalAiResult.required_documents || []), ...chunkResult.required_documents];
          }
          if (chunkResult.eligibility_analysis?.requirements) {
            if (!finalAiResult.eligibility_analysis) finalAiResult.eligibility_analysis = { requirements: [] };
            finalAiResult.eligibility_analysis.requirements = [
              ...(finalAiResult.eligibility_analysis.requirements || []),
              ...chunkResult.eligibility_analysis.requirements
            ];
          }
        }
      }
    }

    if (successfulChunks === 0) {
      logger.error("All AI providers failed on all chunks. Engaging Rule Engine Fallback...");
      await logStatus("Engaging Deterministic Rule Engine...", 75);
      finalAiResult = RuleEngine.extract(rawTextContext);
      usedProvider = "rule_engine";
      successfulChunks = 1; // Mark as successful to avoid hard fail
    }

    await logStatus("Verifying Evidence...", 80);

    // Phase 8: Response Validation & Repair
    const evidenceInsightSchema = z.object({
      value: z.string(),
      source_quote: z.string(),
      page_number: z.union([z.string(), z.number()]).optional(),
      confidence_score: z.coerce.number()
    });

    const aiResponseSchema = z.object({
      title: z.string().catch("Unknown Opportunity"),
      category: z.string().catch("OTHER"),
      plain_language_summary: z.string().catch("Summary could not be generated."),
      important_dates: z.any().catch({ deadline: null }),
      eligibility_analysis: z.object({ requirements: z.array(evidenceInsightSchema).catch([]) }).catch({ requirements: [] }),
      required_documents: z.array(evidenceInsightSchema).catch([]),
      opportunity_value: z.string().catch("Not Found In Document"),
      opportunity_loss_analysis: z.string().catch("Loss analysis unavailable."),
      risk_score: z.coerce.number().catch(0),
      confidence_score: z.coerce.number().catch(0),
      evidence_references: z.array(z.any()).catch([]),
      action_checklist: z.array(z.any()).catch([]),
    }).passthrough();

    const repairedResult = aiResponseSchema.parse(finalAiResult);

    // Dynamic Category checking
    const finalCategory = repairedResult.confidence_score >= 80 && ['SCHOLARSHIP', 'CIRCULAR', 'SCHEME', 'INTERNSHIP', 'COMPETITION'].includes(repairedResult.category.toUpperCase()) 
      ? repairedResult.category.toUpperCase() 
      : 'OTHER';

    // Save back to DB
    const sanitizeOptions = { allowedTags: [], allowedAttributes: {} };
    
    await logStatus("Finalizing Opportunity...", 90);

    const titlePlaceholder = pathOrUrl.startsWith('http') ? `Link: ${new URL(pathOrUrl).hostname}` : (pathOrUrl?.split('/').pop() || 'Uploaded Document');
    const finalTitle = sanitizeHtml(repairedResult.title && repairedResult.title !== 'Unknown Opportunity' ? repairedResult.title : titlePlaceholder, sanitizeOptions);
    
    // QUALITY GATE: Validate constraints before DB insertion
    if (!finalTitle || finalTitle.trim() === '') {
      throw new Error("Quality Gate Failed: Opportunity Name is empty");
    }
    
    if (finalCategory === 'OTHER' && usedProvider !== 'rule_engine') {
      throw new Error("Quality Gate Failed: Opportunity Type is unknown");
    }

    const hasActionPlan = repairedResult.action_checklist && repairedResult.action_checklist.length > 0;
    if (!hasActionPlan) {
      throw new Error("Quality Gate Failed: Action Plan has 0 actions");
    }
    
    const hasEvidence = repairedResult.evidence_references && repairedResult.evidence_references.length > 0;
    if (!hasEvidence) {
      throw new Error("Quality Gate Failed: Evidence has 0 sources");
    }

    if (typeof repairedResult.confidence_score !== 'number' || isNaN(repairedResult.confidence_score)) {
      throw new Error("Quality Gate Failed: Invalid confidence score");
    }

    const finalSummary = sanitizeHtml(repairedResult.plain_language_summary, sanitizeOptions);
    if (!finalSummary || finalSummary.trim() === '' || finalSummary === 'Summary could not be generated.') {
      throw new Error("Quality Gate Failed: Summary is missing");
    }

    const invalidDeadlines = ['Not Found In Document', 'No Deadline Found', 'Unknown', 'N/A', 'None', 'null'];
    const parsedDeadline = repairedResult.important_dates?.deadline;
    const finalDeadline = parsedDeadline && !invalidDeadlines.includes(parsedDeadline) ? safeDate(parsedDeadline) : null;

    const { data: newOpp, error: insertError } = await supabase.from('opportunities').insert({
      id: jobId,
      user_id: jobRecord.user_id,
      document_hash: jobRecord.document_hash || null,
      title: finalTitle,
      category: finalCategory,
      storage_path: pathOrUrl,
      simplified_summary: sanitizeHtml(repairedResult.plain_language_summary, sanitizeOptions),
      deadline: finalDeadline,
      eligibility_analysis: repairedResult.eligibility_analysis || {},
      required_documents: repairedResult.required_documents || [],
      opportunity_value: sanitizeHtml(repairedResult.opportunity_value || '', sanitizeOptions),
      opportunity_loss_prediction: sanitizeHtml(repairedResult.opportunity_loss_analysis || '', sanitizeOptions),
      risk_score: repairedResult.risk_score,
      confidence_score: repairedResult.confidence_score,
      evidence_references: repairedResult.evidence_references || [],
      processing_message: 'Analysis Complete',
      processing_metadata: { provider: usedProvider, total_chunks: chunks.length, successful_chunks: successfulChunks },
      status: 'PROCESSED'
    }).select().single();

    if (insertError || !newOpp) {
      throw new Error("Failed to insert completed opportunity: " + JSON.stringify(insertError));
    }


    if (repairedResult.action_checklist && repairedResult.action_checklist.length > 0) {
      const stepsToInsert = repairedResult.action_checklist.map((step: any) => ({
        opportunity_id: jobId,
        step_number: step.step_number || 1,
        title: sanitizeHtml(step.title || "Step", sanitizeOptions),
        description: sanitizeHtml(step.description || "Action required", sanitizeOptions),
        status: 'PENDING',
        source_quote: step.source_quote ? sanitizeHtml(step.source_quote, sanitizeOptions) : null,
        page_number: step.page_number ? String(step.page_number) : null,
        confidence_score: step.confidence_score || 0
      }));
      await supabase.from('action_steps').insert(stepsToInsert);
    }

    await logStatus("Completed", 100, "completed");

    // Phase 10: Logging
    logger.info({
      processing_time: Date.now() - startTime,
      provider_used: usedProvider,
      document_size: inlineData ? inlineData.data.length : rawTextContext.length,
      jobId,
      status: 'PROCESSED'
    }, 'Background Document Processing Complete');

    // SINGLE SOURCE OF TRUTH: Usage Logging
    if (usedProvider !== "rule_engine") {
      try {
        await supabase.from('usage_logs').insert({
          user_id: jobRecord.user_id,
          service: usedProvider === 'openai' ? 'OpenAI' : 'Gemini',
          operation: 'Document Analysis'
        });
      } catch (e) {
        logger.error("Failed to log usage metrics");
      }
    }

    return NextResponse.json({ success: true, provider: usedProvider });

  } catch (error: any) {
    logger.error({ error: error.message, stack: error.stack }, 'Fatal API Route Error in Orchestrator');
    
    try {
      const supabase = await createClient();
      const parsedBody = orchestratorSchema.safeParse(await request.clone().json().catch(() => ({})));
      if (parsedBody.success) {
        await supabase.from('processing_jobs').update({ status: 'failed', error: error.message, stage: 'Failed' }).eq('id', parsedBody.data.jobId);
      }
    } catch (e) {}

    // Phase 9: Graceful fail, never a 500 error screen. We update status to failed.
    return NextResponse.json({ error: 'Analysis could not be completed.' }, { status: 200 }); // Return 200 so UI doesn't blow up if it uses fetch without checking ok
  }
}
