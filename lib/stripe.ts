import "server-only"
import Stripe from "stripe"
import { env } from "@/lib/env"

let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (_stripe) return _stripe
  const key = env.STRIPE_SECRET_KEY
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY environment variable is not set. Payment processing will not work.")
  }
  _stripe = new Stripe(key, { apiVersion: "2025-04-30.basil" as Stripe.LatestApiVersion })
  return _stripe
}

export const stripe = new Proxy({} as Stripe, {
  get(_, prop: string | symbol) {
    if (typeof prop === "symbol") {
      return undefined
    }
    return (getStripe() as any)[prop]
  },
})
