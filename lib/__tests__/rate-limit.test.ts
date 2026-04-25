import { describe, it, expect } from "vitest"
import { rateLimit } from "../rate-limit"

describe("rateLimit", () => {
  it("allows requests under the limit", async () => {
    const key = `test-allow-${Date.now()}`
    const result = await rateLimit(key, { limit: 3, windowMs: 60000 })
    expect(result.success).toBe(true)
    expect(result.remaining).toBe(2)
  })

  it("blocks requests over the limit", async () => {
    const key = `test-block-${Date.now()}`
    const opts = { limit: 2, windowMs: 60000 }

    await rateLimit(key, opts) // 1
    await rateLimit(key, opts) // 2

    const result = await rateLimit(key, opts) // 3 — should be blocked
    expect(result.success).toBe(false)
    expect(result.remaining).toBe(0)
  })

  it("different keys are independent", async () => {
    const opts = { limit: 1, windowMs: 60000 }

    const key1 = `test-indep-a-${Date.now()}`
    const key2 = `test-indep-b-${Date.now()}`

    await rateLimit(key1, opts) // fills key1

    const result = await rateLimit(key2, opts) // key2 should still be fine
    expect(result.success).toBe(true)
  })

  it("returns resetMs when blocked", async () => {
    const key = `test-reset-${Date.now()}`
    const opts = { limit: 1, windowMs: 30000 }

    await rateLimit(key, opts)
    const result = await rateLimit(key, opts)

    expect(result.success).toBe(false)
    expect(result.resetMs).toBeGreaterThan(0)
    expect(result.resetMs).toBeLessThanOrEqual(30000)
  })
})
