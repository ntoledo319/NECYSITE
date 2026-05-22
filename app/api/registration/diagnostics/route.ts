import { NextResponse } from "next/server"
import { getPayload } from "payload"
import configPromise from "@payload-config"
import { newCorrelationId } from "@/lib/correlation"
import { log, summarizeError } from "@/lib/logger"
import { withTimeout, safeAsync } from "@/lib/resilience"

/**
 * Admin diagnostics for registration. Loadable at 11:59pm on the day
 * registration opens so the maintainer doesn't have to grep logs. Auth:
 * either a valid Payload admin session cookie (Payload handles that via
 * its own headers) OR `Authorization: Bearer $CRON_SECRET` for scripted
 * checks.
 */

export const dynamic = "force-dynamic"

const EMPTY_PAGE = {
  docs: [] as Array<Record<string, unknown> & { id: string | number }>,
  hasNextPage: false,
  hasPrevPage: false,
  limit: 0,
  page: 1,
  pagingCounter: 0,
  totalDocs: 0,
  totalPages: 0,
  nextPage: null as number | null,
  prevPage: null as number | null,
}

interface AgeBucket {
  label: string
  ceilingMinutes: number
  count: number
}

function isAuthorized(req: Request, user: { role?: string } | null): boolean {
  if (user?.role === "admin" || user?.role === "registration") return true
  const expected = process.env.CRON_SECRET
  if (!expected) return false
  const got = req.headers.get("authorization")
  return got === `Bearer ${expected}`
}

