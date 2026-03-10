export interface RegistrationData {
  name: string
  state: string
  email: string
  accommodations: string
  interpretationNeeded: boolean
  handicapAccessibility: boolean
  willingToServe: boolean
  homegroup: string
  isScholarship?: boolean
  scholarshipRecipientName?: string
  scholarshipRecipientEmail?: string
}

export interface PolicyAgreements {
  readPolicy: boolean
  understandQuestions: boolean
  acknowledgeBehavior: boolean
  understandAdmission: boolean
  understandReporting: boolean
  understandInvestigation: boolean
  signatureAgreement: boolean
}

export interface PurchaseAttribution {
  aaEntity?: string
  reservedForPerson?: string
}

export interface BreakfastAttendee {
  firstName: string
  lastName: string
  email: string
}
