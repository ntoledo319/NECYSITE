import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

// Mock "server-only" so it doesn't throw in test environment
vi.mock("server-only", () => ({}))

// Must import after mock
const { maskAccessCode, redeemRegistrationCode } = await import("../issuer-client")

describe("maskAccessCode", () => {
  it("masks codes longer than 4 characters, showing last 4", () => {
    expect(maskAccessCode("ABCDEFGH")).toBe("****EFGH")
  })

  it("masks short codes (≤ 4 chars) completely", () => {
    expect(maskAccessCode("AB")).toBe("****")
    expect(maskAccessCode("ABCD")).toBe("****")
  })

  it("handles empty string", () => {
    expect(maskAccessCode("")).toBe("****")
  })

  it("masks codes of exactly 5 characters", () => {
    expect(maskAccessCode("12345")).toBe("****2345")
  })
})

describe("redeemRegistrationCode", () => {
  const validRequest = {
    code: "TEST-CODE-123",
    eventSlug: "necypaa-xxxvi",
    email: "test@example.com",
    fullName: "Test Person",
    source: "necypaa-main-site",
    idempotencyKey: "abc123",
  }

  beforeEach(() => {
    vi.stubEnv("ISSUER_SERVICE_BASE_URL", "https://issuer.test")
    vi.stubEnv("ISSUER_SERVICE_API_KEY", "test-api-key")
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
  })

  it("returns SERVICE_ERROR when env vars are missing", async () => {
    vi.stubEnv("ISSUER_SERVICE_BASE_URL", "")
    vi.stubEnv("ISSUER_SERVICE_API_KEY", "")

    const result = await redeemRegistrationCode(validRequest)

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.code).toBe("SERVICE_ERROR")
    }
  })

  it("returns success on 200 response", async () => {
    const mockResponse = {
      success: true,
      grantId: "grant-1",
      grantType: "cash_registration",
      redemptionId: "red-1",
    }

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify(mockResponse), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    )

    const result = await redeemRegistrationCode(validRequest)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.grantId).toBe("grant-1")
      expect(result.grantType).toBe("cash_registration")
    }
  })

  it("returns INVALID_CODE on 400 response", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ error: "Code not found", code: "INVALID_CODE" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }),
    )

    const result = await redeemRegistrationCode(validRequest)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.code).toBe("INVALID_CODE")
    }
  })

  it("returns INVALID_CODE on 404 response", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      }),
    )

    const result = await redeemRegistrationCode(validRequest)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.code).toBe("INVALID_CODE")
    }
  })

  it("returns SERVICE_ERROR on 500 response", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(new Response("Internal Server Error", { status: 500 }))

    const result = await redeemRegistrationCode(validRequest)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.code).toBe("SERVICE_ERROR")
    }
  })

  it("returns SERVICE_ERROR on network failure", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(new Error("Network error"))

    const result = await redeemRegistrationCode(validRequest)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.code).toBe("SERVICE_ERROR")
      expect(result.error).toContain("unable to reach")
    }
  })

  it("sends correct headers and body", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(
        JSON.stringify({ success: true, grantId: "g1", grantType: "cash_registration", redemptionId: "r1" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      ),
    )

    await redeemRegistrationCode(validRequest)

    expect(fetchSpy).toHaveBeenCalledOnce()
    const [url, options] = fetchSpy.mock.calls[0]
    expect(url).toBe("https://issuer.test/api/internal/redeem-registration-code")
    expect(options?.method).toBe("POST")
    expect(options?.headers).toEqual(
      expect.objectContaining({
        "Content-Type": "application/json",
        Authorization: "Bearer test-api-key",
      }),
    )
    expect(JSON.parse(options?.body as string)).toEqual(validRequest)
  })
})
