#!/usr/bin/env node
/**
 * Idempotent Stripe Products catalog bootstrap.
 *
 * Creates (or updates) one Product in Stripe per category we sell, each
 * keyed by a stable `lookup_key`. Run this once against test mode, once
 * against live mode, after any catalog change. Safe to run repeatedly —
 * existing Products are updated in place, not duplicated.
 *
 * Usage:
 *   STRIPE_SECRET_KEY=sk_test_…  node scripts/stripe-bootstrap-catalog.mjs
 *   STRIPE_SECRET_KEY=sk_live_…  node scripts/stripe-bootstrap-catalog.mjs
 *
 * Or via pnpm:
 *   pnpm stripe:bootstrap-catalog
 *
 * Output: a table of `lookup_key → product_id` plus a copy-pasteable env
 * block you can paste into Vercel (or `.env.local`) to skip the runtime
 * `products.search` lookup. Setting these env vars is optional but cheaper
 * — every checkout otherwise costs one extra Stripe API call per unique
 * lookup_key per cold instance.
 */

import Stripe from "stripe"

const CATALOG = [
  {
    lookupKey: "necypaa-xxxvi-registration",
    name: "NECYPAA XXXVI Registration",
    description: "The Archway of Freedom — Full convention registration. Dec 31, 2026 – Jan 3, 2027.",
    envVarSuffix: "REGISTRATION",
  },
  {
    lookupKey: "necypaa-xxxvi-gift",
    name: "NECYPAA XXXVI Sponsored Registration",
    description: "Gift registration paid by a sponsor on behalf of a named recipient. Recipient claims via emailed link.",
    envVarSuffix: "GIFT",
  },
  {
    lookupKey: "necypaa-xxxvi-group-seat",
    name: "NECYPAA XXXVI Group Seat",
    description: "Bulk seat purchased by an organization. Attendee name submitted by the convention start date.",
    envVarSuffix: "GROUP_SEAT",
  },
  {
    lookupKey: "necypaa-xxxvi-donation",
    name: "NECYPAA XXXVI General Fund Donation",
    description: "Donation to the General Fund — funds scholarships for those who can't afford registration.",
    envVarSuffix: "DONATION",
  },
  {
    lookupKey: "necypaa-xxxvi-breakfast-friday",
    name: "NECYPAA XXXVI Breakfast — Friday (New Year's Day)",
    description: "Friday morning breakfast at the host hotel. Most local restaurants are closed.",
    envVarSuffix: "BREAKFAST_FRIDAY",
  },
  {
    lookupKey: "necypaa-xxxvi-breakfast-saturday",
    name: "NECYPAA XXXVI Breakfast — Saturday",
    description: "Saturday morning breakfast at the host hotel.",
    envVarSuffix: "BREAKFAST_SATURDAY",
  },
  {
    lookupKey: "necypaa-xxxvi-breakfast-sunday",
    name: "NECYPAA XXXVI Breakfast — Sunday",
    description: "Sunday morning breakfast at the host hotel.",
    envVarSuffix: "BREAKFAST_SUNDAY",
  },
  {
    lookupKey: "necypaa-xxxvi-processing-fee",
    name: "Credit Card Processing Fee",
    description: "Stripe processing fee passed through to the cardholder (2.9% + $0.30).",
    envVarSuffix: "PROCESSING_FEE",
  },
]

async function main() {
  const apiKey = process.env.STRIPE_SECRET_KEY
  if (!apiKey) {
    console.error("STRIPE_SECRET_KEY is required. Run with: STRIPE_SECRET_KEY=sk_test_… node scripts/stripe-bootstrap-catalog.mjs")
    process.exit(1)
  }

  const mode = apiKey.startsWith("sk_live_") ? "LIVE" : apiKey.startsWith("sk_test_") ? "TEST" : "UNKNOWN"
  console.log(`Bootstrapping Stripe catalog in ${mode} mode…\n`)

  const stripe = new Stripe(apiKey)

  // Page through all Products that already carry one of our lookup keys.
  const wanted = new Set(CATALOG.map((c) => c.lookupKey))
  const existing = new Map()
  for await (const product of stripe.products.list({ limit: 100, active: true })) {
    const key = product.metadata?.lookup_key
    if (key && wanted.has(key)) {
      existing.set(key, product)
    }
  }

  const results = []
  for (const entry of CATALOG) {
    const current = existing.get(entry.lookupKey)
    if (current) {
      const needsUpdate =
        current.name !== entry.name || (current.description ?? "") !== entry.description
      if (needsUpdate) {
        const updated = await stripe.products.update(current.id, {
          name: entry.name,
          description: entry.description,
          metadata: { ...current.metadata, lookup_key: entry.lookupKey },
        })
        results.push({ lookupKey: entry.lookupKey, productId: updated.id, action: "updated" })
      } else {
        results.push({ lookupKey: entry.lookupKey, productId: current.id, action: "unchanged" })
      }
    } else {
      const created = await stripe.products.create({
        name: entry.name,
        description: entry.description,
        active: true,
        metadata: { lookup_key: entry.lookupKey },
      })
      results.push({ lookupKey: entry.lookupKey, productId: created.id, action: "created" })
    }
  }

  console.log("Catalog bootstrap complete:\n")
  for (const r of results) {
    console.log(`  ${r.action.padEnd(10)}  ${r.lookupKey.padEnd(36)}  ${r.productId}`)
  }

  console.log(`\nOptional ${mode}-mode env vars (paste into Vercel / .env.local to skip the runtime products.search lookup):\n`)
  const envSuffix = mode === "LIVE" ? "" : "_TEST"
  for (const r of results) {
    const entry = CATALOG.find((c) => c.lookupKey === r.lookupKey)
    console.log(`  STRIPE_PRODUCT_${entry.envVarSuffix}${envSuffix}=${r.productId}`)
  }
  console.log("")
}

main().catch((err) => {
  console.error("Bootstrap failed:", err.message || err)
  if (err.raw) console.error(JSON.stringify(err.raw, null, 2))
  process.exit(1)
})
