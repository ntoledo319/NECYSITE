import { NextResponse } from "next/server"
import { getPayload } from "payload"
import configPromise from "@payload-config"
import { stripe } from "@/lib/stripe"
import { newCorrelationId } from "@/lib/correlation"
import { log, summarizeError } from "@/lib/logger"
import { withTimeout, safeAsync, TimeoutError } from "@/lib/resilience"
import { dlqRegistrationFailure } from "@/lib/dlq"
import { alertCritical } from "@/lib/alerts"
import { maybeNotifyScholarshipRecipient } from "@/lib/scholarship-email"
import { mintGiftCodesForPaidSession } from "@/lib/gift-mint"

/**
 * Sweep pending registrations, group registrations, and donations and
 * reconcile each against Stripe. Runs daily (see vercel.json — Hobby plan
 * cap). Auth-gated with `Authorization: Bearer $CRON_SECRET`; Vercel Cron
 * sends this header automatically when the env var is set.
 *
 * Two passes:
 *   1. `registrations`         (attendee + breakfast + comp + gift parent)
 *   2. `group-registrations`   (bulk org seats)
 *   3. `donations`             (General Fund)
 *
 * Each pass is independent — one collection going sideways doesn't stop
 * the others. Every per-row operation is wrapped in safeAsync.
 */

export const dynamic = "force-dynamic"
export const maxDuration = 60

const PAYLOAD_TIMEOUT_MS = 8_000
const STRIPE_TIMEOUT_MS = 6_000
const SOFT_PENDING_MINUTES = 60 // warn when older than this
const HARD_PENDING_MINUTES = 24 * 60 // canceled when older than this with expired/missing session
const BATCH_LIMIT = 200

function isAuthorized(req: Request): boolean {
  const expected = process.env.CRON_SECRET
  if (!expected) {
    // Without a secret configured the route refuses to run — better than
    // letting anyone trigger it.
    return false
  }
  const got = req.headers.get("authorization")
  if (!got) return false
  return got === `Bearer ${expected}`
}

