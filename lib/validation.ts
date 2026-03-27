/**
 * Zod validation schemas for all server action inputs.
 *
 * Every form submission passes through these schemas before
 * hitting Stripe or any other external service. This is the
 * single source of truth for input validation and sanitization.
 */

import { z } from "zod"

/** Strip HTML tags and trim whitespace */
function sanitize(val: string): string {
  return val.replace(/<[^>]*>/g, "").trim()
}

const sanitizedString = (maxLength = 500) =>
  z.string().max(maxLength).transform(sanitize)

// ─── Registration ─────────────────────────────────────────────

// Base schema for registration data - allows empty fields for scholarship-only purchases
const baseRegistrationDataSchema = z.object({
  name: sanitizedString(200).default(""),
  state: sanitizedString(100).default(""),
  email: z.string().max(320).trim().toLowerCase().default(""),
  accommodations: sanitizedString(1000).default(""),
  interpretationNeeded: z.boolean(),
  mobilityAccessibility: z.boolean(),
  willingToServe: z.boolean(),
  homegroup: sanitizedString(300).default(""),
  isScholarship: z.boolean(),
  scholarshipRecipientName: sanitizedString(200).default(""),
  scholarshipRecipientEmail: z.string().max(320).default("").refine(
    (val) => val === "" || z.string().email().safeParse(val).success,
    "Must be a valid email or empty",
  ),
  accessCode: z.string().max(50).trim().default(""),
  // Purchaser info for scholarship-only purchases
  purchaserName: sanitizedString(200).default(""),
  purchaserEmail: z.string().max(320).trim().toLowerCase().default(""),
})

// Full validation with refinement based on isScholarship flag
export const registrationDataSchema = baseRegistrationDataSchema.superRefine((data, ctx) => {
  // For scholarship-only purchases (isScholarship: true with empty attendee fields),
  // we don't require name/email/state because those belong to the recipient, not the purchaser
  const isScholarshipOnlyPurchase = data.isScholarship && !data.name && !data.email

  if (!isScholarshipOnlyPurchase) {
    // Standard registration or self+scholarship - require attendee fields
    if (!data.name) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Name is required", path: ["name"] })
    }
    if (!data.state) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "State is required", path: ["state"] })
    }
    if (!data.email || !z.string().email().safeParse(data.email).success) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Valid email is required", path: ["email"] })
    }
  }
})

export type ValidatedRegistrationData = z.infer<typeof registrationDataSchema>

// ─── Policy Agreements ────────────────────────────────────────

export const policyAgreementsSchema = z.object({
  readPolicy: z.literal(true, { errorMap: () => ({ message: "Must agree to policy" }) }),
  understandQuestions: z.literal(true),
  acknowledgeBehavior: z.literal(true),
  understandAdmission: z.literal(true),
  understandReporting: z.literal(true),
  understandInvestigation: z.literal(true),
  signatureAgreement: z.literal(true),
})

export type ValidatedPolicyAgreements = z.infer<typeof policyAgreementsSchema>

// ─── Purchase Attribution ─────────────────────────────────────

export const purchaseAttributionSchema = z.object({
  aaEntity: sanitizedString(200).optional(),
  reservedForPerson: sanitizedString(200).optional(),
}).optional()

// ─── Breakfast Attendee ───────────────────────────────────────

export const breakfastAttendeeSchema = z.object({
  firstName: sanitizedString(100).pipe(z.string().min(1, "First name is required")),
  lastName: sanitizedString(100).pipe(z.string().min(1, "Last name is required")),
  email: z.string().email("Valid email is required").max(320).trim().toLowerCase(),
})

export type ValidatedBreakfastAttendee = z.infer<typeof breakfastAttendeeSchema>

// ─── Breakfast IDs ────────────────────────────────────────────

export const breakfastIdsSchema = z.array(z.string().max(50)).max(20)

// ─── Product ID ───────────────────────────────────────────────

export const productIdSchema = z.string().max(50).min(1, "Product ID is required")

// ─── Scholarship Quantity ─────────────────────────────────────

export const scholarshipQuantitySchema = z.number().int().min(0).max(50).default(0)
