"use server"

import { stripe } from "@/lib/stripe"
import { rateLimitFreeRegistration } from "@/lib/rate-limit"
import { registrationDataSchema, policyAgreementsSchema } from "@/lib/validation"
import type { RegistrationData, PolicyAgreements } from "@/lib/types"

export async function submitFreeRegistration(
  registrationData: RegistrationData,
  policyAgreements: PolicyAgreements,
) {
  // ── Validate inputs ────────────────────────────────────────────
  const validatedData = registrationDataSchema.parse(registrationData)
  const _validatedPolicy = policyAgreementsSchema.parse(policyAgreements)

  // ── Rate limit by email ────────────────────────────────────────
  const rl = rateLimitFreeRegistration(validatedData.email)
  if (!rl.success) {
    throw new Error("Too many registration attempts. Please wait a moment and try again.")
  }

  const metadata: Record<string, string> = {
    registration_type: "free",
    attendee_name: registrationData.name,
    attendee_state: registrationData.state,
    attendee_email: registrationData.email,
    accommodations: registrationData.accommodations || "None",
    interpretation_needed: registrationData.interpretationNeeded.toString(),
    mobility_accessibility: registrationData.mobilityAccessibility.toString(),
    willing_to_serve: registrationData.willingToServe.toString(),
    homegroup_committee: registrationData.homegroup,
    policy_read_and_understood: policyAgreements.readPolicy.toString(),
    policy_questions_understood: policyAgreements.understandQuestions.toString(),
    policy_behavior_acknowledged: policyAgreements.acknowledgeBehavior.toString(),
    policy_admission_understood: policyAgreements.understandAdmission.toString(),
    policy_reporting_understood: policyAgreements.understandReporting.toString(),
    policy_investigation_understood: policyAgreements.understandInvestigation.toString(),
    policy_signature_agreement: policyAgreements.signatureAgreement.toString(),
  }

  try {
    // Search for existing customer by email
    const existingCustomers = await stripe.customers.list({
      email: registrationData.email,
      limit: 1,
    })

    let customer

    if (existingCustomers.data.length > 0) {
      // Update existing customer with latest info
      customer = await stripe.customers.update(existingCustomers.data[0].id, {
        name: registrationData.name,
        metadata,
      })
    } else {
      // Create new Stripe customer with all registration data as metadata
      customer = await stripe.customers.create({
        name: registrationData.name,
        email: registrationData.email,
        metadata,
      })
    }

    return { success: true, customerId: customer.id }
  } catch (error) {
    console.error("Failed to save registration:", error)
    throw new Error("We had trouble saving your registration. Please try again in a moment — and if it keeps happening, reach out to us at info@necypaa.org.")
  }
}
