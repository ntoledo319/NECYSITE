"use server"

import { createHash } from "node:crypto"
import { getPayload } from "payload"
import configPromise from "@payload-config"
import { stripe } from "@/lib/stripe"
import {
  BREAKFAST_PRODUCTS,
  REGISTRATION_PRODUCTS,
  calculateProcessingFee,
  formatUsdFromCents,
} from "@/lib/registration-products"
import { rateLimitCheckout, rateLimitCodeRedemption } from "@/lib/rate-limit"
import {
  registrationDataSchema,
  policyAgreementsSchema,
  purchaseAttributionSchema,
  productIdSchema,
  scholarshipQuantitySchema,
  scholarshipUnitAmountCentsSchema,
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
  scholarshipUnitAmountInCents?: number,
) {
  const validatedProductId = productIdSchema.parse(productId)
  const dataResult = registrationDataSchema.safeParse(registrationData)
  if (!dataResult.success) {
    throw new Error("Invalid registration data. Please check your information and try again.")
  }
  const validatedData = dataResult.data
  const validatedScholarshipQty = scholarshipQuantitySchema.parse(scholarshipQuantity)
  const validatedScholarshipUnitAmount = scholarshipUnitAmountCentsSchema.parse(scholarshipUnitAmountInCents)
  const validatedBreakfastIds = breakfastIdsSchema.parse(breakfastIds)
  const validatedAttribution = purchaseAttributionSchema.parse(attribution)
  const validatedPolicy = policyAgreements ? policyAgreementsSchema.parse(policyAgreements) : null

  const rl = rateLimitCheckout(validatedData.email)
  if (!rl.success) {
    throw new Error("Too many checkout attempts. Please wait a moment and try again.")
  }

  const product = REGISTRATION_PRODUCTS.find((p) => p.id === validatedProductId)
  if (!product) {
    throw new Error("Hmm, we couldn't find that registration option. Please go back and try selecting it again.")
  }

  if (!validatedData.isScholarship && !validatedPolicy) {
    throw new Error("We need you to review and accept the policy agreement before continuing. You can find it on the previous step.")
  }

  const selfRegistrationQuantity = validatedData.isScholarship ? 0 : 1
  const finalScholarshipQuantity =
    validatedData.isScholarship && validatedScholarshipQty === 0 ? 1 : validatedScholarshipQty
  const scholarshipUnitAmountInUse =
    finalScholarshipQuantity > 0 ? validatedScholarshipUnitAmount ?? product.priceInCents : product.priceInCents
  const scholarshipAmountSource =
    finalScholarshipQuantity === 0
      ? "not_applicable"
      : validatedScholarshipUnitAmount != null
        ? "custom"
        : "default_pre_registration"
  const selectedBreakfasts = validatedBreakfastIds
    .map((id) => BREAKFAST_PRODUCTS.find((bp) => bp.id === id))
    .filter((bp): bp is (typeof BREAKFAST_PRODUCTS)[number] => Boolean(bp))
  const breakfastTotalCents = selectedBreakfasts.reduce((sum, bp) => sum + bp.priceInCents, 0)
  const registrationSubtotalInCents =
    product.priceInCents * selfRegistrationQuantity + scholarshipUnitAmountInUse * finalScholarshipQuantity
  const subtotalInCents = registrationSubtotalInCents + breakfastTotalCents
  const processingFee = calculateProcessingFee(subtotalInCents)

  const metadata = {
    purchase_type:
      selfRegistrationQuantity > 0 && finalScholarshipQuantity > 0
        ? "self_plus_scholarship"
        : validatedData.isScholarship
          ? "scholarship"
          : "self",
    self_registration_quantity: selfRegistrationQuantity.toString(),
    scholarship_quantity: finalScholarshipQuantity.toString(),
    scholarship_unit_amount_cents: finalScholarshipQuantity > 0 ? scholarshipUnitAmountInUse.toString() : "not_applicable",
    scholarship_unit_amount_display: finalScholarshipQuantity > 0 ? formatUsdFromCents(scholarshipUnitAmountInUse) : "not_applicable",
    scholarship_total_cents: finalScholarshipQuantity > 0 ? (scholarshipUnitAmountInUse * finalScholarshipQuantity).toString() : "0",
    scholarship_default_price_cents: product.priceInCents.toString(),
    scholarship_amount_source: scholarshipAmountSource,
    attendee_name: validatedData.name || "Not provided",
    attendee_state: validatedData.state || "Not provided",
    attendee_email: validatedData.email || "Not provided",
    scholarship_recipient_name: validatedData.scholarshipRecipientName || "None",
    scholarship_recipient_email: validatedData.scholarshipRecipientEmail || "None",
    breakfast_tickets: selectedBreakfasts.map((bp) => bp.name).join(", ") || "None",
    breakfast_count: selectedBreakfasts.length.toString(),
    breakfast_price_version: "2026-03-26-$25",
    breakfast_ticket_price_cents: "2500",
    attribution_aa_entity: validatedAttribution?.aaEntity || "None",
    attribution_reserved_for_person: validatedAttribution?.reservedForPerson || "None",
    accommodations: validatedData.isScholarship ? "Not provided (scholarship purchase)" : validatedData.accommodations || "None",
    interpretation_needed: validatedData.isScholarship ? "not_applicable" : validatedData.interpretationNeeded.toString(),
    mobility_accessibility: validatedData.isScholarship ? "not_applicable" : validatedData.mobilityAccessibility.toString(),
    willing_to_serve: validatedData.isScholarship ? "not_applicable" : validatedData.willingToServe.toString(),
    homegroup_committee: validatedData.homegroup,
    policy_read_and_understood: validatedPolicy ? validatedPolicy.readPolicy.toString() : "not_applicable",
    policy_questions_understood: validatedPolicy ? validatedPolicy.understandQuestions.toString() : "not_applicable",
    policy_behavior_acknowledged: validatedPolicy ? validatedPolicy.acknowledgeBehavior.toString() : "not_applicable",
    policy_admission_understood: validatedPolicy ? validatedPolicy.understandAdmission.toString() : "not_applicable",
    policy_reporting_understood: validatedPolicy ? validatedPolicy.understandReporting.toString() : "not_applicable",
    policy_investigation_understood: validatedPolicy ? validatedPolicy.understandInvestigation.toString() : "not_applicable",
    policy_signature_agreement: validatedPolicy ? validatedPolicy.signatureAgreement.toString() : "not_applicable",
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.necypaact.com"
  const successUrl = `${baseUrl}/register/success?session_id={CHECKOUT_SESSION_ID}`

  try {
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      return_url: successUrl,
      customer_email: validatedData.email || undefined,
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
                    description:
                      scholarshipAmountSource === "custom"
                        ? "Sponsored NECYPAA XXXVI registration (custom amount)"
                        : "Sponsored NECYPAA XXXVI registration",
                  },
                  unit_amount: scholarshipUnitAmountInUse,
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
      metadata,
      payment_intent_data: { metadata },
    })

    if (!session.client_secret) {
      throw new Error("We had trouble connecting to our payment system. Please try again in a moment.")
    }

    const payload = await getPayload({ config: configPromise })
    const recordType = selfRegistrationQuantity > 0 && finalScholarshipQuantity > 0
      ? "self_plus_scholarship"
      : validatedData.isScholarship
        ? "scholarship"
        : "self"

    await payload.create({
      collection: "registrations",
      data: {
        email: validatedData.email || "",
        name: validatedData.name || "Not provided",
        state: validatedData.state || "",
        status: "pending",
        type: recordType,
        stripeSessionId: session.id,
        amountTotalCents: subtotalInCents + processingFee,
        metadata: metadata,
        accommodations: validatedData.accommodations || "",
        interpretationNeeded: validatedData.interpretationNeeded || false,
        mobilityAccessibility: validatedData.mobilityAccessibility || false,
        willingToServe: validatedData.willingToServe || false,
        homegroup: validatedData.homegroup || "",
      },
    })

    return session.client_secret
  } catch (error) {
    console.error("Stripe session creation failed:", error)
    throw new Error("Payment session could not be created. Please try again.")
  }
}

export async function submitAccessCodeRegistration(
  registrationData: RegistrationData,
  policyAgreements: PolicyAgreements,
): Promise<{ success: true } | { success: false; error: string }> {
  const dataResult = registrationDataSchema.safeParse(registrationData)
  if (!dataResult.success) {
    return { success: false, error: "Invalid registration data. Please check your information and try again." }
  }
  const validatedData = dataResult.data
  const validatedPolicy = policyAgreementsSchema.parse(policyAgreements)

  if (!validatedData.accessCode) {
    return { success: false, error: "A registration access code is required." }
  }

  const rl = rateLimitCodeRedemption(validatedData.email)
  if (!rl.success) {
    return { success: false, error: "Too many attempts. Please wait a moment and try again." }
  }

  const idempotencyKey = createHash("sha256")
    .update(`${validatedData.email.toLowerCase()}-${validatedData.accessCode}`)
    .digest("hex")
    .slice(0, 36)

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
