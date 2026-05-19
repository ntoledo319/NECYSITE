// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import RegistrationCheckout from "@/components/registration-checkout"
import type { PolicyAgreements, RegistrationData } from "@/lib/types"

const { mockStartRegistrationCheckout } = vi.hoisted(() => ({
  mockStartRegistrationCheckout: vi.fn(),
}))

vi.mock("@/actions/registration", () => ({
  startRegistrationCheckout: mockStartRegistrationCheckout,
}))

vi.mock("next-intl", () => ({
  useLocale: () => "en",
}))

vi.mock("@stripe/stripe-js", () => ({
  loadStripe: vi.fn(() => Promise.resolve({})),
}))

vi.mock("@stripe/react-stripe-js", async () => {
  const React = await import("react")
  return {
    EmbeddedCheckout: () => <div data-testid="embedded-checkout">Embedded checkout</div>,
    EmbeddedCheckoutProvider: ({
      options,
      children,
    }: {
      options: { fetchClientSecret?: () => Promise<string> }
      children: React.ReactNode
    }) => {
      React.useEffect(() => {
        void options.fetchClientSecret?.()
      }, [options])
      return <div data-testid="embedded-provider">{children}</div>
    },
  }
})

vi.mock("@/components/checkout/access-code-checkout", () => ({
  default: () => <div>Access code checkout</div>,
}))

vi.mock("@/components/checkout/breakfast-add-ons", () => ({
  default: () => <div>Breakfast add-ons</div>,
}))

const completePolicy: PolicyAgreements = {
  readPolicy: true,
  understandQuestions: true,
  acknowledgeBehavior: true,
  understandAdmission: true,
  understandReporting: true,
  understandInvestigation: true,
  signatureAgreement: true,
}

const baseRegistration: RegistrationData = {
  intent: "self",
  name: "Jordan Sponsor",
  email: "jordan@example.com",
  state: "Connecticut",
  homegroup: "Hartford YPAA",
  accommodations: "",
  interpretationNeeded: false,
  mobilityAccessibility: false,
  willingToServe: false,
  giftRecipients: [],
  donationAmountCents: 0,
  accessCode: "",
}

const giftOnlyRegistration: RegistrationData = {
  ...baseRegistration,
  intent: "gift_only",
  state: "",
  homegroup: "",
  giftRecipients: [
    { name: "Casey Recipient", email: "casey@example.com", message: "" },
    { name: "Pat Recipient", email: "", message: "" },
  ],
}

const donationRegistration: RegistrationData = {
  ...baseRegistration,
  intent: "donate",
  state: "",
  homegroup: "",
  donationAmountCents: 5000,
}

describe("registration checkout flow", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = "pk_test_123"
    mockStartRegistrationCheckout.mockResolvedValue({
      ok: true,
      clientSecret: "cs_test_123",
      correlationId: "reg_test_correlation",
    })
  })

  it("calls the action with intent + locale for a self registration", async () => {
    render(
      <RegistrationCheckout
        registrationData={baseRegistration}
        policyAgreements={completePolicy}
        onBack={() => {}}
      />,
    )

    fireEvent.click(await screen.findByRole("button", { name: /proceed to payment/i }))

    await waitFor(() => {
      expect(mockStartRegistrationCheckout).toHaveBeenCalledWith(
        "necypaa-xxxvi-registration",
        baseRegistration,
        completePolicy,
        [],
        undefined,
        "en",
      )
    })
  })

  it("forwards a gift-only registration without policy agreement", async () => {
    render(
      <RegistrationCheckout
        registrationData={giftOnlyRegistration}
        policyAgreements={null}
        onBack={() => {}}
      />,
    )

    fireEvent.click(await screen.findByRole("button", { name: /proceed to payment/i }))

    await waitFor(() => {
      expect(mockStartRegistrationCheckout).toHaveBeenCalledWith(
        "necypaa-xxxvi-registration",
        giftOnlyRegistration,
        null,
        [],
        undefined,
        "en",
      )
    })
  })

  it("forwards a donation with no breakfast and no policy", async () => {
    render(
      <RegistrationCheckout
        registrationData={donationRegistration}
        policyAgreements={null}
        onBack={() => {}}
      />,
    )

    fireEvent.click(await screen.findByRole("button", { name: /proceed to payment/i }))

    await waitFor(() => {
      expect(mockStartRegistrationCheckout).toHaveBeenCalledWith(
        "necypaa-xxxvi-registration",
        donationRegistration,
        null,
        [],
        undefined,
        "en",
      )
    })
  })
})
