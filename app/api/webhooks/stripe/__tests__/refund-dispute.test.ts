import { describe, it, expect, vi, beforeEach } from "vitest"
import { POST } from "../route"
import { stripe } from "@/lib/stripe"
import { getPayload } from "payload"

vi.mock("@/lib/stripe", () => ({
  stripe: {
    webhooks: { constructEvent: vi.fn() },
    charges: { retrieve: vi.fn() },
  },
}))

vi.mock("payload", () => ({
  getPayload: vi.fn(),
}))

vi.mock("@payload-config", () => ({ default: {} }))

vi.mock("@/lib/scholarship-email", () => ({
  maybeNotifyScholarshipRecipient: vi.fn().mockResolvedValue(undefined),
}))

vi.mock("@/lib/alerts", () => ({
  alertCritical: vi.fn().mockResolvedValue(undefined),
}))

vi.mock("@/lib/dlq", () => ({
  dlqWebhookFailure: vi.fn().mockResolvedValue(undefined),
  dlqRegistrationFailure: vi.fn().mockResolvedValue(undefined),
}))

vi.mock("@/lib/gift-mint", () => ({
  mintGiftCodesForPaidSession: vi.fn().mockResolvedValue(undefined),
}))

describe("Stripe Webhook — refund routing", () => {
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
  })

  it("marks a self registration refunded and records the amount", async () => {
    ;(stripe.webhooks.constructEvent as any).mockReturnValue({
      id: "evt_refund_self",
      type: "charge.refunded",
      data: {
        object: {
          id: "ch_1",
          payment_intent: "pi_self",
          amount: 4150,
          amount_refunded: 4150,
        },
      },
    })

    mockPayloadFind
      .mockResolvedValueOnce({ docs: [] }) // idempotency check
      .mockResolvedValueOnce({ docs: [{ id: "reg_1", type: "self", stripeSessionId: "cs_1" }] }) // registrations

    const req = new Request("http://localhost/api/webhooks/stripe", {
      method: "POST",
      headers: { "stripe-signature": "sig" },
      body: "{}",
    })
    const res = await POST(req)
    expect(res.status).toBe(200)

    const updateCall = mockPayloadUpdate.mock.calls.find(([arg]) => arg.collection === "registrations")
    expect(updateCall).toBeTruthy()
    expect(updateCall![0]).toMatchObject({
      collection: "registrations",
      id: "reg_1",
      data: expect.objectContaining({
        status: "refunded",
        refundAmountCents: 4150,
        refundedFully: true,
      }),
    })
  })

  it("marks partial refund correctly", async () => {
    ;(stripe.webhooks.constructEvent as any).mockReturnValue({
      id: "evt_refund_partial",
      type: "charge.refunded",
      data: {
        object: { id: "ch_2", payment_intent: "pi_partial", amount: 4150, amount_refunded: 2500 },
      },
    })
    mockPayloadFind
      .mockResolvedValueOnce({ docs: [] })
      .mockResolvedValueOnce({ docs: [{ id: "reg_2", type: "self", stripeSessionId: "cs_2" }] })

    await POST(new Request("http://localhost/api/webhooks/stripe", {
      method: "POST",
      headers: { "stripe-signature": "sig" },
      body: "{}",
    }))

    const updateCall = mockPayloadUpdate.mock.calls.find(([arg]) => arg.collection === "registrations")
    expect(updateCall).toBeTruthy()
    expect(updateCall![0].data).toMatchObject({
      status: "partially_refunded",
      refundedFully: false,
      refundAmountCents: 2500,
    })
  })

  it("falls back to donations table when no registration matches the PI", async () => {
    ;(stripe.webhooks.constructEvent as any).mockReturnValue({
      id: "evt_refund_donation",
      type: "charge.refunded",
      data: {
        object: { id: "ch_donate", payment_intent: "pi_donate", amount: 5000, amount_refunded: 5000 },
      },
    })
    mockPayloadFind
      .mockResolvedValueOnce({ docs: [] }) // idempotency
      .mockResolvedValueOnce({ docs: [] }) // registrations — no match
      .mockResolvedValueOnce({ docs: [{ id: "don_1" }] }) // donations — match

    await POST(new Request("http://localhost/api/webhooks/stripe", {
      method: "POST",
      headers: { "stripe-signature": "sig" },
      body: "{}",
    }))

    const updateCall = mockPayloadUpdate.mock.calls.find(([arg]) => arg.collection === "donations")
    expect(updateCall).toBeTruthy()
    expect(updateCall![0]).toMatchObject({
      collection: "donations",
      id: "don_1",
      data: expect.objectContaining({
        status: "refunded",
        refundedFully: true,
        refundAmountCents: 5000,
      }),
    })
  })

  it("voids unclaimed gift codes when a gift_only purchase is fully refunded", async () => {
    ;(stripe.webhooks.constructEvent as any).mockReturnValue({
      id: "evt_refund_gift",
      type: "charge.refunded",
      data: {
        object: { id: "ch_gift", payment_intent: "pi_gift", amount: 12000, amount_refunded: 12000 },
      },
    })
    mockPayloadFind
      .mockResolvedValueOnce({ docs: [] }) // idempotency
      .mockResolvedValueOnce({ docs: [{ id: "reg_gift", type: "scholarship", stripeSessionId: "cs_gift" }] })
      // gift_void helper does its own find on the gift-codes collection
      .mockResolvedValueOnce({
        docs: [
          { id: "g1", status: "unclaimed", recipientName: "Alex" },
          { id: "g2", status: "unclaimed", recipientName: "Bee" },
          { id: "g3", status: "claimed", recipientName: "Cee" },
        ],
      })

    await POST(new Request("http://localhost/api/webhooks/stripe", {
      method: "POST",
      headers: { "stripe-signature": "sig" },
      body: "{}",
    }))

    const voidUpdates = mockPayloadUpdate.mock.calls.filter(([arg]) => arg.collection === "gift-codes")
    expect(voidUpdates).toHaveLength(2)
    expect(voidUpdates.map((c) => c[0].id).sort()).toEqual(["g1", "g2"])
    expect(voidUpdates[0][0].data).toMatchObject({ status: "void" })
  })

  it("does NOT void gift codes on a partial refund", async () => {
    ;(stripe.webhooks.constructEvent as any).mockReturnValue({
      id: "evt_refund_gift_partial",
      type: "charge.refunded",
      data: {
        object: { id: "ch_partial", payment_intent: "pi_partial_gift", amount: 16150, amount_refunded: 2500 },
      },
    })
    mockPayloadFind
      .mockResolvedValueOnce({ docs: [] })
      .mockResolvedValueOnce({ docs: [{ id: "reg_p", type: "self_plus_scholarship", stripeSessionId: "cs_p" }] })

    await POST(new Request("http://localhost/api/webhooks/stripe", {
      method: "POST",
      headers: { "stripe-signature": "sig" },
      body: "{}",
    }))

    const voidUpdates = mockPayloadUpdate.mock.calls.filter(([arg]) => arg.collection === "gift-codes")
    expect(voidUpdates).toHaveLength(0)
  })
})