export async function GET(req: Request) {
  const correlationId = newCorrelationId("diag")
  const payload = await safeAsync(
    () => withTimeout(getPayload({ config: configPromise }), 5_000, "diagnostics.bootstrap"),
    null,
    { correlationId, label: "diagnostics.bootstrap", severity: "error" },
  )
  if (!payload) {
    return NextResponse.json({ ok: false, reason: "payload_unavailable" }, { status: 500 })
  }

  let user: { role?: string } | null = null
  try {
    const result = await payload.auth({ headers: req.headers })
    user = result.user as { role?: string } | null
  } catch (err) {
    log.warn({ event: "diagnostics.auth_check_failed", correlationId, ...summarizeError(err) })
  }

  if (!isAuthorized(req, user)) {
    return NextResponse.json({ ok: false, reason: "unauthorized" }, { status: 401 })
  }

  const now = Date.now()
  const buckets: AgeBucket[] = [
    { label: "0-15m", ceilingMinutes: 15, count: 0 },
    { label: "15-60m", ceilingMinutes: 60, count: 0 },
    { label: "1-6h", ceilingMinutes: 6 * 60, count: 0 },
    { label: "6-24h", ceilingMinutes: 24 * 60, count: 0 },
    { label: ">24h", ceilingMinutes: Number.POSITIVE_INFINITY, count: 0 },
  ]

  // Build the same age-bucket histogram for each of the three pending pools
  // separately so the admin sees at a glance which type of purchase is stuck.
  const makeBuckets = (): AgeBucket[] => [
    { label: "0-15m", ceilingMinutes: 15, count: 0 },
    { label: "15-60m", ceilingMinutes: 60, count: 0 },
    { label: "1-6h", ceilingMinutes: 6 * 60, count: 0 },
    { label: "6-24h", ceilingMinutes: 24 * 60, count: 0 },
    { label: ">24h", ceilingMinutes: Number.POSITIVE_INFINITY, count: 0 },
  ]

  const registrationsBuckets = buckets
  const groupBuckets = makeBuckets()
  const donationsBuckets = makeBuckets()

  const fetchPending = async (collection: "registrations" | "group-registrations" | "donations") =>
    safeAsync(
      () =>
        withTimeout(
          payload.find({
            collection,
            where: { status: { equals: "pending" } },
            limit: 500,
            sort: "createdAt",
          }),
          6_000,
          `diagnostics.find_pending:${collection}`,
        ),
      EMPTY_PAGE,
      { correlationId, label: `diagnostics.find_pending:${collection}`, severity: "warn" },
    )

  const [pending, pendingGroup, pendingDonations] = await Promise.all([
    fetchPending("registrations"),
    fetchPending("group-registrations"),
    fetchPending("donations"),
  ])

  const populateBucket = (rows: { docs: Array<Record<string, unknown>> }, bucketSet: AgeBucket[]) => {
    for (const row of rows.docs) {
      const createdRaw = row.createdAt
      const created = typeof createdRaw === "string" ? new Date(createdRaw).getTime() : now
      const ageMin = (now - created) / 60_000
      const bucket = bucketSet.find((b) => ageMin <= b.ceilingMinutes)
      if (bucket) bucket.count += 1
    }
  }

  populateBucket(pending, registrationsBuckets)
  populateBucket(pendingGroup, groupBuckets)
  populateBucket(pendingDonations, donationsBuckets)

  const recentFailures = await safeAsync(
    () =>
      withTimeout(
        payload.find({
          collection: "registration-failures",
          where: { recovered: { equals: false } },
          limit: 25,
          sort: "-occurredAt",
        }),
        6_000,
        "diagnostics.find_failures",
      ),
    EMPTY_PAGE,
    { correlationId, label: "diagnostics.find_failures", severity: "warn" },
  )

  const recentWebhookFailures = await safeAsync(
    () =>
      withTimeout(
        payload.find({
          collection: "webhook-failures",
          where: { recovered: { equals: false } },
          limit: 25,
          sort: "-occurredAt",
        }),
        6_000,
        "diagnostics.find_webhook_failures",
      ),
    EMPTY_PAGE,
    { correlationId, label: "diagnostics.find_webhook_failures", severity: "warn" },
  )

  const recentProcessed = await safeAsync(
    () =>
      withTimeout(
        payload.find({
          collection: "processed-webhook-events",
          limit: 10,
          sort: "-processedAt",
        }),
        4_000,
        "diagnostics.find_processed",
      ),
    EMPTY_PAGE,
    { correlationId, label: "diagnostics.find_processed", severity: "warn" },
  )

  const recentRegistrations = await safeAsync(
    () =>
      withTimeout(
        payload.find({
          collection: "registrations",
          limit: 25,
          sort: "-createdAt",
        }),
        6_000,
        "diagnostics.find_recent",
      ),
    EMPTY_PAGE,
    { correlationId, label: "diagnostics.find_recent", severity: "warn" },
  )

  const statusCounts: Record<string, number> = {}
  for (const row of recentRegistrations.docs) {
    const s = (row as { status?: string }).status ?? "unknown"
    statusCounts[s] = (statusCounts[s] ?? 0) + 1
  }

  return NextResponse.json({
    ok: true,
    correlationId,
    generatedAt: new Date().toISOString(),
    pending: {
      registrations: { total: pending.docs.length, ageBuckets: registrationsBuckets },
      groupRegistrations: { total: pendingGroup.docs.length, ageBuckets: groupBuckets },
      donations: { total: pendingDonations.docs.length, ageBuckets: donationsBuckets },
    },
    recentStatusCounts: statusCounts,
    failures: {
      registration: recentFailures.docs.map((r) => ({
        id: (r as { id: unknown }).id,
        correlationId: (r as { correlationId?: string }).correlationId,
        stage: (r as { stage?: string }).stage,
        severity: (r as { severity?: string }).severity,
        occurredAt: (r as { occurredAt?: string }).occurredAt,
        errorMessage: (r as { errorMessage?: string }).errorMessage,
      })),
      webhook: recentWebhookFailures.docs.map((r) => ({
        id: (r as { id: unknown }).id,
        eventType: (r as { eventType?: string }).eventType,
        severity: (r as { severity?: string }).severity,
        occurredAt: (r as { occurredAt?: string }).occurredAt,
        reason: (r as { reason?: string }).reason,
      })),
    },
    lastProcessedEvents: recentProcessed.docs.map((r) => ({
      eventId: (r as { eventId?: string }).eventId,
      eventType: (r as { eventType?: string }).eventType,
      processedAt: (r as { processedAt?: string }).processedAt,
    })),
  })
}
