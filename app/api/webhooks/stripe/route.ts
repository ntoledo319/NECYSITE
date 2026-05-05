import { NextResponse } from "next/server"
import { getPayload } from "payload"
import configPromise from "@payload-config"
import { stripe } from "@/lib/stripe"
import Stripe from "stripe"

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature")

  if (body.length > 1_000_000) {
    return new NextResponse("Body too large", { status: 413 })
  }

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

  try {
    const payload = await getPayload({ config: configPromise })

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session

        const existing = await payload.find({
          collection: "registrations",
          where: { stripeSessionId: { equals: session.id } },
          limit: 1,
        })

        if (existing.docs.length > 0) {
          const doc = existing.docs[0]
          if (doc.status === "paid") {
            break
          }
          await payload.update({
            collection: "registrations",
            id: doc.id,
            data: {
              status: "paid",
              stripePaymentIntentId: typeof session.payment_intent === "string" ? session.payment_intent : "",
              stripeCustomerId: typeof session.customer === "string" ? session.customer : "",
            },
          })
        }
        break
      }
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object as Stripe.Checkout.Session

        const existing = await payload.find({
          collection: "registrations",
          where: { stripeSessionId: { equals: session.id } },
          limit: 1,
        })

        if (existing.docs.length > 0) {
          const doc = existing.docs[0]
          if (doc.status === "paid") {
            break
          }
          await payload.update({
            collection: "registrations",
            id: doc.id,
            data: {
              status: "paid",
              stripePaymentIntentId: typeof session.payment_intent === "string" ? session.payment_intent : "",
              stripeCustomerId: typeof session.customer === "string" ? session.customer : "",
            },
          })
        }
        break
      }
      case "checkout.session.async_payment_failed": {
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
              status: "failed",
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

        let sessionId: string | undefined
        if (paymentIntent.metadata?.stripeSessionId) {
          sessionId = paymentIntent.metadata.stripeSessionId
        } else {
          const sessions = await stripe.checkout.sessions.list({
            payment_intent: paymentIntent.id,
            limit: 1,
          })
          if (sessions.data.length > 0) {
            sessionId = sessions.data[0].id
          }
        }

        if (!sessionId) break

        const existing = await payload.find({
          collection: "registrations",
          where: { stripeSessionId: { equals: sessionId } },
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

        const isPartialRefund = (charge.amount_refunded ?? 0) < charge.amount

        const existing = await payload.find({
          collection: "registrations",
          where: {
            stripePaymentIntentId: {
              equals: typeof charge.payment_intent === "string" ? charge.payment_intent : "",
            },
          },
          limit: 1,
        })

        if (existing.docs.length > 0) {
          await payload.update({
            collection: "registrations",
            id: existing.docs[0].id,
            data: {
              status: isPartialRefund ? "partially_refunded" : "refunded",
            },
          })
        }
        break
      }
      case "charge.dispute.created": {
        const dispute = event.data.object as Stripe.Dispute

        let lookupValue = typeof dispute.payment_intent === "string" ? dispute.payment_intent : ""
        if (!lookupValue && typeof dispute.charge === "string") {
          const charge = await stripe.charges.retrieve(dispute.charge)
          lookupValue = typeof charge.payment_intent === "string" ? charge.payment_intent : ""
        }

        if (!lookupValue) break

        const existing = await payload.find({
          collection: "registrations",
          where: {
            stripePaymentIntentId: {
              equals: lookupValue,
            },
          },
          limit: 1,
        })

        if (existing.docs.length > 0) {
          await payload.update({
            collection: "registrations",
            id: existing.docs[0].id,
            data: {
              status: "disputed",
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
