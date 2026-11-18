import { ApiError } from "./http";

const buckets = new Map<string, { hits: number; expiresAt: number }>();

export async function rateLimit(key: string, limit = 12, windowMs = 60000) {
  const now = Date.now();
  const current = buckets.get(key);
  if (!current || current.expiresAt <= now) {
    buckets.set(key, { hits: 1, expiresAt: now + windowMs });
    return;
  }
  if (current.hits >= limit) {
    throw new ApiError("RATE_LIMITED", "Too many requests. Please wait a minute and try again.", 429);
  }
  current.hits += 1;
}