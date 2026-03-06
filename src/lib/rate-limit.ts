import { NextRequest, NextResponse } from "next/server";

const windowMs = 60_000; // 1 minute

// Cap the number of tracked buckets to bound memory usage.
// In-memory store does not sync across Vercel instances — for stricter
// distributed rate limiting, replace with Upstash Redis or Vercel KV.
const MAX_BUCKETS = 10_000;

/** Per-key sliding window: array of request timestamps */
const store = new Map<string, number[]>();

// Periodic cleanup every 5 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, timestamps] of store) {
    const valid = timestamps.filter((t) => now - t < windowMs);
    if (valid.length === 0) store.delete(key);
    else store.set(key, valid);
  }
}, 5 * 60_000).unref?.();

function getIP(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

/**
 * Returns a 429 Response if the caller has exceeded `limit` requests
 * in the current 1-minute window, or `null` if the request is allowed.
 */
export function rateLimit(
  req: NextRequest,
  { key, limit }: { key: string; limit: number }
): NextResponse | null {
  const ip = getIP(req);
  const bucket = `${key}:${ip}`;
  const now = Date.now();

  const timestamps = (store.get(bucket) ?? []).filter(
    (t) => now - t < windowMs
  );

  if (timestamps.length >= limit) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  // Evict oldest buckets if we exceed the cap (memory safeguard)
  if (!store.has(bucket) && store.size >= MAX_BUCKETS) {
    const oldest = store.keys().next().value;
    if (oldest) store.delete(oldest);
  }

  timestamps.push(now);
  store.set(bucket, timestamps);
  return null;
}