export async function GET(req: Request) {
  const correlationId = newCorrelationId("recon")
  if (!isAuthorized(req)) {
    log.warn({ event: "reconcile.unauthorized", correlationId })
    return new NextResponse("unauthorized", { status: 401 })
  }

  log.info({ event: "reconcile.started", correlationId })

  let payload: Awaited<ReturnType<typeof getPayload>>
  try {
    payload = await withTimeout(getPayload({ config: configPromise }), PAYLOAD_TIMEOUT_MS, "payload.bootstrap")
  } catch (err) {
    log.error({ event: "reconcile.payload_bootstrap_failed", correlationId, ...summarizeError(err) })
    await alertCritical({
      event: "reconcile.payload_unavailable",
      correlationId,
      summary: "Reconciliation could not bootstrap Payload",
      fields: { error: err instanceof Error ? err.message : String(err) },
    })
    return NextResponse.json({ ok: false, reason: "payload_unavailable" }, { status: 500 })
  }

  const cutoffSoft = new Date(Date.now() - SOFT_PENDING_MINUTES * 60_000).toISOString()
  const cutoffHard = new Date(Date.now() - HARD_PENDING_MINUTES * 60_000).toISOString()

  let pending
  try {
    pending = await withTimeout(
      payload.find({
        collection: "registrations",
        where: {
          and: [{ status: { equals: "pending" } }, { createdAt: { less_than: cutoffSoft } }],
        },
        limit: BATCH_LIMIT,
        sort: "createdAt",
      }),
      PAYLOAD_TIMEOUT_MS,
      "payload.find:pending",
    )
  } catch (err) {
    log.error({ event: "reconcile.find_failed", correlationId, ...summarizeError(err) })
    await dlqRegistrationFailure({
      correlationId,
      stage: "reconciliation.sweep",
      severity: "critical",
      error: err,
    })
    return NextResponse.json({ ok: false, reason: "find_failed" }, { status: 500 })
  }

  const summary = makeSummary()

  for (const row of pending.docs) {
    summary.registrations.processed += 1
    await safeAsync(() => reconcileOne(payload, row, correlationId, cutoffHard, summary.registrations), undefined, {
      correlationId,
      label: `reconcile.row:${row.id}`,
      severity: "warn",
      onError: (err) =>
        dlqRegistrationFailure({
          correlationId,
          stage: "reconciliation.sweep",
          severity: "warn",
          error: err,
          registrationId: row.id,
          stripeSessionId: row.stripeSessionId ?? undefined,
        }),
    }).catch(() => {
      summary.registrations.errors += 1
    })
  }

  // Pass 2: group-registrations. Independent of pass 1 — a Payload failure
  // on the registrations sweep shouldn't block group reconciliation.
  await sweepCollection({
    payload,
    collection: "group-registrations",
    correlationId,
    cutoffSoft,
    cutoffHard,
    summary: summary.groupRegistrations,
    onPaid: async ({ row, session }) => {
      await withTimeout(
        payload.update({
          collection: "group-registrations",
          id: row.id,
          data: {
            status: "paid",
            stripePaymentIntentId: typeof session.payment_intent === "string" ? session.payment_intent : "",
            stripeCustomerId: typeof session.customer === "string" ? session.customer : "",
            amountTotalCents: session.amount_total ?? row.amountTotalCents ?? undefined,
            paidAt: new Date().toISOString(),
          },
        }),
        PAYLOAD_TIMEOUT_MS,
        `payload.update:group:${row.id}:paid`,
      )
    },
    onCancel: async ({ row, reason }) => {
      await withTimeout(
        payload.update({ collection: "group-registrations", id: row.id, data: { status: "canceled" } }),
        PAYLOAD_TIMEOUT_MS,
        `payload.update:group:${row.id}:${reason}`,
      )
    },
  })

  // Pass 3: donations. Same shape.
  await sweepCollection({
    payload,
    collection: "donations",
    correlationId,
    cutoffSoft,
    cutoffHard,
    summary: summary.donations,
    onPaid: async ({ row, session }) => {
      await withTimeout(
        payload.update({
          collection: "donations",
          id: row.id,
          data: {
            status: "paid",
            stripePaymentIntentId: typeof session.payment_intent === "string" ? session.payment_intent : "",
            stripeCustomerId: typeof session.customer === "string" ? session.customer : "",
            amountTotalCents: session.amount_total ?? row.amountTotalCents ?? undefined,
            paidAt: new Date().toISOString(),
          },
        }),
        PAYLOAD_TIMEOUT_MS,
        `payload.update:donation:${row.id}:paid`,
      )
    },
    onCancel: async ({ row, reason }) => {
      await withTimeout(
        payload.update({ collection: "donations", id: row.id, data: { status: "canceled" } }),
        PAYLOAD_TIMEOUT_MS,
        `payload.update:donation:${row.id}:${reason}`,
      )
    },
  })

  log.info({ event: "reconcile.completed", correlationId, summary })

  const totalErrors = summary.registrations.errors + summary.groupRegistrations.errors + summary.donations.errors
  if (totalErrors > 0) {
    await alertCritical({
      event: "reconcile.errors_present",
      correlationId,
      summary: `Reconciliation finished with ${totalErrors} per-row errors`,
      fields: {
        registrationsErrors: summary.registrations.errors,
        groupErrors: summary.groupRegistrations.errors,
        donationErrors: summary.donations.errors,
      },
    })
  }

  return NextResponse.json({ ok: true, correlationId, summary })
}

interface CollectionSummary {
  processed: number
  paid: number
  canceledExpired: number
  canceledMissing: number
  stillPending: number
  warnedAged: number
  errors: number
}

function makeCollectionSummary(): CollectionSummary {
  return {
    processed: 0,
    paid: 0,
    canceledExpired: 0,
    canceledMissing: 0,
    stillPending: 0,
    warnedAged: 0,
    errors: 0,
  }
}

function makeSummary() {
  return {
    registrations: makeCollectionSummary(),
    groupRegistrations: makeCollectionSummary(),
    donations: makeCollectionSummary(),
  }
}

interface SweepableRow {
  id: string | number
  status?: string | null
  stripeSessionId?: string | null
  createdAt?: string | null
  amountTotalCents?: number | null
}

interface SweepArgs {
  payload: Awaited<ReturnType<typeof getPayload>>
  collection: "group-registrations" | "donations"
  correlationId: string
  cutoffSoft: string
  cutoffHard: string
  summary: CollectionSummary
  onPaid: (args: { row: SweepableRow; session: import("stripe").default.Checkout.Session }) => Promise<void>
  onCancel: (args: {
    row: SweepableRow
    reason: "cancel_orphan" | "cancel_missing" | "cancel_expired" | "cancel_aged_open"
  }) => Promise<void>
}

/**
 * Generic sweeper for collections that share the registrations status
 * model (pending → paid / canceled / etc, with stripeSessionId).
 */
