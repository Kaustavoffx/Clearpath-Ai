import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  
  if (process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }

  if (process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production') {
    return 'https://clearpath-ai-five.vercel.app';
  }

  return 'http://localhost:3000';
}

export function extractJsonFromGeminiResponse(rawResponse: string): { data: any, error: string | null, raw: string } {
  if (!rawResponse || typeof rawResponse !== 'string') {
    return { data: null, error: "Empty or invalid response type", raw: rawResponse }
  }

  let text = rawResponse.trim()

  // Remove markdown blocks if present (Case B & D)
  if (text.includes('```')) {
    const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)
    if (match && match[1]) {
      text = match[1].trim()
    }
  }

  try {
    // Attempt parsing directly (Case A and cleaned Case B/D)
    return { data: JSON.parse(text), error: null, raw: rawResponse }
  } catch (e) {
    // Fallback: extract substring from first '{' to last '}' (Case C)
    const firstBrace = text.indexOf('{')
    const lastBrace = text.lastIndexOf('}')

    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const candidate = text.substring(firstBrace, lastBrace + 1)
      try {
        return { data: JSON.parse(candidate), error: null, raw: rawResponse }
      } catch (innerError) {
        // Keep falling through
      }
    }

    // Fallback: extract substring from first '[' to last ']'
    const firstBracket = text.indexOf('[')
    const lastBracket = text.lastIndexOf(']')

    if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
      const candidate = text.substring(firstBracket, lastBracket + 1)
      try {
        return { data: JSON.parse(candidate), error: null, raw: rawResponse }
      } catch (innerError) {
        // Keep falling through
      }
    }

    return { 
      data: null, 
      error: e instanceof Error ? e.message : 'Unknown parsing error', 
      raw: rawResponse 
    }
  }
}
