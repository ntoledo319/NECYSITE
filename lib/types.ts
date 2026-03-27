/** Attendee-submitted registration form data (before Zod validation). */
export interface RegistrationData {
  name: string
  state: string
  email: string
  accommodations: string
  interpretationNeeded: boolean
  mobilityAccessibility: boolean
  willingToServe: boolean
  homegroup: string
  isScholarship?: boolean
  scholarshipRecipientName?: string
  scholarshipRecipientEmail?: string
  accessCode?: string
  /** Purchaser name for scholarship-only purchases */
  purchaserName?: string
  /** Purchaser email for scholarship-only purchases (used for Stripe receipt) */
  purchaserEmail?: string
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