async function sweepCollection(args: SweepArgs): Promise<void> {
  const { payload, collection, correlationId, cutoffSoft, cutoffHard, summary, onPaid, onCancel } = args

  let pending
  try {
    pending = await withTimeout(
      payload.find({
        collection,
        where: { and: [{ status: { equals: "pending" } }, { createdAt: { less_than: cutoffSoft } }] },
        limit: BATCH_LIMIT,
        sort: "createdAt",
      }),
      PAYLOAD_TIMEOUT_MS,
      `payload.find:${collection}_pending`,
    )
  } catch (err) {
    log.error({ event: "reconcile.find_failed", correlationId, collection, ...summarizeError(err) })
    summary.errors += 1
    return
  }

  for (const row of pending.docs as SweepableRow[]) {
    summary.processed += 1
    await safeAsync(
      () => reconcileGenericRow({ row, correlationId, cutoffHard, summary, onPaid, onCancel, collection }),
      undefined,
      {
        correlationId,
        label: `reconcile.${collection}:${row.id}`,
        severity: "warn",
        onError: (err) =>
          dlqRegistrationFailure({
            correlationId,
            stage: "reconciliation.sweep",
            severity: "warn",
            error: err,
            registrationId: row.id,
            stripeSessionId: row.stripeSessionId ?? undefined,
          }),
      },
    ).catch(() => {
      summary.errors += 1
    })
  }
}

async function reconcileGenericRow(args: {
  row: SweepableRow
  correlationId: string
  cutoffHard: string
  summary: CollectionSummary
  collection: "group-registrations" | "donations"
  onPaid: (args: { row: SweepableRow; session: import("stripe").default.Checkout.Session }) => Promise<void>
  onCancel: (args: {
    row: SweepableRow
    reason: "cancel_orphan" | "cancel_missing" | "cancel_expired" | "cancel_aged_open"
  }) => Promise<void>
}): Promise<void> {
  const { row, correlationId, cutoffHard, summary, collection, onPaid, onCancel } = args
  const sessionId = row.stripeSessionId
  const createdAt = row.createdAt ?? new Date().toISOString()
  const isAged = createdAt < cutoffHard

  if (!sessionId) {
    if (isAged) {
      await onCancel({ row, reason: "cancel_orphan" })
      summary.canceledMissing += 1
      log.info({ event: "reconcile.canceled_orphan", correlationId, collection, rowId: row.id })
      return
    }
    summary.warnedAged += 1
    log.warn({ event: "reconcile.pending_no_session", correlationId, collection, rowId: row.id, createdAt })
    return
  }

  let session
  try {
    session = await withTimeout(
      stripe.checkout.sessions.retrieve(sessionId),
      STRIPE_TIMEOUT_MS,
      "stripe.sessions.retrieve",
    )
  } catch (err) {
    const code = (err as { code?: string }).code
    if (code === "resource_missing") {
      await onCancel({ row, reason: "cancel_missing" })
      summary.canceledMissing += 1
      log.info({
        event: "reconcile.canceled_session_missing",
        correlationId,
        collection,
        rowId: row.id,
        sessionId,
      })
      return
    }
    if (err instanceof TimeoutError) {
      summary.warnedAged += 1
      log.warn({ event: "reconcile.stripe_timeout", correlationId, collection, rowId: row.id, sessionId })
      return
    }
    throw err
  }

  if (session.payment_status === "paid" && session.status === "complete") {
    await onPaid({ row, session })
    summary.paid += 1
    log.info({ event: "reconcile.promoted_paid", correlationId, collection, rowId: row.id, sessionId })
    await alertCritical({
      event: "reconcile.missed_webhook",
      correlationId,
      summary: `Pending ${collection} row ${row.id} was actually paid; webhook didn't fire (or didn't process)`,
      fields: { collection, sessionId, rowId: String(row.id) },
    })
    return
  }

  if (session.status === "expired") {
    await onCancel({ row, reason: "cancel_expired" })
    summary.canceledExpired += 1
    log.info({ event: "reconcile.canceled_expired", correlationId, collection, rowId: row.id, sessionId })
    return
  }

  if (isAged && session.status === "open") {
    await onCancel({ row, reason: "cancel_aged_open" })
    summary.canceledExpired += 1
    log.info({ event: "reconcile.canceled_aged_open", correlationId, collection, rowId: row.id, sessionId })
    return
  }

  summary.stillPending += 1
  summary.warnedAged += 1
  log.info({
    event: "reconcile.still_pending",
    correlationId,
    collection,
    rowId: row.id,
    sessionId,
    paymentStatus: session.payment_status,
    sessionStatus: session.status,
  })
}

interface PendingRow {
  id: string | number
  status?: string | null
  stripeSessionId?: string | null
  createdAt?: string | null
  amountTotalCents?: number | null
}

