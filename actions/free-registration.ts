"use server"

import { stripe } from "@/lib/stripe"
import { rateLimitFreeRegistration } from "@/lib/rate-limit"
import { registrationDataSchema, policyAgreementsSchema } from "@/lib/validation"
import type { RegistrationData, PolicyAgreements } from "@/lib/types"

export async function submitFreeRegistration(
  registrationData: RegistrationData,
  policyAgreements: PolicyAgreements,
) {
  const dataResult = registrationDataSchema.safeParse(registrationData)
  if (!dataResult.success) {
    throw new Error("Invalid registration data. Please check your information and try again.")
  }
  const validatedData = dataResult.data
  const validatedPolicy = policyAgreementsSchema.parse(policyAgreements)

  const rl = rateLimitFreeRegistration(validatedData.email)
  if (!rl.success) {
    throw new Error("Too many registration attempts. Please wait a moment and try again.")
  }

  const metadata: Record<string, string> = {
    registration_type: "free",
    attendee_name: validatedData.name,
    attendee_state: validatedData.state,
    attendee_email: validatedData.email,
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

    return { success: true }
  } catch (error) {
    console.error("Failed to save registration:", error)
    throw new Error("We had trouble saving your registration. Please try again in a moment — and if it keeps happening, reach out to us at info@necypaa.org.")
  }
}
