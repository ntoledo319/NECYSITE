// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import RegistrationCheckout from "@/components/registration-checkout"
import RegistrationConfirmation from "@/components/registration-confirmation"
import type { PolicyAgreements, RegistrationData } from "@/lib/types"

const { mockStartRegistrationCheckout, mockSubmitFreeRegistration } = vi.hoisted(() => ({
  mockStartRegistrationCheckout: vi.fn(),
  mockSubmitFreeRegistration: vi.fn(),
}))

vi.mock("@/actions/registration", () => ({
  startRegistrationCheckout: mockStartRegistrationCheckout,
}))

vi.mock("@/actions/free-registration", () => ({
  submitFreeRegistration: mockSubmitFreeRegistration,
}))

vi.mock("@stripe/stripe-js", () => ({
  loadStripe: vi.fn(() => Promise.resolve({})),
}))

vi.mock("@stripe/react-stripe-js", async () => {
  const React = await import("react")

  return {
    EmbeddedCheckout: () => <div data-testid="embedded-checkout">Embedded checkout</div>,
    EmbeddedCheckoutProvider: ({ options, children }: { options: { fetchClientSecret?: () => Promise<string> }, children: React.ReactNode }) => {
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

vi.mock("@/components/checkout/scholarship-attribution", () => ({
  default: () => <div>Scholarship attribution</div>,
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

const scholarshipRegistration: RegistrationData = {
  name: "Jordan Sponsor",
  state: "Connecticut",
  email: "jordan@example.com",
  accommodations: "",
  interpretationNeeded: false,
  mobilityAccessibility: false,
  willingToServe: false,
  homegroup: "Hartford YPAA",
  isScholarship: true,
  scholarshipRecipientName: "Casey Recipient",
  scholarshipRecipientEmail: "casey@example.com",
  accessCode: "",
}

const selfRegistration: RegistrationData = {
  ...scholarshipRegistration,
  isScholarship: false,
  scholarshipRecipientName: "",
  scholarshipRecipientEmail: "",
}

describe("scholarship flow integration", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = "pk_test_123"
    mockStartRegistrationCheckout.mockResolvedValue("cs_test_123")
    mockSubmitFreeRegistration.mockResolvedValue({ success: true })
  })

  it("lets a standard registration add and remove scholarship pricing in the paid UI", async () => {
    render(
      <RegistrationCheckout
        registrationData={selfRegistration}
        policyAgreements={completePolicy}
        onBack={() => {}}
      />,
    )

    expect(await screen.findByRole("button", { name: "Add Scholarship" })).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "Add Scholarship" }))

    expect(screen.getByText("Scholarship Pricing")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Remove scholarship registrations" })).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "Remove scholarship registrations" }))

    await waitFor(() => {
      expect(screen.queryByText("Scholarship Pricing")).not.toBeInTheDocument()
    })
  })

  it("keeps default scholarship pricing server-synced in paid checkout", async () => {
    render(
      <RegistrationCheckout
        registrationData={scholarshipRegistration}
        policyAgreements={null}
        onBack={() => {}}
      />,
    )

    fireEvent.click(await screen.findByRole("button", { name: /proceed to payment/i }))

    await waitFor(() => {
      expect(mockStartRegistrationCheckout).toHaveBeenCalledWith(
        "necypaa-xxxvi-registration",
        scholarshipRegistration,
        null,
        1,
        [],
        { aaEntity: undefined, reservedForPerson: undefined },
        undefined,
      )
    })
  })

  it("sends the custom scholarship amount to Stripe checkout in cents", async () => {
    render(
      <RegistrationCheckout
        registrationData={scholarshipRegistration}
        policyAgreements={null}
        onBack={() => {}}
      />,
    )

    fireEvent.click(await screen.findByRole("button", { name: /use custom amount/i }))
    fireEvent.change(screen.getByLabelText("Custom amount per scholarship"), {
      target: { value: "55.50" },
    })
    fireEvent.blur(screen.getByLabelText("Custom amount per scholarship"))

    expect(screen.getByText("Current scholarship total")).toBeInTheDocument()
    expect(screen.getAllByText("$55.50").length).toBeGreaterThan(0)

    fireEvent.click(screen.getByRole("button", { name: /proceed to payment/i }))

    await waitFor(() => {
      expect(mockStartRegistrationCheckout).toHaveBeenCalledWith(
        "necypaa-xxxvi-registration",
        scholarshipRegistration,
        null,
        1,
        [],
        { aaEntity: undefined, reservedForPerson: undefined },
        5550,
      )
    })
  })

  it("records default cash scholarship pricing without forcing a custom amount", async () => {
    render(
      <RegistrationConfirmation
        registrationData={scholarshipRegistration}
        policyAgreements={completePolicy}
        onBack={() => {}}
      />,
    )

    fireEvent.click(screen.getByRole("button", { name: "Save Cash Scholarship" }))

    await waitFor(() => {
      expect(mockSubmitFreeRegistration).toHaveBeenCalledWith(
        scholarshipRegistration,
        completePolicy,
        1,
        undefined,
      )
    })
  })

  it("records custom cash scholarship pricing and quantity", async () => {
    render(
      <RegistrationConfirmation
        registrationData={scholarshipRegistration}
        policyAgreements={completePolicy}
        onBack={() => {}}
      />,
    )

    fireEvent.click(screen.getByRole("button", { name: /use custom amount/i }))
    fireEvent.change(screen.getByLabelText("Custom amount per scholarship"), {
      target: { value: "60" },
    })
    fireEvent.blur(screen.getByLabelText("Custom amount per scholarship"))
    fireEvent.click(screen.getByRole("button", { name: "Increase scholarship quantity" }))

    expect(screen.getAllByText("$120.00").length).toBeGreaterThan(0)

    fireEvent.click(screen.getByRole("button", { name: "Save Cash Scholarship" }))

    await waitFor(() => {
      expect(mockSubmitFreeRegistration).toHaveBeenCalledWith(
        scholarshipRegistration,
        completePolicy,
        2,
        6000,
      )
    })
  })
})
