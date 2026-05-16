import { NextResponse } from "next/server"
import { z } from "zod"
import { log } from "@/lib/logger"
import { isCorrelationId } from "@/lib/correlation"

/**
 * Receives client-side error reports from RegistrationErrorBoundary. We log
 * them; structured logs are picked up by Vercel and (when wired) Sentry.
 * No DLQ row — these are UI crashes, not state-changing failures.
 */

export const dynamic = "force-dynamic"

const reportSchema = z.object({
  section: z.enum(["form", "policy", "payment", "summary", "page"]),
  correlationId: z.string().min(1).max(80),
  message: z.string().max(1000),
  stack: z.string().max(4000).optional(),
  componentStack: z.string().max(4000).optional(),
  url: z.string().max(500).optional(),
})

export async function POST(req: Request) {
  try {
    if (req.headers.get("content-length") && Number(req.headers.get("content-length")) > 16_000) {
      return new NextResponse("payload too large", { status: 413 })
    }
    const json = await req.json().catch(() => null)
    const parsed = reportSchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json({ ok: false }, { status: 400 })
    }
    const { section, correlationId, message, stack, componentStack, url } = parsed.data
    log.error({
      event: "registration.client_error",
      correlationId: isCorrelationId(correlationId) ? correlationId : undefined,
      section,
      errorMessage: message,
      errorStack: stack,
      componentStack,
      url,
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    log.error({
      event: "registration.client_error.handler_failed",
      errorMessage: err instanceof Error ? err.message : String(err),
    })
    return NextResponse.json({ ok: false }, { status: 200 })
  }
}
