"use server"

import { stripe } from "@/lib/stripe"
import { BREAKFAST_PRODUCTS, REGISTRATION_PRODUCTS, calculateProcessingFee } from "@/lib/registration-products"

interface RegistrationData {
  name: string
  state: string
  email: string
  accommodations: string
  interpretationNeeded: boolean
  handicapAccessibility: boolean
  willingToServe: boolean
  homegroup: string
  isScholarship: boolean
  scholarshipRecipientName: string
  scholarshipRecipientEmail: string
}

interface PolicyAgreements {
  readPolicy: boolean
  understandQuestions: boolean
  acknowledgeBehavior: boolean
  understandAdmission: boolean
  understandReporting: boolean
  understandInvestigation: boolean
  signatureAgreement: boolean
}

interface PurchaseAttribution {
  aaEntity?: string
  reservedForPerson?: string
}

export async function startRegistrationCheckout(
  productId: string,
  registrationData: RegistrationData,
  policyAgreements: PolicyAgreements | null,
  scholarshipQuantity = 0,
  breakfastIds: string[] = [],
  attribution?: PurchaseAttribution,
) {
  const product = REGISTRATION_PRODUCTS.find((p) => p.id === productId)
  if (!product) {
    throw new Error(`Registration product with id "${productId}" not found`)
  }

  if (!registrationData.isScholarship && !policyAgreements) {
    throw new Error("Policy agreement is required for non-scholarship registrations")
  }

  console.log("Creating checkout for product:", product.name, "Price:", product.priceInCents)

  const sanitizedScholarshipQuantity =
    Number.isInteger(scholarshipQuantity) && scholarshipQuantity >= 0 ? scholarshipQuantity : 0
  const selfRegistrationQuantity = registrationData.isScholarship ? 0 : 1
  const finalScholarshipQuantity =
    registrationData.isScholarship && sanitizedScholarshipQuantity === 0 ? 1 : sanitizedScholarshipQuantity
  const totalRegistrationQuantity = selfRegistrationQuantity + finalScholarshipQuantity
  const selectedBreakfasts = breakfastIds
    .map((id) => BREAKFAST_PRODUCTS.find((bp) => bp.id === id))
    .filter((bp): bp is (typeof BREAKFAST_PRODUCTS)[number] => Boolean(bp))
  const breakfastTotalCents = selectedBreakfasts.reduce((sum, bp) => sum + bp.priceInCents, 0)
  const subtotalInCents = product.priceInCents * totalRegistrationQuantity + breakfastTotalCents
  const processingFee = calculateProcessingFee(subtotalInCents)
  console.log("Processing fee:", processingFee)

  const metadata = {
    purchase_type:
      selfRegistrationQuantity > 0 && finalScholarshipQuantity > 0
        ? "self_plus_scholarship"
        : registrationData.isScholarship
          ? "scholarship"
          : "self",
    self_registration_quantity: selfRegistrationQuantity.toString(),
    scholarship_quantity: finalScholarshipQuantity.toString(),
    attendee_name: registrationData.name || "Not provided",
    attendee_state: registrationData.state || "Not provided",
    attendee_email: registrationData.email || "Not provided",
    scholarship_recipient_name: registrationData.scholarshipRecipientName || "None",
    scholarship_recipient_email: registrationData.scholarshipRecipientEmail || "None",
    breakfast_tickets: selectedBreakfasts.map((bp) => bp.name).join(", ") || "None",
    breakfast_count: selectedBreakfasts.length.toString(),
    attribution_aa_entity: attribution?.aaEntity || "None",
    attribution_reserved_for_person: attribution?.reservedForPerson || "None",
    accommodations: registrationData.isScholarship ? "Not provided (scholarship purchase)" : registrationData.accommodations || "None",
    interpretation_needed: registrationData.isScholarship ? "not_applicable" : registrationData.interpretationNeeded.toString(),
    handicap_accessibility: registrationData.isScholarship ? "not_applicable" : registrationData.handicapAccessibility.toString(),
    willing_to_serve: registrationData.isScholarship ? "not_applicable" : registrationData.willingToServe.toString(),
    homegroup_committee: registrationData.homegroup,
    policy_read_and_understood: policyAgreements ? policyAgreements.readPolicy.toString() : "not_applicable",
    policy_questions_understood: policyAgreements ? policyAgreements.understandQuestions.toString() : "not_applicable",
    policy_behavior_acknowledged: policyAgreements ? policyAgreements.acknowledgeBehavior.toString() : "not_applicable",
    policy_admission_understood: policyAgreements ? policyAgreements.understandAdmission.toString() : "not_applicable",
    policy_reporting_understood: policyAgreements ? policyAgreements.understandReporting.toString() : "not_applicable",
    policy_investigation_understood: policyAgreements ? policyAgreements.understandInvestigation.toString() : "not_applicable",
    policy_signature_agreement: policyAgreements ? policyAgreements.signatureAgreement.toString() : "not_applicable",
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.necypaact.com"
  const successUrl = `${baseUrl}/register/success?session_id={CHECKOUT_SESSION_ID}`

  try {
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      return_url: successUrl,
      customer_email: registrationData.email || undefined,
      line_items: [
        ...(selfRegistrationQuantity > 0
          ? [
              {
                price_data: {
                  currency: "usd",
                  product_data: {
                    name: product.name,
                    description: product.description,
                  },
                  unit_amount: product.priceInCents,
                },
                quantity: selfRegistrationQuantity,
              },
            ]
          : []),
        ...(finalScholarshipQuantity > 0
          ? [
              {
                price_data: {
                  currency: "usd",
                  product_data: {
                    name: "Scholarship Registration",
                    description: "Sponsored NECYPAA XXXVI registration",
                  },
                  unit_amount: product.priceInCents,
                },
                quantity: finalScholarshipQuantity,
              },
            ]
          : []),
        ...selectedBreakfasts.map((bp) => ({
          price_data: {
            currency: "usd",
            product_data: {
              name: bp.name,
              description: bp.description,
            },
            unit_amount: bp.priceInCents,
          },
          quantity: 1,
        })),
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Processing Fee",
              description: "Credit card processing fee (2.9% + $0.30)",
            },
            unit_amount: processingFee,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: metadata,
      payment_intent_data: {
        metadata: metadata,
      },
    })

    console.log("Stripe session created with ID:", session.id)
    console.log("Client secret exists:", !!session.client_secret)

    if (!session.client_secret) {
      throw new Error("No client secret returned from Stripe")
    }

    return session.client_secret
  } catch (error) {
    console.error("Stripe session creation failed:", error)
    throw error
  }
}
