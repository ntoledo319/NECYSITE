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

vi.mock("@/lib/scholarship-email", () => ({
  maybeNotifyScholarshipRecipient: vi.fn().mockResolvedValue(undefined),
}))

vi.mock("@/lib/alerts", () => ({
  alertCritical: vi.fn().mockResolvedValue(undefined),
}))

vi.mock("@/lib/dlq", () => ({
  dlqWebhookFailure: vi.fn().mockResolvedValue(undefined),
}))

describe("Stripe Webhook API", () => {
  const mockPayloadUpdate = vi.fn()
  const mockPayloadFind = vi.fn()
  const mockPayloadCreate = vi.fn()

  beforeEach(() => {
    vi.resetAllMocks()
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_test"
    ;(getPayload as any).mockResolvedValue({
      update: mockPayloadUpdate,
      find: mockPayloadFind,
      create: mockPayloadCreate,
    })
    mockPayloadCreate.mockResolvedValue({})
    mockPayloadUpdate.mockResolvedValue({})
    mockPayloadFind.mockResolvedValue({ docs: [] })
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

  it("marks registration paid on checkout.session.completed when paid", async () => {
    const req = new Request("http://localhost/api/webhooks/stripe", {
      method: "POST",
      headers: { "stripe-signature": "test_sig" },
      body: "{}",
    })

    ;(stripe.webhooks.constructEvent as any).mockReturnValue({
      id: "evt_test_paid",
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test_123",
          payment_intent: "pi_test_123",
          customer: "cus_test_123",
          payment_status: "paid",
          status: "complete",
          amount_total: 4150,
        },
      },
    })

    // First find = idempotency check (no duplicate). Second find = locate row.
    mockPayloadFind
      .mockResolvedValueOnce({ docs: [] })
      .mockResolvedValueOnce({ docs: [{ id: "reg_123", status: "pending", amountTotalCents: 4150 }] })

    const res = await POST(req)
    expect(res.status).toBe(200)

    expect(mockPayloadUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: "registrations",
        id: "reg_123",
        data: expect.objectContaining({
          status: "paid",
          stripePaymentIntentId: "pi_test_123",
          stripeCustomerId: "cus_test_123",
        }),
      }),
    )
  })

  it("does NOT mark paid when payment_status !== 'paid' (async pending)", async () => {
    const req = new Request("http://localhost/api/webhooks/stripe", {
      method: "POST",
      headers: { "stripe-signature": "test_sig" },
      body: "{}",
    })

    ;(stripe.webhooks.constructEvent as any).mockReturnValue({
      id: "evt_test_async",
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test_async",
          payment_intent: "pi_test_async",
          customer: "cus_test_async",
          payment_status: "unpaid",
          status: "complete",
        },
      },
    })

    mockPayloadFind.mockResolvedValue({ docs: [] }) // idempotency check only

    const res = await POST(req)
    expect(res.status).toBe(200)
    // We never call update because we returned before the find:paid step.
    expect(mockPayloadUpdate).not.toHaveBeenCalled()
  })

  it("returns 200 and does not update when no matching registration is found", async () => {
    const req = new Request("http://localhost/api/webhooks/stripe", {
      method: "POST",
      headers: { "stripe-signature": "test_sig" },
      body: "{}",
    })

    ;(stripe.webhooks.constructEvent as any).mockReturnValue({
      id: "evt_test_unknown",
      type: "checkout.session.completed",
      data: {
        object: { id: "cs_test_unknown", payment_status: "paid", status: "complete" },
      },
    })

    mockPayloadFind
      .mockResolvedValueOnce({ docs: [] }) // idempotency
      .mockResolvedValueOnce({ docs: [] }) // locate row

    const res = await POST(req)
    expect(res.status).toBe(200)
    expect(mockPayloadUpdate).not.toHaveBeenCalled()
  })

  it("short-circuits when the event has already been processed", async () => {
    const req = new Request("http://localhost/api/webhooks/stripe", {
      method: "POST",
      headers: { "stripe-signature": "test_sig" },
      body: "{}",
    })

    ;(stripe.webhooks.constructEvent as any).mockReturnValue({
      id: "evt_test_dup",
      type: "checkout.session.completed",
      data: { object: { id: "cs_test_dup", payment_status: "paid", status: "complete" } },
    })

    mockPayloadFind.mockResolvedValueOnce({ docs: [{ id: "ev_already" }] })

    const res = await POST(req)
    expect(res.status).toBe(200)
    expect(mockPayloadUpdate).not.toHaveBeenCalled()
  })
})
