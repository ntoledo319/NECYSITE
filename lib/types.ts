/**
 * Registration intents are mutually exclusive. The buyer picks exactly one
 * at the start of the form; the rest of the flow is shaped by which one.
 *
 *  - `self`            buyer is the attendee, no sponsorship
 *  - `self_plus_gift`  buyer is an attendee AND sponsors N others
 *  - `gift_only`       buyer sponsors N others, does NOT attend
 *  - `donate`          General Fund donation, buyer does NOT attend
 *
 * Policy agreement: collected ONLY when the buyer is an attendee
 * (`self`, `self_plus_gift`). Recipients of gift codes sign their own
 * policy at claim time. Donors never sign — they aren't attending.
 */
export type RegistrationIntent = "self" | "self_plus_gift" | "gift_only" | "donate"

/** A single sponsored gift on the way to becoming a `gift-code` row. */
export interface GiftRecipient {
  name: string
  /** Optional. If present, the system emails the claim link directly. */
  email: string
  /** Optional short note from the sponsor, shown on the claim page and in the email. */
  message: string
}

/** Attendee-submitted form data for the paid-checkout flows. */
export interface RegistrationData {
  intent: RegistrationIntent

  // Always collected — used as the purchaser of record and (for self /
  // self_plus_gift) the attendee.
  name: string
  email: string

  // Required when the buyer is an attendee. Empty strings for gift_only /
  // donate flows.
  state: string
  homegroup: string
  accommodations: string
  interpretationNeeded: boolean
  mobilityAccessibility: boolean
  willingToServe: boolean

  // Populated only when intent ∈ { self_plus_gift, gift_only }. Each entry
  // becomes one row in `gift-codes` after payment.
  giftRecipients: GiftRecipient[]

  // Populated only when intent === "donate". Cents; defaults to the
  // current registration price, donor may override down to the $10 floor.
  donationAmountCents: number

  // Staff-issued code path. Mutually exclusive with gift / donate intents
  // at the UI level. Left in `RegistrationData` so the server can still
  // route to the access-code action when present.
  accessCode: string
}

/** Seven required behavior-policy acknowledgements collected during registration. */
export interface PolicyAgreements {
  readPolicy: boolean
  understandQuestions: boolean
  acknowledgeBehavior: boolean
  understandAdmission: boolean
  understandReporting: boolean
  understandInvestigation: boolean
  signatureAgreement: boolean
}

/** Optional attribution fields for tracking which AA entity or person a purchase is tied to. */
export interface PurchaseAttribution {
  aaEntity?: string
  reservedForPerson?: string
}

/** Attendee info collected for standalone breakfast ticket purchases. */
export interface BreakfastAttendee {
  firstName: string
  lastName: string
  email: string
}
