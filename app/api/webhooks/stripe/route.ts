import { NextResponse } from "next/server"
import { getPayload } from "payload"
import configPromise from "@payload-config"
import { stripe } from "@/lib/stripe"
import Stripe from "stripe"
import { newCorrelationId } from "@/lib/correlation"
import { log, summarizeError } from "@/lib/logger"
import { withTimeout, TimeoutError } from "@/lib/resilience"
import { dlqWebhookFailure } from "@/lib/dlq"
import { alertCritical } from "@/lib/alerts"
import { maybeNotifyScholarshipRecipient } from "@/lib/scholarship-email"
import { mintGiftCodesForPaidSession } from "@/lib/gift-mint"
import { voidUnclaimedGiftsForSession } from "@/lib/gift-void"
import { sendGroupConfirmationEmail } from "@/lib/group-email"

const PAYLOAD_TIMEOUT_MS = 5_000
const STRIPE_LOOKUP_TIMEOUT_MS = 4_000

export async function POST(req: Request) {
  const correlationId = newCorrelationId("whk")
  let body: string
  try {
    body = await req.text()
  } catch (err) {
    log.error({
      event: "webhook.read_body_failed",
      correlationId,
      ...summarizeError(err),
    })
    return new NextResponse("Bad Request", { status: 400 })
  }

  const sig = req.headers.get("stripe-signature")

  if (body.length > 1_000_000) {
    log.warn({ event: "webhook.body_too_large", correlationId, size: body.length })
    return new NextResponse("Body too large", { status: 413 })
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!sig || !webhookSecret) {
    log.error({
      event: "webhook.missing_signature_or_secret",
      correlationId,
      hasSig: Boolean(sig),
      hasSecret: Boolean(webhookSecret),
    })
    return new NextResponse("Webhook Secret or Signature missing", { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    log.error({
      event: "webhook.signature_invalid",
      correlationId,
      ...summarizeError(err),
    })
    return new NextResponse(`Webhook Error: ${err instanceof Error ? err.message : "signature"}`, { status: 400 })
  }

  log.info({
    event: "webhook.received",
    correlationId,
    eventId: event.id,
    eventType: event.type,
    livemode: event.livemode,
  })

  let payload: Awaited<ReturnType<typeof getPayload>>
  try {
    payload = await withTimeout(getPayload({ config: configPromise }), PAYLOAD_TIMEOUT_MS, "payload.bootstrap")
  } catch (err) {
    log.error({
      event: "webhook.payload_bootstrap_failed",
      correlationId,
      eventId: event.id,
      ...summarizeError(err),
    })
    // 500 so Stripe will retry — this is transient infrastructure failure.
    return new NextResponse("payload unavailable", { status: 500 })
  }

  // ── Event-level idempotency ─────────────────────────────────────────
  // Stripe may deliver the same event multiple times. If we have already
  // processed this event ID, return 200 without side effects. Failures of
  // the idempotency check itself fall through (better to double-process
  // with row-level guards than to drop the event).
  try {
    const seen = await withTimeout(
      payload.find({
        collection: "processed-webhook-events",
        where: { eventId: { equals: event.id } },
        limit: 1,
      }),
      PAYLOAD_TIMEOUT_MS,
      "idempotency.find",
    )
    if (seen.docs.length > 0) {
      log.info({
        event: "webhook.duplicate_ignored",
        correlationId,
        eventId: event.id,
        eventType: event.type,
      })
      return new NextResponse(JSON.stringify({ received: true, duplicate: true }), { status: 200 })
    }
  } catch (err) {
    log.warn({
      event: "webhook.idempotency_check_failed",
      correlationId,
      eventId: event.id,
      ...summarizeError(err),
    })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        await handlePaidEvent(payload, event, correlationId)
        break
      }
      case "checkout.session.async_payment_failed": {
        const session = event.data.object as Stripe.Checkout.Session
        await updateStatusBySession(payload, session.id, "failed", correlationId, event.type)
        break
      }
      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session
        await updateStatusBySession(payload, session.id, "canceled", correlationId, event.type)
        break
      }
      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        await handlePaymentIntentFailed(payload, paymentIntent, correlationId, event)
        break
      }
      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge
        await handleChargeRefunded(payload, charge, correlationId, event)
        break
      }
      case "charge.dispute.created": {
        const dispute = event.data.object as Stripe.Dispute
        await handleDisputeCreated(payload, dispute, correlationId, event)
        break
      }
      default: {
        log.info({
          event: "webhook.unhandled_type",
          correlationId,
          eventId: event.id,
          eventType: event.type,
        })
      }
    }

    // Mark the event processed AFTER successful handling. A failure to record
    // the marker (because the handler succeeded but this insert failed) just
    // means a future delivery will replay it — which is fine because every
    // handler is internally idempotent on registration state.
    try {
      await withTimeout(
        payload.create({
          collection: "processed-webhook-events",
          data: { eventId: event.id, eventType: event.type, correlationId },
        }),
        PAYLOAD_TIMEOUT_MS,
        "idempotency.create",
      )
    } catch (err) {
      log.warn({
        event: "webhook.idempotency_marker_failed",
        correlationId,
        eventId: event.id,
        ...summarizeError(err),
      })
    }

    return new NextResponse(JSON.stringify({ received: true }), { status: 200 })
  } catch (err) {
    const isTimeout = err instanceof TimeoutError
    await dlqWebhookFailure({
      correlationId,
      eventId: event.id,
      eventType: event.type,
      severity: "critical",
      reason: isTimeout ? `timeout: ${(err as TimeoutError).label}` : "unhandled error",
      error: err,
      rawEvent: serializeEvent(event),
    })
    // Return 500 so Stripe retries on transient errors. Permanent application
    // bugs will eventually exhaust Stripe's retry budget and surface via DLQ
    // and alerts — that's the desired escalation path.
    return new NextResponse("internal error", { status: 500 })
  }
}

