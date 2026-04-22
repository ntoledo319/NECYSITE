import { describe, it, expect } from "vitest"
import {
  registrationDataSchema,
  policyAgreementsSchema,
  breakfastAttendeeSchema,
  breakfastIdsSchema,
  productIdSchema,
  scholarshipQuantitySchema,
  scholarshipUnitAmountCentsSchema,
} from "../validation"

describe("registrationDataSchema", () => {
  const validData = {
    name: "Test Person",
    state: "CT",
    email: "test@example.com",
    accommodations: "",
    interpretationNeeded: false,
    mobilityAccessibility: false,
    willingToServe: true,
    homegroup: "My Homegroup",
    isScholarship: false,
    scholarshipRecipientName: "",
    scholarshipRecipientEmail: "",
  }

  it("accepts valid registration data", () => {
    const result = registrationDataSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it("rejects missing name", () => {
    const result = registrationDataSchema.safeParse({ ...validData, name: "" })
    expect(result.success).toBe(false)
  })

  it("rejects invalid email", () => {
    const result = registrationDataSchema.safeParse({ ...validData, email: "not-an-email" })
    expect(result.success).toBe(false)
  })

  it("strips HTML tags from string fields", () => {
    const result = registrationDataSchema.safeParse({
      ...validData,
      name: '<script>alert("xss")</script>Test',
      accommodations: "<b>wheelchair</b> access",
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.name).toBe('alert("xss")Test')
      expect(result.data.accommodations).toBe("wheelchair access")
    }
  })

  it("rejects excessively long name", () => {
    const result = registrationDataSchema.safeParse({
      ...validData,
      name: "A".repeat(300),
    })
    expect(result.success).toBe(false)
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
    const result = policyAgreementsSchema.safeParse(allTrue)
    expect(result.success).toBe(true)
  })

  it("rejects if any policy is false", () => {
    const result = policyAgreementsSchema.safeParse({ ...allTrue, readPolicy: false })
    expect(result.success).toBe(false)
  })
})

describe("breakfastAttendeeSchema", () => {
  it("accepts valid attendee", () => {
    const result = breakfastAttendeeSchema.safeParse({
      firstName: "Jane",
      lastName: "D",
      email: "jane@example.com",
    })
    expect(result.success).toBe(true)
  })

  it("rejects empty first name", () => {
    const result = breakfastAttendeeSchema.safeParse({
      firstName: "",
      lastName: "D",
      email: "jane@example.com",
    })
    expect(result.success).toBe(false)
  })
})

describe("breakfastIdsSchema", () => {
  it("accepts valid IDs array", () => {
    const result = breakfastIdsSchema.safeParse(["breakfast-friday", "breakfast-saturday"])
    expect(result.success).toBe(true)
  })

  it("rejects too many IDs", () => {
    const ids = Array.from({ length: 25 }, (_, i) => `id-${i}`)
    const result = breakfastIdsSchema.safeParse(ids)
    expect(result.success).toBe(false)
  })
})

describe("productIdSchema", () => {
  it("accepts valid product ID", () => {
    expect(productIdSchema.safeParse("necypaa-xxxvi-registration").success).toBe(true)
  })

  it("rejects empty string", () => {
    expect(productIdSchema.safeParse("").success).toBe(false)
  })
})

describe("scholarshipQuantitySchema", () => {
  it("defaults to 0", () => {
    const result = scholarshipQuantitySchema.parse(undefined)
    expect(result).toBe(0)
  })

  it("rejects negative numbers", () => {
    expect(scholarshipQuantitySchema.safeParse(-1).success).toBe(false)
  })

  it("rejects non-integers", () => {
    expect(scholarshipQuantitySchema.safeParse(1.5).success).toBe(false)
  })
})

describe("scholarshipUnitAmountCentsSchema", () => {
  it("accepts valid cent amounts", () => {
    expect(scholarshipUnitAmountCentsSchema.safeParse(4000).success).toBe(true)
  })

  it("accepts undefined for default pricing", () => {
    expect(scholarshipUnitAmountCentsSchema.safeParse(undefined).success).toBe(true)
  })

  it("rejects values below one dollar", () => {
    expect(scholarshipUnitAmountCentsSchema.safeParse(99).success).toBe(false)
  })
})
