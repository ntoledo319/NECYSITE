"use server"

import { randomUUID } from "node:crypto"
import { headers } from "next/headers"
import { getPayload } from "payload"
import configPromise from "@payload-config"
import { stripe } from "@/lib/stripe"
import { env } from "@/lib/env"
import { BREAKFAST_PRODUCTS, calculateProcessingFee } from "@/lib/registration-products"
import { rateLimitCheckout, extractClientIp, formatResetSeconds } from "@/lib/rate-limit"
import { breakfastAttendeeSchema, breakfastIdsSchema } from "@/lib/validation"
import type { BreakfastAttendee } from "@/lib/types"

export async function startBreakfastCheckout(attendee: BreakfastAttendee, breakfastIds: string[]) {
  let validatedAttendee: import("@/lib/validation").ValidatedBreakfastAttendee
  let validatedIds: string[]

  try {
    validatedAttendee = breakfastAttendeeSchema.parse(attendee)
    validatedIds = breakfastIdsSchema.parse(breakfastIds)
  } catch {
    throw new Error("Invalid attendee data. Please check your information and try again.")
  }

  const uniqueBreakfastIds = [...new Set(validatedIds)]

  const ip = extractClientIp(await headers())
  const rl = await rateLimitCheckout({ ip, email: validatedAttendee.email })
  if (!rl.success) {
    const seconds = formatResetSeconds(rl.resetMs)
    throw new Error(`Too many checkout attempts. Please wait about ${seconds}s and try again.`)
  }

  const selectedBreakfasts = uniqueBreakfastIds
    .map((id) => BREAKFAST_PRODUCTS.find((bp) => bp.id === id))
    .filter((bp): bp is (typeof BREAKFAST_PRODUCTS)[number] => Boolean(bp))

  if (selectedBreakfasts.length === 0) {
    throw new Error("Please select at least one breakfast ticket.")
  }

  const subtotalInCents = selectedBreakfasts.reduce((sum, bp) => sum + bp.priceInCents, 0)
  const processingFee = calculateProcessingFee(subtotalInCents)

  const metadata = {
    purchase_type: "breakfast_only",
    attendee_first_name: validatedAttendee.firstName,
    attendee_last_name: validatedAttendee.lastName,
    attendee_email: validatedAttendee.email,
    breakfast_tickets: selectedBreakfasts.map((bp) => bp.name).join(", ").slice(0, 500),
    breakfast_count: selectedBreakfasts.length.toString(),
    breakfast_price_version: "2026-03-26-$25",
    breakfast_ticket_price_cents: "2500",
  }

  const successUrl = `${env.NEXT_PUBLIC_BASE_URL}/en/breakfast/success?session_id={CHECKOUT_SESSION_ID}`

  const payload = await getPayload({ config: configPromise })
  const record = await payload.create({
    collection: "registrations",
    data: {
      email: validatedAttendee.email || "",
      name: `${validatedAttendee.firstName} ${validatedAttendee.lastName}`.trim() || "Not provided",
      state: "",
      status: "pending",
      type: "breakfast_only",
      stripeSessionId: "",
      amountTotalCents: subtotalInCents + processingFee,
      metadata: metadata,
      accommodations: "None",
      interpretationNeeded: false,
      mobilityAccessibility: false,
      willingToServe: false,
      homegroup: "",
    },
  })

  try {
    const session = await stripe.checkout.sessions.create(
      {
        ui_mode: "embedded",
        return_url: successUrl,
        customer_email: validatedAttendee.email,
        line_items: [
          ...selectedBreakfasts.map((bp) => ({
            price_data: {
              currency: "usd",
              product_data: {
                name: bp.name,
                description: bp.description,
              },
              unit_amount: bp.priceInCents,
            },
            quantity: 1,
          })),
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Processing Fee",
                description: "Credit card processing fee (2.9% + $0.30)",
              },
              unit_amount: processingFee,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        metadata,
        payment_intent_data: {
          metadata,
        },
      },
      { idempotencyKey: randomUUID() },
    )

    if (!session.client_secret) {
      throw new Error("We had trouble connecting to our payment system. Please try again in a moment.")
    }

    await payload.update({
      collection: "registrations",
      id: record.id,
      data: { stripeSessionId: session.id },
    })

    return session.client_secret
  } catch (error) {
    console.error("Breakfast checkout session creation failed:", error)
    throw new Error("Payment session could not be created. Please try again.")
  }
}