async function reconcileOne(
  payload: Awaited<ReturnType<typeof getPayload>>,
  row: PendingRow,
  correlationId: string,
  cutoffHardIso: string,
  summary: { paid: number; canceledExpired: number; canceledMissing: number; stillPending: number; warnedAged: number },
): Promise<void> {
  const sessionId = row.stripeSessionId
  const createdAt = row.createdAt ?? new Date().toISOString()
  const isAged = createdAt < cutoffHardIso

  if (!sessionId) {
    if (isAged) {
      await withTimeout(
        payload.update({ collection: "registrations", id: row.id, data: { status: "canceled" } }),
        PAYLOAD_TIMEOUT_MS,
        `payload.update:${row.id}:cancel_orphan`,
      )
      summary.canceledMissing += 1
      log.info({ event: "reconcile.canceled_orphan", correlationId, registrationId: row.id })
      return
    }
    summary.warnedAged += 1
    log.warn({ event: "reconcile.pending_no_session", correlationId, registrationId: row.id, createdAt })
    return
  }

  let session
  try {
    session = await withTimeout(stripe.checkout.sessions.retrieve(sessionId), STRIPE_TIMEOUT_MS, "stripe.sessions.retrieve")
  } catch (err) {
    const code = (err as { code?: string }).code
    if (code === "resource_missing") {
      await withTimeout(
        payload.update({ collection: "registrations", id: row.id, data: { status: "canceled" } }),
        PAYLOAD_TIMEOUT_MS,
        `payload.update:${row.id}:cancel_missing`,
      )
      summary.canceledMissing += 1
      log.info({ event: "reconcile.canceled_session_missing", correlationId, registrationId: row.id, sessionId })
      return
    }
    if (err instanceof TimeoutError) {
      summary.warnedAged += 1
      log.warn({ event: "reconcile.stripe_timeout", correlationId, registrationId: row.id, sessionId })
      return
    }
    throw err
  }

  if (session.payment_status === "paid" && session.status === "complete") {
    await withTimeout(
      payload.update({
        collection: "registrations",
        id: row.id,
        data: {
          status: "paid",
          stripePaymentIntentId: typeof session.payment_intent === "string" ? session.payment_intent : "",
          stripeCustomerId: typeof session.customer === "string" ? session.customer : "",
          amountTotalCents: session.amount_total ?? row.amountTotalCents ?? undefined,
        },
      }),
      PAYLOAD_TIMEOUT_MS,
      `payload.update:${row.id}:paid`,
    )
    summary.paid += 1
    log.info({ event: "reconcile.promoted_paid", correlationId, registrationId: row.id, sessionId })
    // A row that paid but was never updated by the webhook is a webhook
    // delivery problem — page someone.
    await alertCritical({
      event: "reconcile.missed_webhook",
      correlationId,
      summary: `Pending registration ${row.id} was actually paid; webhook didn't fire (or didn't process)`,
      fields: { sessionId, registrationId: String(row.id) },
    })
    // If the missed webhook was for a gift purchase, the recipients still
    // need their codes. Mint helper holds an atomic lock keyed on
    // stripeSessionId so calling from here is safe even if the webhook
    // eventually arrives later.
    if (
      session.metadata?.intent === "self_plus_gift" ||
      session.metadata?.intent === "gift_only" ||
      session.metadata?.purchase_type === "self_plus_scholarship" ||
      session.metadata?.purchase_type === "scholarship"
    ) {
      await mintGiftCodesForPaidSession({ payload, session, correlationId })
    }
    // Legacy single-recipient scholarship email — no-op for the new flow.
    await maybeNotifyScholarshipRecipient({ session, correlationId })
    return
  }

  if (session.status === "expired") {
    await withTimeout(
      payload.update({ collection: "registrations", id: row.id, data: { status: "canceled" } }),
      PAYLOAD_TIMEOUT_MS,
      `payload.update:${row.id}:cancel_expired`,
    )
    summary.canceledExpired += 1
    log.info({ event: "reconcile.canceled_expired", correlationId, registrationId: row.id, sessionId })
    return
  }

  if (isAged && session.status === "open") {
    await withTimeout(
      payload.update({ collection: "registrations", id: row.id, data: { status: "canceled" } }),
      PAYLOAD_TIMEOUT_MS,
      `payload.update:${row.id}:cancel_aged_open`,
    )
    summary.canceledExpired += 1
    log.info({ event: "reconcile.canceled_aged_open", correlationId, registrationId: row.id, sessionId })
    return
  }

  summary.stillPending += 1
  summary.warnedAged += 1
  log.info({
    event: "reconcile.still_pending",
    correlationId,
    registrationId: row.id,
    sessionId,
    paymentStatus: session.payment_status,
    sessionStatus: session.status,
  })
}
