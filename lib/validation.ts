import { z } from "zod"

/** Strip HTML tags and trim whitespace */
function sanitize(val: string): string {
  return val.replace(/<[^>]*>/g, "").trim()
}

const sanitizedString = (maxLength = 500) =>
  z.string().max(maxLength).transform(sanitize)

export const registrationDataSchema = z.object({
  name: sanitizedString(200).pipe(z.string().min(1, "Name is required")),
  state: sanitizedString(100).pipe(z.string().min(1, "State is required")),
  email: z.string().email("Valid email is required").max(320).trim().toLowerCase(),
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
})

export type ValidatedRegistrationData = z.infer<typeof registrationDataSchema>

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

export const purchaseAttributionSchema = z.object({
  aaEntity: sanitizedString(200).optional(),
  reservedForPerson: sanitizedString(200).optional(),
}).optional()

export const breakfastAttendeeSchema = z.object({
  firstName: sanitizedString(100).pipe(z.string().min(1, "First name is required")),
  lastName: sanitizedString(100).pipe(z.string().min(1, "Last name is required")),
  email: z.string().email("Valid email is required").max(320).trim().toLowerCase(),
})

export type ValidatedBreakfastAttendee = z.infer<typeof breakfastAttendeeSchema>

export const breakfastIdsSchema = z.array(z.string().max(50)).max(20)

export const productIdSchema = z.string().max(50).min(1, "Product ID is required")

export const scholarshipQuantitySchema = z.number().int().min(0).max(50).default(0)

export const scholarshipUnitAmountCentsSchema = z.number().int().min(100).max(1_000_000).optional()
