import { NextResponse } from "next/server"
import { getLivePricing } from "@/lib/pricing"
import { newCorrelationId } from "@/lib/correlation"
import { log, summarizeError } from "@/lib/logger"

/**
 * Public read-only pricing endpoint. Exists so the client form can render
 * order summaries that reflect live Payload pricing instead of the
 * compiled-in defaults. The server checkout actions remain authoritative —
 * this endpoint only powers display.
 *
 * Cached for 60s at the edge so a popular page doesn't hammer Payload.
 * Falls back to compiled defaults if Payload is unreachable, same as
 * `getLivePricing()`. Never errors out from the client's perspective.
 */

export const dynamic = "force-dynamic"

export interface PricingResponse {
  registrationCents: number
  breakfast: {
    fridayCents: number
    saturdayCents: number
    sundayCents: number
  }
  source: "payload" | "fallback"
  generatedAt: string
}

export async function GET() {
  const correlationId = newCorrelationId("pricing")
  try {
    const pricing = await getLivePricing()
    const friday = pricing.breakfasts.find((b) => b.id === "breakfast-friday")
    const saturday = pricing.breakfasts.find((b) => b.id === "breakfast-saturday")
    const sunday = pricing.breakfasts.find((b) => b.id === "breakfast-sunday")
    const body: PricingResponse = {
      registrationCents: pricing.registration.priceInCents,
      breakfast: {
        fridayCents: friday?.priceInCents ?? 2500,
        saturdayCents: saturday?.priceInCents ?? 2500,
        sundayCents: sunday?.priceInCents ?? 2500,
      },
      source: pricing.source,
      generatedAt: new Date().toISOString(),
    }
    return NextResponse.json(body, {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=60, stale-while-revalidate=120",
      },
    })
  } catch (err) {
    log.error({ event: "pricing.endpoint_failed", correlationId, ...summarizeError(err) })
    const fallback: PricingResponse = {
      registrationCents: 4000,
      breakfast: { fridayCents: 2500, saturdayCents: 2500, sundayCents: 2500 },
      source: "fallback",
      generatedAt: new Date().toISOString(),
    }
    return NextResponse.json(fallback, {
      status: 200,
      headers: {
        "Cache-Control": "public, max-age=30",
      },
    })
  }
}
