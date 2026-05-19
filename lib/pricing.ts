import "server-only"
import { getPayload } from "payload"
import configPromise from "@payload-config"
import { withTimeout, safeAsync } from "./resilience"
import { log } from "./logger"
import {
  BREAKFAST_PRODUCTS,
  REGISTRATION_PRODUCTS,
  type RegistrationProduct,
} from "./registration-products"

/**
 * Resolves live pricing from the Payload PricingSettings global with a tight
 * timeout and a fallback to the compiled-in defaults. If the global is
 * unreachable, checkout still works at the default price; an alert can fire
 * upstream of this call if desired.
 *
 * Cached in-process per Lambda invocation — fine for a serverless function.
 */

const PAYLOAD_TIMEOUT_MS = 2_500

export interface LivePricing {
  registration: RegistrationProduct
  breakfasts: RegistrationProduct[]
  /** Source of the values: "payload" (live) or "fallback" (constants). */
  source: "payload" | "fallback"
}

interface PricingDoc {
  registrationPriceCents?: number | null
  breakfastFridayPriceCents?: number | null
  breakfastSaturdayPriceCents?: number | null
  breakfastSundayPriceCents?: number | null
}

function defaultPricing(): LivePricing {
  return {
    registration: REGISTRATION_PRODUCTS[0],
    breakfasts: BREAKFAST_PRODUCTS,
    source: "fallback",
  }
}

function fromDoc(doc: PricingDoc): LivePricing {
  const reg = REGISTRATION_PRODUCTS[0]
  const fri = BREAKFAST_PRODUCTS.find((b) => b.id === "breakfast-friday")!
  const sat = BREAKFAST_PRODUCTS.find((b) => b.id === "breakfast-saturday")!
  const sun = BREAKFAST_PRODUCTS.find((b) => b.id === "breakfast-sunday")!
  const cents = (raw: number | null | undefined, fallback: number) =>
    typeof raw === "number" && raw >= 0 && raw <= 1_000_000 ? raw : fallback
  return {
    registration: { ...reg, priceInCents: cents(doc.registrationPriceCents, reg.priceInCents) },
    breakfasts: [
      { ...fri, priceInCents: cents(doc.breakfastFridayPriceCents, fri.priceInCents) },
      { ...sat, priceInCents: cents(doc.breakfastSaturdayPriceCents, sat.priceInCents) },
      { ...sun, priceInCents: cents(doc.breakfastSundayPriceCents, sun.priceInCents) },
    ],
    source: "payload",
  }
}

export async function getLivePricing(): Promise<LivePricing> {
  return safeAsync(
    async () => {
      const payload = await withTimeout(getPayload({ config: configPromise }), PAYLOAD_TIMEOUT_MS, "pricing.bootstrap")
      const doc = (await withTimeout(
        payload.findGlobal({ slug: "pricing-settings" }),
        PAYLOAD_TIMEOUT_MS,
        "pricing.find",
      )) as PricingDoc | null
      if (!doc) {
        log.warn({ event: "pricing.no_global_doc" })
        return defaultPricing()
      }
      return fromDoc(doc)
    },
    defaultPricing(),
    { label: "pricing.resolve", severity: "warn" },
  )
}
