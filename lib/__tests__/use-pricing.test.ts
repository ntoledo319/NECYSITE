// @vitest-environment jsdom

import { describe, it, expect, beforeEach, vi, afterEach } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { usePricing, _resetPricingCacheForTests } from "../use-pricing"

const originalFetch = global.fetch

afterEach(() => {
  global.fetch = originalFetch
})

describe("usePricing", () => {
  beforeEach(() => {
    _resetPricingCacheForTests()
  })

  it("returns compiled defaults synchronously before resolving", () => {
    global.fetch = vi.fn().mockReturnValue(new Promise(() => {})) as unknown as typeof fetch
    const { result } = renderHook(() => usePricing())
    expect(result.current.registrationCents).toBe(4000)
    expect(result.current.resolved).toBe(false)
    expect(result.current.source).toBe("compiled")
  })

  it("resolves to live pricing when the endpoint returns valid data", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        registrationCents: 5000,
        breakfast: { fridayCents: 3000, saturdayCents: 3000, sundayCents: 3000 },
        source: "payload",
      }),
    }) as unknown as typeof fetch
    const { result } = renderHook(() => usePricing())
    await waitFor(() => expect(result.current.resolved).toBe(true))
    expect(result.current.registrationCents).toBe(5000)
    expect(result.current.breakfastFridayCents).toBe(3000)
    expect(result.current.source).toBe("payload")
  })

  it("falls back to compiled defaults if the fetch fails", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("network down")) as unknown as typeof fetch
    const { result } = renderHook(() => usePricing())
    await waitFor(() => expect(result.current.resolved).toBe(true))
    expect(result.current.registrationCents).toBe(4000)
    expect(result.current.source).toBe("compiled")
  })

  it("falls back if the response is missing fields", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ source: "payload" }),
    }) as unknown as typeof fetch
    const { result } = renderHook(() => usePricing())
    await waitFor(() => expect(result.current.resolved).toBe(true))
    expect(result.current.registrationCents).toBe(4000)
    expect(result.current.breakfastFridayCents).toBe(2500)
  })

  it("ignores negative or non-numeric pricing values", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        registrationCents: -1,
        breakfast: { fridayCents: "free", saturdayCents: null, sundayCents: 2500 },
        source: "payload",
      }),
    }) as unknown as typeof fetch
    const { result } = renderHook(() => usePricing())
    await waitFor(() => expect(result.current.resolved).toBe(true))
    expect(result.current.registrationCents).toBe(4000) // fallback for -1
    expect(result.current.breakfastFridayCents).toBe(2500) // fallback for non-number
    expect(result.current.breakfastSaturdayCents).toBe(2500) // fallback for null
    expect(result.current.breakfastSundayCents).toBe(2500) // valid passthrough
  })

  it("caches across multiple mounts within a session", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        registrationCents: 5000,
        breakfast: { fridayCents: 3000, saturdayCents: 3000, sundayCents: 3000 },
        source: "payload",
      }),
    })
    global.fetch = fetchMock as unknown as typeof fetch

    const { result: a } = renderHook(() => usePricing())
    await waitFor(() => expect(a.current.resolved).toBe(true))
    const { result: b } = renderHook(() => usePricing())
    await waitFor(() => expect(b.current.resolved).toBe(true))
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(b.current.registrationCents).toBe(5000)
  })
})
