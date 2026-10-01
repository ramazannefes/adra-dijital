/**
 * In-memory sliding-window rate limiter.
 * Tek instance için yeterlidir; çoklu instance dağıtımında Redis'e taşınır.
 * Sunucu belleğinde yalnızca IP → zaman damgaları tutulur.
 */
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 5;

const buckets = new Map<string, number[]>();

export function isRateLimited(key: string): boolean {
  const now = Date.now();

  for (const [bucketKey, timestamps] of buckets) {
    const alive = timestamps.filter((time) => now - time < WINDOW_MS);
    if (alive.length === 0) {
      buckets.delete(bucketKey);
    } else {
      buckets.set(bucketKey, alive);
    }
  }

  const timestamps = buckets.get(key) ?? [];
  if (timestamps.length >= MAX_REQUESTS) return true;

  timestamps.push(now);
  buckets.set(key, timestamps);
  return false;
}
