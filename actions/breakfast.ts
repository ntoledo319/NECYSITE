"use server"

import { stripe } from "@/lib/stripe"
import { BREAKFAST_PRODUCTS, calculateProcessingFee } from "@/lib/registration-products"
import { rateLimitCheckout } from "@/lib/rate-limit"
import { breakfastAttendeeSchema, breakfastIdsSchema } from "@/lib/validation"

interface BreakfastAttendee {
  firstName: string
  lastName: string
  email: string
}

export async function startBreakfastCheckout(attendee: BreakfastAttendee, breakfastIds: string[]) {
  // ── Validate inputs ────────────────────────────────────────────
  const validatedAttendee = breakfastAttendeeSchema.parse(attendee)
  const validatedIds = breakfastIdsSchema.parse(breakfastIds)

  // ── Rate limit by email ────────────────────────────────────────
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
    attendee_first_name: attendee.firstName,
    attendee_last_name: attendee.lastName,
    attendee_email: attendee.email,
    breakfast_tickets: selectedBreakfasts.map((bp) => bp.name).join(", "),
    breakfast_count: selectedBreakfasts.length.toString(),
  }

  const hotelBookingUrl =
    "https://www.marriott.com/event-reservations/reservation-link.mi?id=1770049957031&key=GRP&app=resvlink"

  try {
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      return_url: hotelBookingUrl,
      customer_email: attendee.email,
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
    throw error
  }
}
