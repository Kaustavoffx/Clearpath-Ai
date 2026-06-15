// In-memory sliding window rate limiter
// Note: For multi-instance production deployments, this should be replaced with Redis (e.g., Upstash)

interface RateLimitInfo {
  count: number;
  resetTime: number;
}

const rateLimiterStore = new Map<string, RateLimitInfo>();

export async function rateLimit(
  identifier: string,
  limit: number = 5,
  windowMs: number = 60000 // 1 minute default
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  
  const now = Date.now();
  const record = rateLimiterStore.get(identifier);

  // If no record or record has expired
  if (!record || now > record.resetTime) {
    rateLimiterStore.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: now + windowMs,
    };
  }

  // If record exists and hasn't expired
  if (record.count >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      reset: record.resetTime,
    };
  }

  // Increment counter
  record.count += 1;
  return {
    success: true,
    limit,
    remaining: limit - record.count,
    reset: record.resetTime,
  };
}