async function handlePaidEvent(
  payload: Awaited<ReturnType<typeof getPayload>>,
  event: Stripe.Event,
  correlationId: string,
): Promise<void> {
  const session = event.data.object as Stripe.Checkout.Session

  // F1: Only mark paid when Stripe says the session is actually paid.
  // For async methods, `completed` arrives with payment_status=unpaid; the
  // real signal is the later `async_payment_succeeded`.
  if (session.payment_status !== "paid") {
    log.info({
      event: "webhook.session_not_yet_paid",
      correlationId,
      eventId: event.id,
      eventType: event.type,
      sessionId: session.id,
      paymentStatus: session.payment_status,
    })
    return
  }

  // Donation flow first — donations live in their own collection and never
  // touch the registrations table.
  if (session.metadata?.purchase_type === "donation") {
    await handleDonationPaid(payload, session, event, correlationId)
    return
  }

  // Group / institution flow — lives in its own collection.
  if (session.metadata?.purchase_type === "group") {
    await handleGroupPaid(payload, session, event, correlationId)
    return
  }

  const existing = await withTimeout(
    payload.find({
      collection: "registrations",
      where: { stripeSessionId: { equals: session.id } },
      limit: 1,
    }),
    PAYLOAD_TIMEOUT_MS,
    "payload.find:paid",
  )

  if (existing.docs.length === 0) {
    log.warn({
      event: "webhook.paid_no_matching_registration",
      correlationId,
      eventId: event.id,
      sessionId: session.id,
    })
    await dlqWebhookFailure({
      correlationId,
      eventId: event.id,
      eventType: event.type,
      severity: "critical",
      reason: "paid session has no matching registration row",
      stripeSessionId: session.id,
      rawEvent: serializeEvent(event),
    })
    return
  }

  const doc = existing.docs[0]
  if (doc.status === "paid") {
    log.info({
      event: "webhook.already_paid",
      correlationId,
      eventId: event.id,
      sessionId: session.id,
      registrationId: doc.id,
    })
    return
  }

  // F4: Reconcile amount against Stripe's authoritative total.
  const stripeAmount = session.amount_total ?? null
  if (
    stripeAmount != null &&
    typeof doc.amountTotalCents === "number" &&
    Math.abs(stripeAmount - doc.amountTotalCents) > 100
  ) {
    log.warn({
      event: "webhook.amount_drift",
      correlationId,
      eventId: event.id,
      sessionId: session.id,
      registrationId: doc.id,
      payloadCents: doc.amountTotalCents,
      stripeCents: stripeAmount,
    })
    await alertCritical({
      event: "registration.amount_drift",
      correlationId,
      summary: `Stripe paid amount differs from Payload by more than $1 on session ${session.id}`,
      fields: {
        registrationId: String(doc.id),
        payloadCents: doc.amountTotalCents,
        stripeCents: stripeAmount,
        diff: stripeAmount - doc.amountTotalCents,
      },
    })
  }

  await withTimeout(
    payload.update({
      collection: "registrations",
      id: doc.id,
      data: {
        status: "paid",
        stripePaymentIntentId: typeof session.payment_intent === "string" ? session.payment_intent : "",
        stripeCustomerId: typeof session.customer === "string" ? session.customer : "",
        amountTotalCents: stripeAmount ?? doc.amountTotalCents,
      },
    }),
    PAYLOAD_TIMEOUT_MS,
    "payload.update:paid",
  )

  log.info({
    event: "webhook.marked_paid",
    correlationId,
    eventId: event.id,
    sessionId: session.id,
    registrationId: doc.id,
    eventType: event.type,
  })

  // Mint gift codes for gift_only / self_plus_gift purchases. Idempotent on
  // stripeSessionId — replay-safe.
  if (
    session.metadata?.intent === "self_plus_gift" ||
    session.metadata?.intent === "gift_only" ||
    session.metadata?.purchase_type === "self_plus_scholarship" ||
    session.metadata?.purchase_type === "scholarship"
  ) {
    await mintGiftCodesForPaidSession({ payload, session, correlationId })
  }

  // Legacy: the older single-recipient scholarship email helper. With gift
  // codes minted via mintGiftCodesForPaidSession the per-recipient email is
  // already sent; this helper is now a no-op for gift purchases (it only
  // looks at the legacy scholarship_recipient_email metadata key, which the
  // new flow doesn't set). Kept for back-compat with any in-flight session.
  await maybeNotifyScholarshipRecipient({ session, correlationId })
}

