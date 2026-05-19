import { describe, it, expect } from "vitest"
import {
  registrationDataSchema,
  policyAgreementsSchema,
  breakfastAttendeeSchema,
  breakfastIdsSchema,
  productIdSchema,
  giftRecipientSchema,
  claimFormSchema,
} from "../validation"

describe("registrationDataSchema — self intent", () => {
  const validSelf = {
    intent: "self" as const,
    name: "Test Person",
    state: "CT",
    email: "test@example.com",
    accommodations: "",
    interpretationNeeded: false,
    mobilityAccessibility: false,
    willingToServe: true,
    homegroup: "My Homegroup",
    giftRecipients: [],
    donationAmountCents: 0,
    accessCode: "",
  }

  it("accepts a valid self registration", () => {
    expect(registrationDataSchema.safeParse(validSelf).success).toBe(true)
  })

  it("rejects missing state on self", () => {
    expect(registrationDataSchema.safeParse({ ...validSelf, state: "" }).success).toBe(false)
  })

  it("rejects missing homegroup on self", () => {
    expect(registrationDataSchema.safeParse({ ...validSelf, homegroup: "" }).success).toBe(false)
  })

  it("rejects invalid email", () => {
    expect(registrationDataSchema.safeParse({ ...validSelf, email: "not-an-email" }).success).toBe(false)
  })

  it("strips HTML tags from string fields", () => {
    const result = registrationDataSchema.safeParse({
      ...validSelf,
      name: '<script>alert("xss")</script>Test',
      accommodations: "<b>wheelchair</b> access",
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.name).toBe('alert("xss")Test')
      expect(result.data.accommodations).toBe("wheelchair access")
    }
  })
})

describe("registrationDataSchema — gift_only intent", () => {
  const base = {
    intent: "gift_only" as const,
    name: "Sponsor",
    email: "sponsor@example.com",
    state: "",
    homegroup: "",
    accommodations: "",
    interpretationNeeded: false,
    mobilityAccessibility: false,
    willingToServe: false,
    giftRecipients: [{ name: "Recipient One", email: "" }],
    donationAmountCents: 0,
    accessCode: "",
  }

  it("accepts with at least one recipient", () => {
    expect(registrationDataSchema.safeParse(base).success).toBe(true)
  })

  it("rejects when no recipients are listed", () => {
    expect(registrationDataSchema.safeParse({ ...base, giftRecipients: [] }).success).toBe(false)
  })

  it("rejects an invalid recipient email", () => {
    expect(
      registrationDataSchema.safeParse({
        ...base,
        giftRecipients: [{ name: "Bad", email: "not-an-email" }],
      }).success,
    ).toBe(false)
  })

  it("does NOT require state or homegroup for gift_only", () => {
    expect(registrationDataSchema.safeParse({ ...base, state: "", homegroup: "" }).success).toBe(true)
  })
})

describe("registrationDataSchema — donate intent", () => {
  const base = {
    intent: "donate" as const,
    name: "Donor",
    email: "donor@example.com",
    state: "",
    homegroup: "",
    accommodations: "",
    interpretationNeeded: false,
    mobilityAccessibility: false,
    willingToServe: false,
    giftRecipients: [],
    donationAmountCents: 4000,
    accessCode: "",
  }

  it("accepts a $40 donation", () => {
    expect(registrationDataSchema.safeParse(base).success).toBe(true)
  })

  it("rejects a donation below the $10 floor", () => {
    expect(registrationDataSchema.safeParse({ ...base, donationAmountCents: 999 }).success).toBe(false)
  })

  it("rejects recipients on a donation", () => {
    expect(
      registrationDataSchema.safeParse({
        ...base,
        giftRecipients: [{ name: "Should not be here", email: "" }],
      }).success,
    ).toBe(false)
  })
})

describe("policyAgreementsSchema", () => {
  const allTrue = {
    readPolicy: true,
    understandQuestions: true,
    acknowledgeBehavior: true,
    understandAdmission: true,
    understandReporting: true,
    understandInvestigation: true,
    signatureAgreement: true,
  }
  it("accepts all true", () => {
    expect(policyAgreementsSchema.safeParse(allTrue).success).toBe(true)
  })
  it("rejects if any is false", () => {
    expect(policyAgreementsSchema.safeParse({ ...allTrue, readPolicy: false }).success).toBe(false)
  })
})

describe("giftRecipientSchema", () => {
  it("accepts a recipient with no email", () => {
    expect(giftRecipientSchema.safeParse({ name: "Alex", email: "" }).success).toBe(true)
  })
  it("accepts a valid email", () => {
    expect(giftRecipientSchema.safeParse({ name: "Alex", email: "alex@example.com" }).success).toBe(true)
  })
  it("rejects an invalid email", () => {
    expect(giftRecipientSchema.safeParse({ name: "Alex", email: "not-an-email" }).success).toBe(false)
  })
})

describe("claimFormSchema", () => {
  it("requires state and homegroup", () => {
    const base = {
      name: "Recipient",
      email: "r@example.com",
      state: "CT",
      homegroup: "Local YPAA",
      accommodations: "",
      interpretationNeeded: false,
      mobilityAccessibility: false,
      willingToServe: false,
    }
    expect(claimFormSchema.safeParse(base).success).toBe(true)
    expect(claimFormSchema.safeParse({ ...base, state: "" }).success).toBe(false)
    expect(claimFormSchema.safeParse({ ...base, homegroup: "" }).success).toBe(false)
  })
})

describe("breakfastAttendeeSchema", () => {
  it("accepts valid attendee", () => {
    expect(
      breakfastAttendeeSchema.safeParse({ firstName: "Jane", lastName: "D", email: "jane@example.com" }).success,
    ).toBe(true)
  })
  it("rejects empty first name", () => {
    expect(
      breakfastAttendeeSchema.safeParse({ firstName: "", lastName: "D", email: "jane@example.com" }).success,
    ).toBe(false)
  })
})

describe("breakfastIdsSchema", () => {
  it("accepts a valid array", () => {
    expect(breakfastIdsSchema.safeParse(["breakfast-friday", "breakfast-saturday"]).success).toBe(true)
  })
  it("rejects too many IDs", () => {
    const ids = Array.from({ length: 25 }, (_, i) => `id-${i}`)
    expect(breakfastIdsSchema.safeParse(ids).success).toBe(false)
  })
})

describe("productIdSchema", () => {
  it("accepts a valid product ID", () => {
    expect(productIdSchema.safeParse("necypaa-xxxvi-registration").success).toBe(true)
  })
  it("rejects empty string", () => {
    expect(productIdSchema.safeParse("").success).toBe(false)
  })
})
