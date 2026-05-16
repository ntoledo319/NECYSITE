import { createHash } from "node:crypto"
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

// Redis is the only distributed limiter; in-memory is per-instance and won't survive multi-instance deploys.
// Production must have Redis. Without it we fail closed so an attacker can't bypass via instance hopping.
const isProduction = process.env.NODE_ENV === "production"

export async function rateLimit(key: string, options: RateLimitOptions): Promise<RateLimitResult> {
  if (!redis) {
    if (isProduction) {
      console.error("[rate-limit] Redis is not configured in production — failing closed")
      return { success: false, remaining: 0, resetMs: options.windowMs }
    }
    return rateLimitInMemory(key, options)
  }

  const { limit, windowMs } = options
  const now = Date.now()
  const windowSecs = Math.ceil(windowMs / 1000)

  const redisKey = `ratelimit:${key}`
  const cutoff = now - windowMs

  const pipeline = redis.pipeline()
  pipeline.zremrangebyscore(redisKey, 0, cutoff)
  pipeline.zcard(redisKey)
  pipeline.zadd(redisKey, { score: now, member: `${now}-${Math.random()}` })
  pipeline.expire(redisKey, windowSecs)
  pipeline.zrange(redisKey, 0, 0, { withScores: true })

  let results: unknown
  try {
    results = await pipeline.exec()
  } catch (err) {
    console.error("[rate-limit] Redis pipeline failed — failing closed:", err)
    return { success: false, remaining: 0, resetMs: windowMs }
  }

  if (!Array.isArray(results) || typeof results[1] !== "number") {
    console.error("[rate-limit] Unexpected Redis response shape — failing closed")
    return { success: false, remaining: 0, resetMs: windowMs }
  }

  const count = results[1]

  let resetMs = windowMs
  const oldestEntry = results[4]
  if (Array.isArray(oldestEntry) && oldestEntry.length >= 2) {
    const score = Number(oldestEntry[1])
    if (Number.isFinite(score)) {
      resetMs = Math.max(0, score + windowMs - now)
    }
  }

  if (count >= limit) {
    return {
      success: false,
      remaining: 0,
      resetMs,
    }
  }

  return {
    success: true,
    remaining: Math.max(0, limit - (count + 1)),
    resetMs,
  }
}

const RATE_LIMIT_IP_SALT = process.env.RATE_LIMIT_IP_SALT ?? "necypaa-ratelimit"

export function hashIdentifier(value: string): string {
  return createHash("sha256")
    .update(`${RATE_LIMIT_IP_SALT}:${value}`)
    .digest("hex")
    .slice(0, 16)
}

export function extractClientIp(headers: Headers | Record<string, string | string[] | undefined>): string {
  const get = (name: string): string | undefined => {
    if (headers instanceof Headers) return headers.get(name) ?? undefined
    const raw = headers[name] ?? headers[name.toLowerCase()]
    if (Array.isArray(raw)) return raw[0]
    return raw
  }

  const forwarded = get("x-forwarded-for")
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim()
    if (first) return first
  }

  return get("x-real-ip") ?? get("cf-connecting-ip") ?? get("x-vercel-forwarded-for") ?? "unknown"
}

function composeKey(prefix: string, parts: { ip: string; subject: string }): string {
  const ipHash = hashIdentifier(parts.ip)
  const subject = parts.subject.toLowerCase().trim()
  return `${prefix}:${ipHash}:${subject}`
}

export function formatResetSeconds(resetMs: number): number {
  return Math.max(1, Math.ceil(resetMs / 1000))
}

export async function rateLimitCheckout(parts: { ip: string; email: string }): Promise<RateLimitResult> {
  return rateLimit(composeKey("checkout", { ip: parts.ip, subject: parts.email }), {
    limit: 5,
    windowMs: 60_000,
  })
}

export async function rateLimitCodeRedemption(parts: { ip: string; email: string }): Promise<RateLimitResult> {
  return rateLimit(composeKey("code", { ip: parts.ip, subject: parts.email }), {
    limit: 3,
    windowMs: 60_000,
  })
}
