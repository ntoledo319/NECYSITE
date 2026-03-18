"use server"

import { createHash } from "node:crypto"
import { stripe } from "@/lib/stripe"
import { BREAKFAST_PRODUCTS, REGISTRATION_PRODUCTS, calculateProcessingFee } from "@/lib/registration-products"
import { rateLimitCheckout, rateLimitCodeRedemption } from "@/lib/rate-limit"
import {
  registrationDataSchema,
  policyAgreementsSchema,
  purchaseAttributionSchema,
  productIdSchema,
  scholarshipQuantitySchema,
  breakfastIdsSchema,
} from "@/lib/validation"
import { redeemRegistrationCode, maskAccessCode } from "@/lib/issuer-client"
import { EVENT_SLUG } from "@/lib/constants"
import type { RegistrationData, PolicyAgreements, PurchaseAttribution } from "@/lib/types"

export async function startRegistrationCheckout(
  productId: string,
  registrationData: RegistrationData,
  policyAgreements: PolicyAgreements | null,
  scholarshipQuantity = 0,
  breakfastIds: string[] = [],
  attribution?: PurchaseAttribution,
) {
  // ── Validate all inputs ──────────────────────────────────────
  const validatedProductId = productIdSchema.parse(productId)
  const validatedData = registrationDataSchema.parse(registrationData)
  const _validatedScholarshipQty = scholarshipQuantitySchema.parse(scholarshipQuantity)
  const _validatedBreakfastIds = breakfastIdsSchema.parse(breakfastIds)
  const _validatedAttribution = purchaseAttributionSchema.parse(attribution)
  const _validatedPolicy = policyAgreements ? policyAgreementsSchema.parse(policyAgreements) : null

  // ── Rate limit by email ──────────────────────────────────────
  const rl = rateLimitCheckout(validatedData.email)
  if (!rl.success) {
    throw new Error("Too many checkout attempts. Please wait a moment and try again.")
  }

  const product = REGISTRATION_PRODUCTS.find((p) => p.id === validatedProductId)
  if (!product) {
    throw new Error("Hmm, we couldn't find that registration option. Please go back and try selecting it again.")
  }

  if (!validatedData.isScholarship && !_validatedPolicy) {
    throw new Error("We need you to review and accept the policy agreement before continuing. You can find it on the previous step.")
  }


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
    mobility_accessibility: registrationData.isScholarship ? "not_applicable" : registrationData.mobilityAccessibility.toString(),
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


    if (!session.client_secret) {
      throw new Error("We had trouble connecting to our payment system. Please try again in a moment.")
    }

    return session.client_secret
  } catch (error) {
    console.error("Stripe session creation failed:", error)
    throw error
  }
}

// ─── Access Code Registration ────────────────────────────────

export async function submitAccessCodeRegistration(
  registrationData: RegistrationData,
  policyAgreements: PolicyAgreements,
): Promise<{ success: true } | { success: false; error: string }> {
  // ── Validate all inputs ──────────────────────────────────────
  const validatedData = registrationDataSchema.parse(registrationData)
  const validatedPolicy = policyAgreementsSchema.parse(policyAgreements)

  if (!validatedData.accessCode) {
    return { success: false, error: "A registration access code is required." }
  }

  // ── Rate limit by email ──────────────────────────────────────
  const rl = rateLimitCodeRedemption(validatedData.email)
  if (!rl.success) {
    return { success: false, error: "Too many attempts. Please wait a moment and try again." }
  }

  // ── Generate stable idempotency key ──────────────────────────
  const idempotencyKey = createHash("sha256")
    .update(`${validatedData.email.toLowerCase()}-${validatedData.accessCode}`)
    .digest("hex")
    .slice(0, 36)

  // ── Redeem code via issuer service ───────────────────────────
  const result = await redeemRegistrationCode({
    code: validatedData.accessCode,
    eventSlug: EVENT_SLUG,
    email: validatedData.email,
    fullName: validatedData.name,
    source: "necypaa-main-site",
    idempotencyKey,
  })

  if (!result.success) {
    return { success: false, error: result.error }
  }

  // ── Build metadata ───────────────────────────────────────────
  const metadata: Record<string, string> = {
    purchase_type: result.grantType,
    attendee_name: validatedData.name,
    attendee_state: validatedData.state,
    attendee_email: validatedData.email,
    accommodations: validatedData.accommodations || "None",
    interpretation_needed: validatedData.interpretationNeeded.toString(),
    mobility_accessibility: validatedData.mobilityAccessibility.toString(),
    willing_to_serve: validatedData.willingToServe.toString(),
    homegroup_committee: validatedData.homegroup,
    access_grant_id: result.grantId,
    access_redemption_id: result.redemptionId,
    access_grant_type: result.grantType,
    access_issuer_source: "archway-issuer",
    access_code_masked: maskAccessCode(validatedData.accessCode),
    policy_read_and_understood: validatedPolicy.readPolicy.toString(),
    policy_questions_understood: validatedPolicy.understandQuestions.toString(),
    policy_behavior_acknowledged: validatedPolicy.acknowledgeBehavior.toString(),
    policy_admission_understood: validatedPolicy.understandAdmission.toString(),
    policy_reporting_understood: validatedPolicy.understandReporting.toString(),
    policy_investigation_understood: validatedPolicy.understandInvestigation.toString(),
    policy_signature_agreement: validatedPolicy.signatureAgreement.toString(),
  }

  // ── Persist to Stripe as customer record ──────────────────────
  try {
    const existingCustomers = await stripe.customers.list({
      email: validatedData.email,
      limit: 1,
    })

    if (existingCustomers.data.length > 0) {
      await stripe.customers.update(existingCustomers.data[0].id, {
        name: validatedData.name,
        metadata,
      })
    } else {
      await stripe.customers.create({
        name: validatedData.name,
        email: validatedData.email,
        metadata,
      })
    }

    return { success: true }
  } catch (error) {
    console.error("Failed to save access code registration:", error)
    return {
      success: false,
      error: "We had trouble saving your registration. Please try again in a moment.",
    }
  }
}
