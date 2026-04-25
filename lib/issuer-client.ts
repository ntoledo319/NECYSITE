import "server-only"
import { z } from "zod"

export interface RedemptionRequest {
  code: string
  eventSlug: string
  email: string
  fullName: string
  source: string
  idempotencyKey: string
}

const redemptionSuccessSchema = z.object({
  success: z.literal(true),
  grantId: z.string().min(1),
  grantType: z.enum(["cash_registration", "cash_scholarship"]),
  redemptionId: z.string().min(1),
  message: z.string().optional(),
})

const redemptionFailureSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  code: z.enum(["INVALID_CODE", "EXPIRED_CODE", "ALREADY_REDEEMED", "SERVICE_ERROR"]),
})

const redemptionResponseSchema = z.union([redemptionSuccessSchema, redemptionFailureSchema])

export type RedemptionSuccess = z.infer<typeof redemptionSuccessSchema>
export type RedemptionFailure = z.infer<typeof redemptionFailureSchema>
export type RedeemResult = RedemptionSuccess | RedemptionFailure

async function fetchWithRetry(
  url: string,
  init: RequestInit,
  opts: { maxRetries?: number; baseDelayMs?: number } = {},
): Promise<Response> {
  const { maxRetries = 1, baseDelayMs = 1_000 } = opts
  let lastError: Error | undefined

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, init)
      return response
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err))
      if (attempt < maxRetries) {
        const delay = baseDelayMs * 2 ** attempt
        await new Promise((res) => setTimeout(res, delay))
      }
    }
  }

  throw lastError ?? new Error("Fetch failed after retries")
}

export async function redeemRegistrationCode(request: RedemptionRequest): Promise<RedeemResult> {
  const baseUrl = process.env.ISSUER_SERVICE_BASE_URL
  const apiKey = process.env.ISSUER_SERVICE_API_KEY

  if (!baseUrl || !apiKey) {
    console.error("Issuer service configuration missing: ISSUER_SERVICE_BASE_URL or ISSUER_SERVICE_API_KEY")
    return {
      success: false,
      error:
        "Registration code service is not available at this time. Please try again later or contact us at info@necypaa.org.",
      code: "SERVICE_ERROR",
    }
  }

  try {
    const response = await fetchWithRetry(
      `${baseUrl}/api/internal/redeem-registration-code`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(request),
        signal: AbortSignal.timeout(10_000),
      },
      { maxRetries: 1, baseDelayMs: 1_000 },
    )

    if (!response.ok) {
      const body = await response.json().catch(() => null)

      if (response.status === 400 || response.status === 404 || response.status === 409) {
        return {
          success: false,
          error: body?.error || "This code is not valid. Please check the code and try again.",
          code: body?.code || "INVALID_CODE",
        }
      }

      console.error("Issuer service error:", response.status, body)
      return {
        success: false,
        error: "We were unable to verify your code at this time. Please try again in a moment.",
        code: "SERVICE_ERROR",
      }
    }

    const raw = await response.json()
    const parsed = redemptionResponseSchema.safeParse(raw)

    if (!parsed.success) {
      console.error("Issuer service returned unexpected shape:", parsed.error.flatten())
      return {
        success: false,
        error: "We received an unexpected response from the code verification service. Please try again in a moment.",
        code: "SERVICE_ERROR",
      }
    }

    return parsed.data
  } catch (error) {
    console.error("Issuer service request failed:", error)
    return {
      success: false,
      error: "We were unable to reach the code verification service. Please try again in a moment.",
      code: "SERVICE_ERROR",
    }
  }
}

export function maskAccessCode(code: string): string {
  if (code.length <= 4) return "****"
  return "****" + code.slice(-4)
}
