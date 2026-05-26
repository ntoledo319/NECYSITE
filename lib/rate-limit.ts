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
const isProduction = process.env.NODE_ENV === "production"

interface RateLimitInternalOptions extends RateLimitOptions {
  /**
   * When Redis is unavailable (not configured, or errors during the call),
   * default behavior is to FAIL CLOSED — return a "rate limited" verdict
   * so an attacker can't bypass by spawning instances. Set `failOpen: true`
   * for paths where blocking a legitimate user is worse than letting an
   * attacker through, like the paid checkout flow — there, Stripe's own
   * rate limits + the typed-error layer absorb abuse, but a real customer
   * being shown "Too many checkout attempts" on their first try is fatal.
   */
  failOpen?: boolean
}

export async function rateLimit(key: string, options: RateLimitInternalOptions): Promise<RateLimitResult> {
  if (!redis) {
    if (isProduction) {
      if (options.failOpen) {
        // Loud one-time-per-process warning so the team sees it. The first
        // failure path also writes a structured log via the caller.
        console.error("[rate-limit] CRITICAL: Redis not configured in production — failing open for key:", key)
        return { success: true, remaining: options.limit, resetMs: options.windowMs }
      }
      console.error("[rate-limit] Redis is not configured in production — failing closed for key:", key)
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
    console.error(`[rate-limit] Redis pipeline failed for key ${key} — failing ${options.failOpen ? "open" : "closed"}:`, err)
    return options.failOpen
      ? { success: true, remaining: options.limit, resetMs: windowMs }
      : { success: false, remaining: 0, resetMs: windowMs }
  }

  if (!Array.isArray(results) || typeof results[1] !== "number") {
    console.error(`[rate-limit] Unexpected Redis response shape for key ${key} — failing ${options.failOpen ? "open" : "closed"}`)
    return options.failOpen
      ? { success: true, remaining: options.limit, resetMs: windowMs }
      : { success: false, remaining: 0, resetMs: windowMs }
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
    // Paid checkout fails OPEN if Redis is broken — Stripe has its own
    // rate limits and locking a real customer out of their registration
    // is worse than letting bots try a few times. BotID is the proper
    // bot defense for this path.
    failOpen: true,
  })
}

export async function rateLimitCodeRedemption(parts: { ip: string; email: string }): Promise<RateLimitResult> {
  return rateLimit(composeKey("code", { ip: parts.ip, subject: parts.email }), {
    limit: 3,
    windowMs: 60_000,
  })
}

/**
 * Second limiter for access-code redemption, keyed on IP only. Without this
 * an attacker on one IP could brute-force codes by cycling emails because the
 * primary limiter includes email in its key.
 */
export async function rateLimitCodeRedemptionByIp(parts: { ip: string }): Promise<RateLimitResult> {
  const ipHash = hashIdentifier(parts.ip)
  return rateLimit(`code-ip:${ipHash}`, {
    limit: 20,
    windowMs: 60_000,
  })
}

/**
 * Read-only rate-limit variant that FAILS OPEN when Redis isn't configured.
 * Use for routes where blocking a legitimate user is worse than missing a
 * spam wave — confirmation page views, public health checks. Don't use for
 * anything that mutates state.
 */
export async function rateLimitReadOnly(key: string, options: RateLimitOptions): Promise<RateLimitResult> {
  if (!redis) {
    return { success: true, remaining: options.limit, resetMs: options.windowMs }
  }
  return rateLimit(key, { ...options, failOpen: true })
}