async function handleGroupPaid(
  payload: Awaited<ReturnType<typeof getPayload>>,
  session: Stripe.Checkout.Session,
  event: Stripe.Event,
  correlationId: string,
): Promise<void> {
  const existing = await withTimeout(
    payload.find({
      collection: "group-registrations",
      where: { stripeSessionId: { equals: session.id } },
      limit: 1,
    }),
    PAYLOAD_TIMEOUT_MS,
    "payload.find:group",
  )
  if (existing.docs.length === 0) {
    log.warn({ event: "webhook.group_no_match", correlationId, eventId: event.id, sessionId: session.id })
    await dlqWebhookFailure({
      correlationId,
      eventId: event.id,
      eventType: event.type,
      severity: "critical",
      reason: "paid group session has no matching group-registrations row",
      stripeSessionId: session.id,
      rawEvent: serializeEvent(event),
    })
    return
  }
  const doc = existing.docs[0] as {
    id: string | number
    status?: string | null
    organizationName?: string | null
    contactName?: string | null
    contactEmail?: string | null
    quantity?: number | null
    submissionDeadline?: string | null
    amountTotalCents?: number | null
  }
  if (doc.status === "paid") {
    log.info({ event: "webhook.group_already_paid", correlationId, sessionId: session.id, groupRegistrationId: doc.id })
    return
  }
  await withTimeout(
    payload.update({
      collection: "group-registrations",
      id: doc.id,
      data: {
        status: "paid",
        stripePaymentIntentId: typeof session.payment_intent === "string" ? session.payment_intent : "",
        stripeCustomerId: typeof session.customer === "string" ? session.customer : "",
        amountTotalCents: session.amount_total ?? doc.amountTotalCents ?? undefined,
        paidAt: new Date().toISOString(),
      },
    }),
    PAYLOAD_TIMEOUT_MS,
    "payload.update:group_paid",
  )
  log.info({
    event: "webhook.group_marked_paid",
    correlationId,
    eventId: event.id,
    sessionId: session.id,
    groupRegistrationId: doc.id,
  })

  // Best-effort confirmation email. Failures land in the DLQ; the group
  // registration itself remains valid.
  await sendGroupConfirmationEmail({
    payload,
    session,
    groupRegistrationId: doc.id,
    organizationName: doc.organizationName ?? "your group",
    contactName: doc.contactName ?? "there",
    contactEmail: doc.contactEmail ?? "",
    quantity: doc.quantity ?? 0,
    submissionDeadline: doc.submissionDeadline ?? "",
    correlationId,
  })
}

