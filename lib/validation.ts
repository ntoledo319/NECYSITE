import { z } from "zod"

/** Strip HTML tags and trim whitespace */
function sanitize(val: string): string {
  return val.replace(/<[^>]*>/g, "").trim()
}

const sanitizedString = (maxLength = 500) => z.string().max(maxLength).transform(sanitize)

export const intentSchema = z.enum(["self", "self_plus_gift", "gift_only", "group", "donate"])

export const giftRecipientSchema = z.object({
  name: sanitizedString(200).pipe(z.string().min(1, "Recipient name is required")),
  // Optional — empty string is allowed. If provided, must be a valid email.
  email: z
    .string()
    .max(320)
    .default("")
    .transform((v) => v.trim().toLowerCase())
    .refine((val) => val === "" || z.string().email().safeParse(val).success, "Recipient email must be valid or empty"),
  // Optional short message shown to the recipient on the claim page and in
  // the notification email. Capped to keep the email readable.
  message: sanitizedString(500).default(""),
})

export type ValidatedGiftRecipient = z.infer<typeof giftRecipientSchema>

const baseRegistrationFields = {
  name: sanitizedString(200).pipe(z.string().min(1, "Name is required")),
  email: z.string().email("Valid email is required").max(320).trim().toLowerCase(),
  state: sanitizedString(100).default(""),
  homegroup: sanitizedString(300).default(""),
  accommodations: sanitizedString(1000).default(""),
  interpretationNeeded: z.boolean(),
  mobilityAccessibility: z.boolean(),
  willingToServe: z.boolean(),
  giftRecipients: z.array(giftRecipientSchema).max(20).default([]),
  donationAmountCents: z.number().int().min(0).max(10_000_000).default(0),
  groupName: sanitizedString(200).default(""),
  groupQuantity: z.number().int().min(0).max(100).default(0),
  accessCode: z.string().max(50).trim().default(""),
}

/**
 * Discriminated validator: each intent enforces its own rules.
 *  - self / self_plus_gift: attendee fields (state + homegroup) required.
 *  - gift_only: at least one recipient, attendee fields blank.
 *  - donate: amount >= $10, no recipients, no attendee fields.
 */
export const registrationDataSchema = z
  .object({ intent: intentSchema, ...baseRegistrationFields })
  .superRefine((data, ctx) => {
    if (data.intent === "self" || data.intent === "self_plus_gift") {
      if (!data.state.trim()) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["state"], message: "State / region is required" })
      }
      if (!data.homegroup.trim()) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["homegroup"], message: "Homegroup is required" })
      }
    }
    if (data.intent === "self_plus_gift" || data.intent === "gift_only") {
      if (data.giftRecipients.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["giftRecipients"],
          message: "Add at least one recipient name",
        })
      }
    } else if (data.giftRecipients.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["giftRecipients"],
        message: "Recipients are not allowed for this intent",
      })
    }
    if (data.intent === "donate" && data.donationAmountCents < 1_000) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["donationAmountCents"],
        message: "Donation must be at least $10",
      })
    }
    if (data.intent === "group") {
      if (!data.groupName.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["groupName"],
          message: "Organization name is required",
        })
      }
      if (data.groupQuantity < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["groupQuantity"],
          message: "Buy 2 or more seats for a group purchase",
        })
      }
      if (data.groupQuantity > 100) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["groupQuantity"],
          message: "For more than 100 seats, email us to arrange a custom invoice",
        })
      }
    }
    // Note: we don't reject when fields from one intent are present under
    // another (e.g., a leftover donationAmountCents under a self
    // registration). The server only USES the relevant fields for each
    // intent; form drafts and intent-switches can leave stale values, and
    // refusing the submit creates UX bugs without protecting anything.
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

export const purchaseAttributionSchema = z
  .object({
    aaEntity: sanitizedString(200).optional(),
    reservedForPerson: sanitizedString(2000).optional(),
  })
  .nullable()
  .optional()

export const breakfastAttendeeSchema = z.object({
  firstName: sanitizedString(100).pipe(z.string().min(1, "First name is required")),
  lastName: sanitizedString(100).pipe(z.string().min(1, "Last name is required")),
  email: z.string().email("Valid email is required").max(320).trim().toLowerCase(),
})

export type ValidatedBreakfastAttendee = z.infer<typeof breakfastAttendeeSchema>

export const breakfastIdsSchema = z
  .array(z.string().max(50))
  .max(20)
  .transform((arr) => [...new Set(arr)])

export const productIdSchema = z.string().max(50).min(1, "Product ID is required")

/** Schema for the claim-page form filled out by a gift recipient. */
export const claimFormSchema = z.object({
  name: sanitizedString(200).pipe(z.string().min(1, "Name is required")),
  email: z.string().email("Valid email is required").max(320).trim().toLowerCase(),
  state: sanitizedString(100).pipe(z.string().min(1, "State is required")),
  homegroup: sanitizedString(300).pipe(z.string().min(1, "Homegroup is required")),
  accommodations: sanitizedString(1000).default(""),
  interpretationNeeded: z.boolean(),
  mobilityAccessibility: z.boolean(),
  willingToServe: z.boolean(),
})

export type ValidatedClaimForm = z.infer<typeof claimFormSchema>
