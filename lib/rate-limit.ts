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

export function rateLimit(key: string, options: RateLimitOptions): RateLimitResult {
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

export function rateLimitCheckout(key: string): RateLimitResult {
  return rateLimit(key, { limit: 5, windowMs: 60_000 })
}

export function rateLimitFreeRegistration(key: string): RateLimitResult {
  return rateLimit(key, { limit: 3, windowMs: 60_000 })
}

export function rateLimitCodeRedemption(key: string): RateLimitResult {
  return rateLimit(key, { limit: 3, windowMs: 60_000 })
}
