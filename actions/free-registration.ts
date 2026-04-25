"use server"

import { getPayload } from "payload"
import configPromise from "@payload-config"
import { stripe } from "@/lib/stripe"
import { REGISTRATION_PRODUCTS, formatUsdFromCents } from "@/lib/registration-products"
import { rateLimitFreeRegistration } from "@/lib/rate-limit"
import {
  registrationDataSchema,
  policyAgreementsSchema,
  scholarshipQuantitySchema,
  scholarshipUnitAmountCentsSchema,
} from "@/lib/validation"
import type { RegistrationData, PolicyAgreements } from "@/lib/types"

export async function submitFreeRegistration(
  registrationData: RegistrationData,
  policyAgreements: PolicyAgreements,
  scholarshipQuantity = 0,
  scholarshipUnitAmountInCents?: number,
) {
  const dataResult = registrationDataSchema.safeParse(registrationData)
  if (!dataResult.success) {
    throw new Error("Invalid registration data. Please check your information and try again.")
  }
  const validatedData = dataResult.data
  const validatedPolicy = policyAgreementsSchema.parse(policyAgreements)
  const validatedScholarshipQty = scholarshipQuantitySchema.parse(scholarshipQuantity)
  const validatedScholarshipUnitAmount = scholarshipUnitAmountCentsSchema.parse(scholarshipUnitAmountInCents)

  const rl = rateLimitFreeRegistration(validatedData.email)
  if (!rl.success) {
    throw new Error("Too many registration attempts. Please wait a moment and try again.")
  }

  const registrationProduct = REGISTRATION_PRODUCTS.find((product) => product.id === "necypaa-xxxvi-registration")
  const defaultScholarshipUnitAmount = registrationProduct?.priceInCents ?? 0
  const finalScholarshipQuantity =
    validatedData.isScholarship && validatedScholarshipQty === 0 ? 1 : validatedData.isScholarship ? validatedScholarshipQty : 0
  const scholarshipUnitAmountInUse =
    finalScholarshipQuantity > 0
      ? validatedScholarshipUnitAmount ?? defaultScholarshipUnitAmount
      : defaultScholarshipUnitAmount
  const scholarshipAmountSource =
    finalScholarshipQuantity === 0
      ? "not_applicable"
      : validatedScholarshipUnitAmount != null
        ? "custom"
        : "default_pre_registration"
  const scholarshipTotalCents = scholarshipUnitAmountInUse * finalScholarshipQuantity

  const metadata: Record<string, string> = {
    registration_type: validatedData.isScholarship ? "cash_scholarship" : "free",
    purchase_type: validatedData.isScholarship ? "cash_scholarship" : "cash_registration",
    attendee_name: validatedData.name,
    attendee_state: validatedData.state,
    attendee_email: validatedData.email,
    scholarship_recipient_name: validatedData.scholarshipRecipientName || "None",
    scholarship_recipient_email: validatedData.scholarshipRecipientEmail || "None",
    scholarship_quantity: finalScholarshipQuantity.toString(),
    scholarship_unit_amount_cents: finalScholarshipQuantity > 0 ? scholarshipUnitAmountInUse.toString() : "not_applicable",
    scholarship_unit_amount_display: finalScholarshipQuantity > 0 ? formatUsdFromCents(scholarshipUnitAmountInUse) : "not_applicable",
    scholarship_total_cents: scholarshipTotalCents.toString(),
    scholarship_default_price_cents: defaultScholarshipUnitAmount.toString(),
    scholarship_amount_source: scholarshipAmountSource,
    accommodations: validatedData.accommodations || "None",
    interpretation_needed: validatedData.interpretationNeeded.toString(),
    mobility_accessibility: validatedData.mobilityAccessibility.toString(),
    willing_to_serve: validatedData.willingToServe.toString(),
    homegroup_committee: validatedData.homegroup,
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

    const payload = await getPayload({ config: configPromise })
    await payload.create({
      collection: "registrations",
      data: {
        email: validatedData.email,
        name: validatedData.name,
        state: validatedData.state || "",
        status: "cash",
        type: validatedData.isScholarship ? "scholarship" : "self",
        metadata: metadata,
        accommodations: validatedData.accommodations || "",
        interpretationNeeded: validatedData.interpretationNeeded || false,
        mobilityAccessibility: validatedData.mobilityAccessibility || false,
        willingToServe: validatedData.willingToServe || false,
        homegroup: validatedData.homegroup || "",
        amountTotalCents: scholarshipTotalCents || 0,
      },
    })

    return { success: true }
  } catch (error) {
    console.error("Failed to save registration:", error)
    throw new Error("We had trouble saving your registration. Please try again in a moment — and if it keeps happening, reach out to us at info@necypaa.org.")
  }
}