describe("Stripe Webhook — dispute routing", () => {
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
  })

  it("records dispute on a registration and voids unclaimed gift codes", async () => {
    ;(stripe.webhooks.constructEvent as any).mockReturnValue({
      id: "evt_dispute_gift",
      type: "charge.dispute.created",
      data: {
        object: {
          id: "du_1",
          payment_intent: "pi_disputed",
          amount: 8000,
          reason: "fraudulent",
        },
      },
    })
    mockPayloadFind
      .mockResolvedValueOnce({ docs: [] }) // idempotency
      .mockResolvedValueOnce({ docs: [{ id: "reg_d", type: "scholarship", stripeSessionId: "cs_d" }] })
      .mockResolvedValueOnce({ docs: [{ id: "g_d1", status: "unclaimed", recipientName: "Dee" }] })

    await POST(new Request("http://localhost/api/webhooks/stripe", {
      method: "POST",
      headers: { "stripe-signature": "sig" },
      body: "{}",
    }))

    const regUpdate = mockPayloadUpdate.mock.calls.find(([arg]) => arg.collection === "registrations")
    expect(regUpdate).toBeTruthy()
    expect(regUpdate![0].data).toMatchObject({ status: "disputed", disputeId: "du_1" })
    const voidUpdate = mockPayloadUpdate.mock.calls.find(([arg]) => arg.collection === "gift-codes")
    expect(voidUpdate).toBeTruthy()
    expect(voidUpdate![0]).toMatchObject({ id: "g_d1", data: expect.objectContaining({ status: "void" }) })
  })

  it("routes dispute to donations when no registration matches", async () => {
    ;(stripe.webhooks.constructEvent as any).mockReturnValue({
      id: "evt_dispute_donation",
      type: "charge.dispute.created",
      data: {
        object: { id: "du_donate", payment_intent: "pi_donate_dispute", amount: 10000, reason: "duplicate" },
      },
    })
    mockPayloadFind
      .mockResolvedValueOnce({ docs: [] })
      .mockResolvedValueOnce({ docs: [] }) // registrations — no match
      .mockResolvedValueOnce({ docs: [{ id: "don_d" }] })

    await POST(new Request("http://localhost/api/webhooks/stripe", {
      method: "POST",
      headers: { "stripe-signature": "sig" },
      body: "{}",
    }))

    const donUpdate = mockPayloadUpdate.mock.calls.find(([arg]) => arg.collection === "donations")
    expect(donUpdate).toBeTruthy()
    expect(donUpdate![0]).toMatchObject({
      id: "don_d",
      data: expect.objectContaining({ status: "disputed", disputeId: "du_donate" }),
    })
  })
})
