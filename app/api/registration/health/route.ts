import { NextResponse } from "next/server"
import { Redis } from "@upstash/redis"
import { getPayload } from "payload"
import configPromise from "@payload-config"
import { stripe } from "@/lib/stripe"
import { withTimeout } from "@/lib/resilience"
import { newCorrelationId } from "@/lib/correlation"
import { log } from "@/lib/logger"
import { isRegistrationPaused, registrationPausedReason } from "@/lib/registration-status"

/**
 * Public registration health endpoint. The registration page calls this on
 * mount so we can hide broken paths (access code if issuer is down, paid
 * checkout if Stripe is down, anything if kill switch is on). Cached briefly
 * so a popular page doesn't hammer downstreams.
 */

export const dynamic = "force-dynamic"
export const revalidate = 0

type CheckStatus = "ok" | "degraded" | "down" | "skipped"

interface SubsystemCheck {
  name: string
  status: CheckStatus
  latencyMs?: number
  message?: string
}

export interface RegistrationHealth {
  status: "ok" | "degraded" | "down"
  paused: boolean
  pausedReason?: string | null
  degradedFeatures: Array<"paid_checkout" | "access_code" | "rate_limit">
  checks: SubsystemCheck[]
  generatedAt: string
}

async function timedCheck<T>(name: string, fn: () => Promise<T>, timeoutMs: number): Promise<SubsystemCheck> {
  const start = Date.now()
  try {
    await withTimeout(fn(), timeoutMs, `health.${name}`)
    return { name, status: "ok", latencyMs: Date.now() - start }
  } catch (err) {
    const latency = Date.now() - start
    const message = err instanceof Error ? err.message : String(err)
    return { name, status: "down", latencyMs: latency, message }
  }
}

async function checkStripe(): Promise<SubsystemCheck> {
  if (!process.env.STRIPE_SECRET_KEY) {
    return { name: "stripe", status: "down", message: "STRIPE_SECRET_KEY not set" }
  }
  return timedCheck("stripe", async () => stripe.accounts.retrieve(), 3_000)
}

async function checkPayload(): Promise<SubsystemCheck> {
  return timedCheck(
    "payload",
    async () => {
      const p = await getPayload({ config: configPromise })
      await p.find({ collection: "registrations", limit: 0 })
    },
    3_000,
  )
}

async function checkRedis(): Promise<SubsystemCheck> {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) {
    return {
      name: "redis",
      status: process.env.NODE_ENV === "production" ? "down" : "degraded",
      message: "Upstash Redis not configured",
    }
  }
  return timedCheck(
    "redis",
    async () => {
      const r = new Redis({ url, token })
      await r.ping()
    },
    1_500,
  )
}

async function checkIssuer(): Promise<SubsystemCheck> {
  const baseUrl = process.env.ISSUER_SERVICE_BASE_URL
  if (!baseUrl) {
    return { name: "issuer", status: "skipped", message: "ISSUER_SERVICE_BASE_URL not set" }
  }
  return timedCheck(
    "issuer",
    async () => {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 2_500)
      try {
        const res = await fetch(`${baseUrl.replace(/\/$/, "")}/health`, {
          method: "GET",
          signal: controller.signal,
          headers: { Accept: "application/json" },
        })
        if (!res.ok) throw new Error(`issuer responded ${res.status}`)
      } finally {
        clearTimeout(timeout)
      }
    },
    3_000,
  )
}

export async function GET() {
  const correlationId = newCorrelationId("health")
  const paused = isRegistrationPaused()
  const pausedReason = paused ? registrationPausedReason() : null

  const [stripeCheck, payloadCheck, redisCheck, issuerCheck] = await Promise.all([
    checkStripe(),
    checkPayload(),
    checkRedis(),
    checkIssuer(),
  ])

  const checks = [stripeCheck, payloadCheck, redisCheck, issuerCheck]
  const degradedFeatures: RegistrationHealth["degradedFeatures"] = []

  if (stripeCheck.status === "down") degradedFeatures.push("paid_checkout")
  if (issuerCheck.status === "down") degradedFeatures.push("access_code")
  if (redisCheck.status === "down") degradedFeatures.push("rate_limit")

  let overall: RegistrationHealth["status"] = "ok"
  if (paused) {
    overall = "down"
  } else if (payloadCheck.status === "down" || stripeCheck.status === "down") {
    overall = "down"
  } else if (degradedFeatures.length > 0) {
    overall = "degraded"
  }

  const body: RegistrationHealth = {
    status: overall,
    paused,
    pausedReason,
    degradedFeatures,
    checks,
    generatedAt: new Date().toISOString(),
  }

  log.info({
    event: "registration.health.checked",
    correlationId,
    overall,
    paused,
    degradedFeatures,
    checks: checks.map((c) => ({ name: c.name, status: c.status, latencyMs: c.latencyMs })),
  })

  const httpStatus = overall === "down" ? 503 : 200
  return NextResponse.json(body, {
    status: httpStatus,
    headers: {
      "Cache-Control": "public, max-age=15, s-maxage=15, stale-while-revalidate=30",
    },
  })
}
