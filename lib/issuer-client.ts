import "server-only"

export interface RedemptionRequest {
  code: string
  eventSlug: string
  email: string
  fullName: string
  source: string
  idempotencyKey: string
}

export interface RedemptionSuccess {
  success: true
  grantId: string
  grantType: "cash_registration" | "cash_scholarship"
  redemptionId: string
  message?: string
}

export interface RedemptionFailure {
  success: false
  error: string
  code: "INVALID_CODE" | "EXPIRED_CODE" | "ALREADY_REDEEMED" | "SERVICE_ERROR"
}

export type RedeemResult = RedemptionSuccess | RedemptionFailure

export async function redeemRegistrationCode(
  request: RedemptionRequest,
): Promise<RedeemResult> {
  const baseUrl = process.env.ISSUER_SERVICE_BASE_URL
  const apiKey = process.env.ISSUER_SERVICE_API_KEY

  if (!baseUrl || !apiKey) {
    console.error("Issuer service configuration missing: ISSUER_SERVICE_BASE_URL or ISSUER_SERVICE_API_KEY")
    return {
      success: false,
      error: "Registration code service is not available at this time. Please try again later or contact us at info@necypaa.org.",
      code: "SERVICE_ERROR",
    }
  }

  try {
    const response = await fetch(
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

    const result = await response.json()
    return result as RedemptionSuccess
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