async function handleDonationPaid(
  payload: Awaited<ReturnType<typeof getPayload>>,
  session: Stripe.Checkout.Session,
  event: Stripe.Event,
  correlationId: string,
): Promise<void> {
  const existing = await withTimeout(
    payload.find({
      collection: "donations",
      where: { stripeSessionId: { equals: session.id } },
      limit: 1,
    }),
    PAYLOAD_TIMEOUT_MS,
    "payload.find:donation",
  )
  if (existing.docs.length === 0) {
    log.warn({
      event: "webhook.donation_no_match",
      correlationId,
      eventId: event.id,
      sessionId: session.id,
    })
    await dlqWebhookFailure({
      correlationId,
      eventId: event.id,
      eventType: event.type,
      severity: "critical",
      reason: "paid donation session has no matching donations row",
      stripeSessionId: session.id,
      rawEvent: serializeEvent(event),
    })
    return
  }
  const doc = existing.docs[0] as { id: string | number; status?: string | null; amountTotalCents?: number | null }
  if (doc.status === "paid") {
    log.info({
      event: "webhook.donation_already_paid",
      correlationId,
      eventId: event.id,
      sessionId: session.id,
      donationId: doc.id,
    })
    return
  }
  await withTimeout(
    payload.update({
      collection: "donations",
      id: doc.id,
      data: {
        status: "paid",
        stripePaymentIntentId: typeof session.payment_intent === "string" ? session.payment_intent : "",
        stripeCustomerId: typeof session.customer === "string" ? session.customer : "",
        amountTotalCents: session.amount_total ?? doc.amountTotalCents ?? undefined,
        paidAt: new Date().toISOString(),
      },
    }),
    PAYLOAD_TIMEOUT_MS,
    "payload.update:donation_paid",
  )
  log.info({
    event: "webhook.donation_marked_paid",
    correlationId,
    eventId: event.id,
    sessionId: session.id,
    donationId: doc.id,
  })
}

async function updateStatusBySession(
  payload: Awaited<ReturnType<typeof getPayload>>,
  sessionId: string,
  status: "failed" | "canceled",
  correlationId: string,
  eventType: string,
): Promise<void> {
  // Same registrations → group-registrations → donations fallback chain we
  // use for refund / dispute lookup. A failed or expired session in any of
  // the three collections gets flipped without waiting for the daily cron.
  const collections = ["registrations", "group-registrations", "donations"] as const

  for (const collection of collections) {
    const existing = await withTimeout(
      payload.find({
        collection,
        where: { stripeSessionId: { equals: sessionId } },
        limit: 1,
      }),
      PAYLOAD_TIMEOUT_MS,
      `payload.find:${collection}:${status}`,
    )
    if (existing.docs.length === 0) continue

    const doc = existing.docs[0] as { id: string | number; status?: string | null }
    // Don't downgrade a row that's already in a terminal money-state.
    if (
      doc.status === "paid" ||
      doc.status === "refunded" ||
      doc.status === "partially_refunded" ||
      doc.status === "disputed" ||
      doc.status === "complete"
    ) {
      log.info({
        event: "webhook.status_skipped_terminal",
        correlationId,
        sessionId,
        collection,
        targetStatus: status,
        currentStatus: doc.status,
      })
      return
    }
    await withTimeout(
      payload.update({ collection, id: doc.id, data: { status } }),
      PAYLOAD_TIMEOUT_MS,
      `payload.update:${collection}:${status}`,
    )
    log.info({
      event: "webhook.status_updated",
      correlationId,
      sessionId,
      collection,
      rowId: doc.id,
      targetStatus: status,
      eventType,
    })
    return
  }

  log.info({ event: "webhook.status_no_match", correlationId, sessionId, targetStatus: status, eventType })
}

