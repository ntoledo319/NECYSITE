"use client"

import { useEffect, useState } from "react"

/**
 * Client-side hook for live pricing display. Fetches /api/registration/pricing
 * on mount, caches the result in a module-scoped variable so subsequent
 * mounts within the same session don't re-fetch.
 *
 * Always returns sensible defaults — falls back to the compiled-in catalog
 * values if the fetch fails. Components can use the returned values
 * unconditionally without null-checking.
 */

export interface PricingValues {
  registrationCents: number
  breakfastFridayCents: number
  breakfastSaturdayCents: number
  breakfastSundayCents: number
  /** True once a live response (or a final failure) has been resolved. */
  resolved: boolean
  source: "payload" | "fallback" | "compiled"
}

const COMPILED_DEFAULTS: Omit<PricingValues, "resolved" | "source"> = {
  registrationCents: 4000,
  breakfastFridayCents: 2500,
  breakfastSaturdayCents: 2500,
  breakfastSundayCents: 2500,
}

let cached: PricingValues | null = null
let inflight: Promise<PricingValues> | null = null

async function loadPricing(): Promise<PricingValues> {
  if (cached) return cached
  if (inflight) return inflight

  inflight = (async () => {
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 4_000)
      const res = await fetch("/api/registration/pricing", { signal: controller.signal, cache: "no-store" })
      clearTimeout(timeout)
      if (!res.ok) throw new Error(`pricing endpoint ${res.status}`)
      const body = (await res.json()) as {
        registrationCents?: number
        breakfast?: { fridayCents?: number; saturdayCents?: number; sundayCents?: number }
        source?: "payload" | "fallback"
      }
      const numeric = (n: unknown, fallback: number) =>
        typeof n === "number" && Number.isFinite(n) && n >= 0 ? n : fallback
      cached = {
        registrationCents: numeric(body.registrationCents, COMPILED_DEFAULTS.registrationCents),
        breakfastFridayCents: numeric(body.breakfast?.fridayCents, COMPILED_DEFAULTS.breakfastFridayCents),
        breakfastSaturdayCents: numeric(body.breakfast?.saturdayCents, COMPILED_DEFAULTS.breakfastSaturdayCents),
        breakfastSundayCents: numeric(body.breakfast?.sundayCents, COMPILED_DEFAULTS.breakfastSundayCents),
        resolved: true,
        source: body.source === "payload" ? "payload" : "fallback",
      }
      return cached
    } catch {
      cached = { ...COMPILED_DEFAULTS, resolved: true, source: "compiled" }
      return cached
    } finally {
      inflight = null
    }
  })()
  return inflight
}

export function usePricing(): PricingValues {
  const [values, setValues] = useState<PricingValues>(
    () => cached ?? { ...COMPILED_DEFAULTS, resolved: false, source: "compiled" },
  )

  useEffect(() => {
    let cancelled = false
    loadPricing().then((next) => {
      if (!cancelled) setValues(next)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return values
}

/** Test-only: clear the module-scoped cache between runs. */
export function _resetPricingCacheForTests(): void {
  cached = null
  inflight = null
}
