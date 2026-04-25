import { NextResponse } from "next/server"
import { getPayload } from "payload"
import configPromise from "@payload-config"
import { stripe } from "@/lib/stripe"
import Stripe from "stripe"

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature")

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!sig || !webhookSecret) {
    console.error("Missing Stripe signature or webhook secret")
    return new NextResponse("Webhook Secret or Signature missing", { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown webhook error"
    console.error(`Webhook Error: ${message}`)
    return new NextResponse(`Webhook Error: ${message}`, { status: 400 })
  }

  const payload = await getPayload({ config: configPromise })

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        
        const existing = await payload.find({
          collection: "registrations",
          where: { stripeSessionId: { equals: session.id } },
          limit: 1,
        })

        if (existing.docs.length > 0) {
          await payload.update({
            collection: "registrations",
            id: existing.docs[0].id,
            data: {
              status: "paid",
              stripePaymentIntentId: session.payment_intent as string || "",
              stripeCustomerId: session.customer as string || "",
            },
          })
        }
        break
      }
      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session
        
        const existing = await payload.find({
          collection: "registrations",
          where: { stripeSessionId: { equals: session.id } },
          limit: 1,
        })

        if (existing.docs.length > 0) {
          await payload.update({
            collection: "registrations",
            id: existing.docs[0].id,
            data: {
              status: "canceled",
            },
          })
        }
        break
      }
      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        
        const existing = await payload.find({
          collection: "registrations",
          where: { stripePaymentIntentId: { equals: paymentIntent.id } },
          limit: 1,
        })

        if (existing.docs.length > 0) {
          await payload.update({
            collection: "registrations",
            id: existing.docs[0].id,
            data: {
              status: "failed",
            },
          })
        }
        break
      }
      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge
        
        const existing = await payload.find({
          collection: "registrations",
          where: { stripePaymentIntentId: { equals: charge.payment_intent as string } },
          limit: 1,
        })

        if (existing.docs.length > 0) {
          await payload.update({
            collection: "registrations",
            id: existing.docs[0].id,
            data: {
              status: "refunded",
            },
          })
        }
        break
      }
      default:
        console.warn(`Unhandled event type ${event.type}`)
    }

    return new NextResponse(JSON.stringify({ received: true }), { status: 200 })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