async function handlePaymentIntentFailed(
  payload: Awaited<ReturnType<typeof getPayload>>,
  paymentIntent: Stripe.PaymentIntent,
  correlationId: string,
  event: Stripe.Event,
): Promise<void> {
  let sessionId = paymentIntent.metadata?.stripeSessionId
  if (!sessionId) {
    try {
      const sessions = await withTimeout(
        stripe.checkout.sessions.list({ payment_intent: paymentIntent.id, limit: 1 }),
        STRIPE_LOOKUP_TIMEOUT_MS,
        "stripe.sessions.list",
      )
      sessionId = sessions.data[0]?.id
    } catch (err) {
      log.warn({
        event: "webhook.payment_intent_failed.session_lookup_failed",
        correlationId,
        paymentIntentId: paymentIntent.id,
        ...summarizeError(err),
      })
      await dlqWebhookFailure({
        correlationId,
        eventId: event.id,
        eventType: event.type,
        severity: "warn",
        reason: "session lookup failed",
        error: err,
        stripePaymentIntentId: paymentIntent.id,
        rawEvent: serializeEvent(event),
      })
      return
    }
  }
  if (!sessionId) {
    log.warn({
      event: "webhook.payment_intent_failed.no_session",
      correlationId,
      paymentIntentId: paymentIntent.id,
    })
    return
  }
  await updateStatusBySession(payload, sessionId, "failed", correlationId, event.type)
}

async function handleChargeRefunded(
  payload: Awaited<ReturnType<typeof getPayload>>,
  charge: Stripe.Charge,
  correlationId: string,
  event: Stripe.Event,
): Promise<void> {
  // F2: Guard against empty payment_intent — never query equals:"" which
  // would match every still-pending registration.
  const paymentIntentId = typeof charge.payment_intent === "string" ? charge.payment_intent : ""
  if (!paymentIntentId) {
    log.warn({ event: "webhook.refund.no_payment_intent", correlationId, chargeId: charge.id })
    await dlqWebhookFailure({
      correlationId,
      eventId: event.id,
      eventType: event.type,
      severity: "warn",
      reason: "refund event missing payment_intent",
      stripeChargeId: charge.id,
      rawEvent: serializeEvent(event),
    })
    return
  }

  const amountRefundedCents = charge.amount_refunded ?? 0
  const isPartial = amountRefundedCents < charge.amount
  const refundedFully = !isPartial
  const refundedAt = new Date().toISOString()

  // Look in registrations first. A self/self_plus_gift/gift_only/comp row
  // will surface here.
  const regHits = await withTimeout(
    payload.find({
      collection: "registrations",
      where: { stripePaymentIntentId: { equals: paymentIntentId } },
      limit: 1,
    }),
    PAYLOAD_TIMEOUT_MS,
    "payload.find:refund_reg",
  )
  if (regHits.docs.length > 0) {
    const reg = regHits.docs[0] as { id: string | number; type?: string | null; stripeSessionId?: string | null }
    await withTimeout(
      payload.update({
        collection: "registrations",
        id: reg.id,
        data: {
          status: isPartial ? "partially_refunded" : "refunded",
          refundedAt,
          refundAmountCents: amountRefundedCents,
          refundedFully,
        },
      }),
      PAYLOAD_TIMEOUT_MS,
      "payload.update:refund_reg",
    )
    log.info({
      event: "webhook.refund_applied",
      correlationId,
      paymentIntentId,
      registrationId: reg.id,
      partial: isPartial,
      amountRefundedCents,
    })

    // If this purchase spawned gift codes AND the refund is full, void the
    // unclaimed ones. Partial refunds (e.g., breakfast-only refund on a
    // self+gift order) don't auto-void; admin can void manually if needed.
    const spawnedGifts = reg.type === "self_plus_scholarship" || reg.type === "scholarship"
    if (refundedFully && spawnedGifts && reg.stripeSessionId) {
      await voidUnclaimedGiftsForSession({
        payload,
        stripeSessionId: reg.stripeSessionId,
        reason: `Parent purchase refunded (PI ${paymentIntentId})`,
        correlationId,
      })
    }
    return
  }

  // Fall through to group registrations.
  const groupHits = await withTimeout(
    payload.find({
      collection: "group-registrations",
      where: { stripePaymentIntentId: { equals: paymentIntentId } },
      limit: 1,
    }),
    PAYLOAD_TIMEOUT_MS,
    "payload.find:refund_group",
  )
  if (groupHits.docs.length > 0) {
    const grp = groupHits.docs[0] as { id: string | number }
    await withTimeout(
      payload.update({
        collection: "group-registrations",
        id: grp.id,
        data: {
          status: isPartial ? "partially_refunded" : "refunded",
          refundedAt,
          refundAmountCents: amountRefundedCents,
          refundedFully,
        },
      }),
      PAYLOAD_TIMEOUT_MS,
      "payload.update:refund_group",
    )
    log.info({
      event: "webhook.group_refund_applied",
      correlationId,
      paymentIntentId,
      groupRegistrationId: grp.id,
      partial: isPartial,
      amountRefundedCents,
    })
    return
  }

  // Finally, donations.
  const donationHits = await withTimeout(
    payload.find({
      collection: "donations",
      where: { stripePaymentIntentId: { equals: paymentIntentId } },
      limit: 1,
    }),
    PAYLOAD_TIMEOUT_MS,
    "payload.find:refund_donation",
  )
  if (donationHits.docs.length > 0) {
    const don = donationHits.docs[0] as { id: string | number }
    await withTimeout(
      payload.update({
        collection: "donations",
        id: don.id,
        data: {
          status: isPartial ? "partially_refunded" : "refunded",
          refundedAt,
          refundAmountCents: amountRefundedCents,
          refundedFully,
        },
      }),
      PAYLOAD_TIMEOUT_MS,
      "payload.update:refund_donation",
    )
    log.info({
      event: "webhook.donation_refund_applied",
      correlationId,
      paymentIntentId,
      donationId: don.id,
      partial: isPartial,
      amountRefundedCents,
    })
    return
  }

  log.warn({
    event: "webhook.refund.no_match",
    correlationId,
    paymentIntentId,
    chargeId: charge.id,
  })
  await dlqWebhookFailure({
    correlationId,
    eventId: event.id,
    eventType: event.type,
    severity: "warn",
    reason: "refund event has no matching registration or donation row",
    stripePaymentIntentId: paymentIntentId,
    stripeChargeId: charge.id,
    rawEvent: serializeEvent(event),
  })
}

