import { describe, it, expect, vi, beforeEach } from "vitest"
import { POST } from "../route"
import { stripe } from "@/lib/stripe"
import { getPayload } from "payload"

vi.mock("@/lib/stripe", () => ({
  stripe: {
    webhooks: {
      constructEvent: vi.fn(),
    },
  },
}))

vi.mock("payload", () => ({
  getPayload: vi.fn(),
}))

vi.mock("@payload-config", () => ({
  default: {},
}))

describe("Stripe Webhook API", () => {
  const mockPayloadUpdate = vi.fn()
  const mockPayloadFind = vi.fn()

  beforeEach(() => {
    vi.resetAllMocks()
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_test"
    ;(getPayload as any).mockResolvedValue({
      update: mockPayloadUpdate,
      find: mockPayloadFind,
    })
  })

  it("returns 400 if signature is missing", async () => {
    const req = new Request("http://localhost/api/webhooks/stripe", {
      method: "POST",
      body: "{}",
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
    expect(await res.text()).toBe("Webhook Secret or Signature missing")
  })

  it("updates registration status on checkout.session.completed", async () => {
    const req = new Request("http://localhost/api/webhooks/stripe", {
      method: "POST",
      headers: { "stripe-signature": "test_sig" },
      body: "{}",
    })

    ;(stripe.webhooks.constructEvent as any).mockReturnValue({
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test_123",
          payment_intent: "pi_test_123",
          customer: "cus_test_123",
        },
      },
    })

    mockPayloadFind.mockResolvedValue({
      docs: [{ id: "reg_123" }],
    })

    const res = await POST(req)
    expect(res.status).toBe(200)

    expect(mockPayloadFind).toHaveBeenCalledWith(expect.objectContaining({
      collection: "registrations",
      where: { stripeSessionId: { equals: "cs_test_123" } },
    }))

    expect(mockPayloadUpdate).toHaveBeenCalledWith(expect.objectContaining({
      collection: "registrations",
      id: "reg_123",
      data: {
        status: "paid",
        stripePaymentIntentId: "pi_test_123",
        stripeCustomerId: "cus_test_123",
      },
    }))
  })

  it("is idempotent - if no registration found, doesn't crash", async () => {
    const req = new Request("http://localhost/api/webhooks/stripe", {
      method: "POST",
      headers: { "stripe-signature": "test_sig" },
      body: "{}",
    })

    ;(stripe.webhooks.constructEvent as any).mockReturnValue({
      type: "checkout.session.completed",
      data: {
        object: { id: "cs_test_unknown" },
      },
    })

    mockPayloadFind.mockResolvedValue({ docs: [] })

    const res = await POST(req)
    expect(res.status).toBe(200)
    expect(mockPayloadUpdate).not.toHaveBeenCalled()
  })
})
