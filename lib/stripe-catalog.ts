import "server-only"
import { stripe } from "./stripe"
import { withTimeout, safeAsync } from "./resilience"
import { log } from "./logger"

/**
 * Resolves canonical Stripe Product IDs at runtime by their stable
 * `lookup_key`. Three layers:
 *
 *   1. Env var fast path — set via Vercel after running the bootstrap
 *      script. Zero API calls.
 *   2. In-memory cache per Lambda instance — first request pays one
 *      Stripe API hit, subsequent requests are free.
 *   3. Live lookup — `products.search(lookup_key:"…")` against Stripe.
 *
 * If all three fail (Stripe outage, lookup_key never bootstrapped), the
 * caller receives `null` and is expected to fall back to inline
 * `product_data` so checkout never breaks. The associated catalog entry
 * is just an anonymous Stripe Product for that one session in that case —
 * dashboard noise, not user-facing pain.
 */

export type CatalogKey =
  | "necypaa-xxxvi-registration"
  | "necypaa-xxxvi-gift"
  | "necypaa-xxxvi-group-seat"
  | "necypaa-xxxvi-donation"
  | "necypaa-xxxvi-breakfast-friday"
  | "necypaa-xxxvi-breakfast-saturday"
  | "necypaa-xxxvi-breakfast-sunday"
  | "necypaa-xxxvi-processing-fee"

const ENV_SUFFIX: Record<CatalogKey, string> = {
  "necypaa-xxxvi-registration": "REGISTRATION",
  "necypaa-xxxvi-gift": "GIFT",
  "necypaa-xxxvi-group-seat": "GROUP_SEAT",
  "necypaa-xxxvi-donation": "DONATION",
  "necypaa-xxxvi-breakfast-friday": "BREAKFAST_FRIDAY",
  "necypaa-xxxvi-breakfast-saturday": "BREAKFAST_SATURDAY",
  "necypaa-xxxvi-breakfast-sunday": "BREAKFAST_SUNDAY",
  "necypaa-xxxvi-processing-fee": "PROCESSING_FEE",
}

const SEARCH_TIMEOUT_MS = 4_000
const cache = new Map<CatalogKey, string>()

function readFromEnv(key: CatalogKey): string | null {
  const suffix = ENV_SUFFIX[key]
  if (!suffix) return null
  const isLiveMode = (process.env.STRIPE_SECRET_KEY ?? "").startsWith("sk_live_")
  // Test mode env vars use a _TEST suffix so test and live IDs can coexist.
  const modeSuffix = isLiveMode ? "" : "_TEST"
  const value = process.env[`STRIPE_PRODUCT_${suffix}${modeSuffix}`]
  if (typeof value === "string" && value.startsWith("prod_")) return value
  return null
}

/**
 * Best-effort resolver. Returns null when no Product can be located; callers
 * use that signal to fall back to inline `product_data`.
 */
export async function resolveProductId(key: CatalogKey): Promise<string | null> {
  const cached = cache.get(key)
  if (cached) return cached

  const fromEnv = readFromEnv(key)
  if (fromEnv) {
    cache.set(key, fromEnv)
    return fromEnv
  }

  const fromStripe = await safeAsync(
    async () => {
      const result = await withTimeout(
        stripe.products.search({ query: `metadata['lookup_key']:'${key}' AND active:'true'`, limit: 1 }),
        SEARCH_TIMEOUT_MS,
        "stripe.products.search",
      )
      return result.data[0]?.id ?? null
    },
    null,
    { label: "stripe-catalog.search", severity: "warn" },
  )

  if (fromStripe) {
    cache.set(key, fromStripe)
    log.info({ event: "stripe_catalog.resolved", lookup_key: key, productId: fromStripe })
    return fromStripe
  }

  log.warn({
    event: "stripe_catalog.unresolved",
    lookup_key: key,
    hint: "Run pnpm stripe:bootstrap-catalog or set STRIPE_PRODUCT_* env vars",
  })
  return null
}

/**
 * Build the `price_data` block for a Stripe line item, preferring a
 * canonical Product reference and falling back to inline `product_data`
 * when no Product can be resolved. Either way the caller controls
 * `unit_amount` (server-authoritative pricing).
 */
export async function priceDataForCatalogItem(args: {
  key: CatalogKey
  unitAmountCents: number
  fallbackName: string
  fallbackDescription: string
  currency?: string
}): Promise<{ price_data: import("stripe").Stripe.Checkout.SessionCreateParams.LineItem.PriceData }> {
  const productId = await resolveProductId(args.key)
  const currency = args.currency ?? "usd"
  if (productId) {
    return {
      price_data: {
        currency,
        product: productId,
        unit_amount: args.unitAmountCents,
      },
    }
  }
  return {
    price_data: {
      currency,
      product_data: { name: args.fallbackName, description: args.fallbackDescription },
      unit_amount: args.unitAmountCents,
    },
  }
}

/** Test-only: clear the in-memory cache between runs. */
export function _resetCatalogCacheForTests(): void {
  cache.clear()
}
