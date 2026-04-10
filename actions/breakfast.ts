"use server"

import { stripe } from "@/lib/stripe"
import { BREAKFAST_PRODUCTS, calculateProcessingFee } from "@/lib/registration-products"
import { rateLimitCheckout } from "@/lib/rate-limit"
import { breakfastAttendeeSchema, breakfastIdsSchema } from "@/lib/validation"
import type { BreakfastAttendee } from "@/lib/types"

export async function startBreakfastCheckout(attendee: BreakfastAttendee, breakfastIds: string[]) {
  const attendeeResult = breakfastAttendeeSchema.safeParse(attendee)
  if (!attendeeResult.success) {
    throw new Error("Invalid attendee data. Please check your information and try again.")
  }
  const validatedAttendee = attendeeResult.data
  const validatedIds = breakfastIdsSchema.parse(breakfastIds)

  const rl = rateLimitCheckout(validatedAttendee.email)
  if (!rl.success) {
    throw new Error("Too many checkout attempts. Please wait a moment and try again.")
  }

  const selectedBreakfasts = validatedIds
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
    breakfast_tickets: selectedBreakfasts.map((bp) => bp.name).join(", "),
    breakfast_count: selectedBreakfasts.length.toString(),
    breakfast_price_version: "2026-03-26-$25",
    breakfast_ticket_price_cents: "2500",
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.necypaact.com"
  const successUrl = `${baseUrl}/breakfast/success?session_id={CHECKOUT_SESSION_ID}`

  try {
    const session = await stripe.checkout.sessions.create({
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
    })

    if (!session.client_secret) {
      throw new Error("We had trouble connecting to our payment system. Please try again in a moment.")
    }

    return session.client_secret
  } catch (error) {
    console.error("Breakfast checkout session creation failed:", error)
    throw new Error("Payment session could not be created. Please try again.")
  }
}
