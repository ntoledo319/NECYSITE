import { describe, it, expect } from "vitest"
import { safeStripeMetadata } from "../stripe-metadata"

describe("safeStripeMetadata", () => {
  it("passes through small, valid metadata unchanged", () => {
    const out = safeStripeMetadata({ a: "x", b: "y" })
    expect(out).toEqual({ a: "x", b: "y" })
  })

  it("truncates string values that exceed 500 chars", () => {
    const long = "a".repeat(600)
    const out = safeStripeMetadata({ long })
    expect(out.long.length).toBeLessThanOrEqual(500)
    expect(out.long.endsWith("…")).toBe(true)
  })

  it("coerces non-string values to strings", () => {
    const out = safeStripeMetadata({ n: 42, b: true, zero: 0 })
    expect(out.n).toBe("42")
    expect(out.b).toBe("true")
    expect(out.zero).toBe("0")
  })

  it("drops undefined and null values", () => {
    const out = safeStripeMetadata({ keep: "ok", drop_u: undefined, drop_n: null })
    expect(out).toEqual({ keep: "ok" })
  })

  it("drops empty strings", () => {
    const out = safeStripeMetadata({ keep: "ok", drop_empty: "" })
    expect(out).toEqual({ keep: "ok" })
  })

  it("drops keys exceeding 40 characters", () => {
    const longKey = "a".repeat(41)
    const out = safeStripeMetadata({ [longKey]: "value", ok: "yes" })
    expect(out.ok).toBe("yes")
    expect(out[longKey]).toBeUndefined()
  })

  it("drops keys with invalid characters", () => {
    const out = safeStripeMetadata({ "bad key!": "value", good_key: "ok" })
    expect(out.good_key).toBe("ok")
    expect(out["bad key!"]).toBeUndefined()
  })

  it("caps at 50 keys total", () => {
    const input: Record<string, string> = {}
    for (let i = 0; i < 60; i++) input[`k${i}`] = `v${i}`
    const out = safeStripeMetadata(input)
    expect(Object.keys(out)).toHaveLength(50)
  })

  it("handles the gift-recipients-json near-limit case safely", () => {
    // Real-world scenario: 5 recipients with long emails + 500-char messages
    const recipients = Array.from({ length: 5 }, (_, i) => ({
      name: `Recipient ${i} ${"X".repeat(50)}`,
      email: `recipient${i}+verylongnameindeed@example-domain-which-is-long.com`,
      message: "Y".repeat(500),
    }))
    const json = JSON.stringify(recipients)
    expect(json.length).toBeGreaterThan(500)
    const out = safeStripeMetadata({ gift_recipients_json: json })
    expect(out.gift_recipients_json.length).toBeLessThanOrEqual(500)
  })

  it("preserves the rest of the object when one value is truncated", () => {
    const out = safeStripeMetadata({
      tiny: "ok",
      huge: "z".repeat(600),
      also_tiny: "fine",
    })
    expect(out.tiny).toBe("ok")
    expect(out.also_tiny).toBe("fine")
    expect(out.huge.length).toBeLessThanOrEqual(500)
  })
})
