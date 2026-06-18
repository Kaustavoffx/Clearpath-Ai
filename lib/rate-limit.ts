// Simplified in-memory rate limiter for the hackathon
// If Upstash Redis is available, this should be replaced with @upstash/ratelimit

type RateLimitStore = {
  [key: string]: {
    count: number;
    resetAt: number;
  }
};

const store: RateLimitStore = {};

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Basic in-memory rate limiter
 * @param identifier Unique identifier for the user/IP
 * @param limit Maximum number of requests allowed
 * @param windowMs Time window in milliseconds
 */
export async function rateLimit(
  identifier: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  const now = Date.now();
  
  // Cleanup expired entries
  if (store[identifier] && store[identifier].resetAt < now) {
    delete store[identifier];
  }
  
  if (!store[identifier]) {
    store[identifier] = {
      count: 0,
      resetAt: now + windowMs
    };
  }
  
  store[identifier].count++;
  
  const isAllowed = store[identifier].count <= limit;
  const remaining = Math.max(0, limit - store[identifier].count);
  
  return {
    success: isAllowed,
    limit,
    remaining,
    reset: store[identifier].resetAt
  };
}

// Pre-configured limits per the spec
export const LIMITS = {
  DOCUMENT_ANALYSIS: { limit: 3, windowMs: 60 * 1000 }, // 3 per minute
  ADVISOR: { limit: 10, windowMs: 60 * 1000 },          // 10 per minute
  VOICE: { limit: 15, windowMs: 60 * 1000 }             // 15 per minute
};