async function handleDisputeCreated(
  payload: Awaited<ReturnType<typeof getPayload>>,
  dispute: Stripe.Dispute,
  correlationId: string,
  event: Stripe.Event,
): Promise<void> {
  let lookupValue = typeof dispute.payment_intent === "string" ? dispute.payment_intent : ""
  if (!lookupValue && typeof dispute.charge === "string") {
    try {
      const charge = await withTimeout(
        stripe.charges.retrieve(dispute.charge),
        STRIPE_LOOKUP_TIMEOUT_MS,
        "stripe.charges.retrieve",
      )
      lookupValue = typeof charge.payment_intent === "string" ? charge.payment_intent : ""
    } catch (err) {
      log.warn({
        event: "webhook.dispute.charge_lookup_failed",
        correlationId,
        chargeId: dispute.charge,
        ...summarizeError(err),
      })
      await dlqWebhookFailure({
        correlationId,
        eventId: event.id,
        eventType: event.type,
        severity: "warn",
        reason: "charge lookup failed",
        error: err,
        stripeChargeId: typeof dispute.charge === "string" ? dispute.charge : undefined,
        rawEvent: serializeEvent(event),
      })
      return
    }
  }
  if (!lookupValue) {
    log.warn({
      event: "webhook.dispute.no_payment_intent",
      correlationId,
      disputeId: dispute.id,
    })
    return
  }
  const disputedAt = new Date().toISOString()

  // Registrations first.
  const regHits = await withTimeout(
    payload.find({
      collection: "registrations",
      where: { stripePaymentIntentId: { equals: lookupValue } },
      limit: 1,
    }),
    PAYLOAD_TIMEOUT_MS,
    "payload.find:dispute_reg",
  )
  if (regHits.docs.length > 0) {
    const reg = regHits.docs[0] as { id: string | number; type?: string | null; stripeSessionId?: string | null }
    await withTimeout(
      payload.update({
        collection: "registrations",
        id: reg.id,
        data: { status: "disputed", disputedAt, disputeId: dispute.id },
      }),
      PAYLOAD_TIMEOUT_MS,
      "payload.update:dispute_reg",
    )
    log.info({
      event: "webhook.dispute_recorded",
      correlationId,
      paymentIntentId: lookupValue,
      registrationId: reg.id,
      disputeId: dispute.id,
    })

    // Disputed gift purchases: void the unclaimed codes. Funds may still
    // come back via dispute response, but treating them as void during the
    // dispute window prevents new claims; an admin can re-issue if we win.
    const spawnedGifts = reg.type === "self_plus_scholarship" || reg.type === "scholarship"
    if (spawnedGifts && reg.stripeSessionId) {
      await voidUnclaimedGiftsForSession({
        payload,
        stripeSessionId: reg.stripeSessionId,
        reason: `Chargeback opened (dispute ${dispute.id})`,
        correlationId,
      })
    }

    await alertCritical({
      event: "registration.dispute_opened",
      correlationId,
      summary: `Chargeback opened on registration ${reg.id}`,
      fields: {
        disputeId: dispute.id,
        paymentIntentId: lookupValue,
        registrationId: String(reg.id),
        type: reg.type ?? null,
        amount: dispute.amount,
        reason: dispute.reason ?? null,
      },
    })
    return
  }

  // Group registrations fallback.
  const groupHits = await withTimeout(
    payload.find({
      collection: "group-registrations",
      where: { stripePaymentIntentId: { equals: lookupValue } },
      limit: 1,
    }),
    PAYLOAD_TIMEOUT_MS,
    "payload.find:dispute_group",
  )
  if (groupHits.docs.length > 0) {
    const grp = groupHits.docs[0] as { id: string | number; organizationName?: string | null }
    await withTimeout(
      payload.update({
        collection: "group-registrations",
        id: grp.id,
        data: { status: "disputed", disputedAt, disputeId: dispute.id },
      }),
      PAYLOAD_TIMEOUT_MS,
      "payload.update:dispute_group",
    )
    log.info({
      event: "webhook.group_dispute_recorded",
      correlationId,
      paymentIntentId: lookupValue,
      groupRegistrationId: grp.id,
      disputeId: dispute.id,
    })
    await alertCritical({
      event: "group.dispute_opened",
      correlationId,
      summary: `Chargeback opened on group registration ${grp.id} (${grp.organizationName ?? "unknown org"})`,
      fields: {
        disputeId: dispute.id,
        paymentIntentId: lookupValue,
        groupRegistrationId: String(grp.id),
        amount: dispute.amount,
        reason: dispute.reason ?? null,
      },
    })
    return
  }

  // Donations fallback.
  const donationHits = await withTimeout(
    payload.find({
      collection: "donations",
      where: { stripePaymentIntentId: { equals: lookupValue } },
      limit: 1,
    }),
    PAYLOAD_TIMEOUT_MS,
    "payload.find:dispute_donation",
  )
  if (donationHits.docs.length > 0) {
    const don = donationHits.docs[0] as { id: string | number }
    await withTimeout(
      payload.update({
        collection: "donations",
        id: don.id,
        data: { status: "disputed", disputedAt, disputeId: dispute.id },
      }),
      PAYLOAD_TIMEOUT_MS,
      "payload.update:dispute_donation",
    )
    log.info({
      event: "webhook.donation_dispute_recorded",
      correlationId,
      paymentIntentId: lookupValue,
      donationId: don.id,
      disputeId: dispute.id,
    })
    await alertCritical({
      event: "donation.dispute_opened",
      correlationId,
      summary: `Chargeback opened on donation ${don.id}`,
      fields: {
        disputeId: dispute.id,
        paymentIntentId: lookupValue,
        donationId: String(don.id),
        amount: dispute.amount,
        reason: dispute.reason ?? null,
      },
    })
    return
  }

  log.warn({
    event: "webhook.dispute.no_match",
    correlationId,
    paymentIntentId: lookupValue,
    disputeId: dispute.id,
  })
  await dlqWebhookFailure({
    correlationId,
    eventId: event.id,
    eventType: event.type,
    severity: "warn",
    reason: "dispute event has no matching registration or donation row",
    stripePaymentIntentId: lookupValue,
    rawEvent: serializeEvent(event),
  })
}

function serializeEvent(event: Stripe.Event): unknown {
  try {
    return JSON.parse(JSON.stringify(event))
  } catch {
    return { id: event.id, type: event.type, _unserializable: true }
  }
}
