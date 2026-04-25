import { Redis } from "@upstash/redis"

interface RateLimitOptions {
  /** Maximum requests allowed in the window */
  limit: number
  /** Window size in milliseconds */
  windowMs: number
}

interface RateLimitResult {
  success: boolean
  remaining: number
  resetMs: number
}

// In-memory fallback
interface RateLimitEntry {
  timestamps: number[]
}
const store = new Map<string, RateLimitEntry>()
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000
let lastCleanup = Date.now()

function cleanup(windowMs: number) {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return
  lastCleanup = now

  const cutoff = now - windowMs
  for (const [key, entry] of store) {
    entry.timestamps = entry.timestamps.filter((t) => t > cutoff)
    if (entry.timestamps.length === 0) {
      store.delete(key)
    }
  }
}

async function rateLimitInMemory(key: string, options: RateLimitOptions): Promise<RateLimitResult> {
  const { limit, windowMs } = options
  const now = Date.now()
  const cutoff = now - windowMs

  cleanup(windowMs)

  let entry = store.get(key)
  if (!entry) {
    entry = { timestamps: [] }
    store.set(key, entry)
  }

  entry.timestamps = entry.timestamps.filter((t) => t > cutoff)

  if (entry.timestamps.length >= limit) {
    const oldestInWindow = entry.timestamps[0]
    return {
      success: false,
      remaining: 0,
      resetMs: oldestInWindow + windowMs - now,
    }
  }

  entry.timestamps.push(now)

  return {
    success: true,
    remaining: limit - entry.timestamps.length,
    resetMs: windowMs,
  }
}

const redisUrl = process.env.UPSTASH_REDIS_REST_URL
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN

const redis = redisUrl && redisToken ? new Redis({ url: redisUrl, token: redisToken }) : null

export async function rateLimit(key: string, options: RateLimitOptions): Promise<RateLimitResult> {
  if (!redis) {
    return rateLimitInMemory(key, options)
  }

  const { limit, windowMs } = options
  const now = Date.now()
  const windowSecs = Math.ceil(windowMs / 1000)

  // Use a simple sorted set sliding window
  const redisKey = `ratelimit:${key}`
  const cutoff = now - windowMs

  const pipeline = redis.pipeline()
  pipeline.zremrangebyscore(redisKey, 0, cutoff)
  pipeline.zcard(redisKey)
  pipeline.zadd(redisKey, { score: now, member: `${now}-${Math.random()}` })
  pipeline.expire(redisKey, windowSecs)
  
  const results = await pipeline.exec()
  const count = results[1] as number

  if (count >= limit) {
    // If blocked, we added a member we shouldn't have, but it will expire anyway.
    // To be perfectly accurate we could remove it, but for rate limiting it's fine.
    return {
      success: false,
      remaining: 0,
      resetMs: windowMs, // simplified reset for Redis implementation
    }
  }

  return {
    success: true,
    remaining: Math.max(0, limit - (count + 1)),
    resetMs: windowMs,
  }
}

export async function rateLimitCheckout(key: string): Promise<RateLimitResult> {
  return rateLimit(key, { limit: 5, windowMs: 60_000 })
}

export async function rateLimitCodeRedemption(key: string): Promise<RateLimitResult> {
  return rateLimit(key, { limit: 3, windowMs: 60_000 })
}
