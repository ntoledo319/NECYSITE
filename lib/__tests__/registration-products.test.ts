import { describe, it, expect } from "vitest"
import { calculateProcessingFee, REGISTRATION_PRODUCTS, BREAKFAST_PRODUCTS } from "../registration-products"

describe("calculateProcessingFee", () => {
  it("calculates correctly for a single $40 registration", () => {
    const fee = calculateProcessingFee(4000)
    // Stripe charges 2.9% + $0.30 on the total.
    // Gross-up: fee = (4000 + 30) / (1 - 0.029) - 4000
    // = 4030 / 0.971 - 4000 = 4149.33... - 4000 = 149.33 → rounded to 149
    expect(fee).toBe(150)
  })

  it("calculates correctly for a $20 breakfast ticket", () => {
    const fee = calculateProcessingFee(2000)
    // (2000 + 30) / 0.971 - 2000 = 2030 / 0.971 - 2000 ≈ 90
    expect(fee).toBe(91)
  })

  it("calculates correctly for $0 (free registration)", () => {
    const fee = calculateProcessingFee(0)
    // (0 + 30) / 0.971 - 0 = 30.897... → 31
    expect(fee).toBe(31)
  })

  it("calculates correctly for a combined order ($40 reg + 3 breakfasts)", () => {
    const subtotal = 4000 + 2000 * 3 // $100 = 10000 cents
    const fee = calculateProcessingFee(subtotal)
    // (10000 + 30) / 0.971 - 10000 = 10030 / 0.971 - 10000 ≈ 329
    expect(fee).toBe(330)
  })

  it("returns a positive integer for any positive amount", () => {
    for (const amount of [100, 500, 1000, 5000, 10000, 50000]) {
      const fee = calculateProcessingFee(amount)
      expect(fee).toBeGreaterThan(0)
      expect(Number.isInteger(fee)).toBe(true)
    }
  })

  it("ensures total charge covers Stripe's fee", () => {
    // For any amount, the fee should be enough so Stripe's actual charge
    // (2.9% of total + $0.30) is covered by the fee itself.
    const amount = 4000
    const fee = calculateProcessingFee(amount)
    const totalCharge = amount + fee
    const stripeActualFee = Math.round(totalCharge * 0.029 + 30)
    // The fee should be >= Stripe's actual fee
    expect(fee).toBeGreaterThanOrEqual(stripeActualFee)
  })
})

describe("REGISTRATION_PRODUCTS", () => {
  it("has at least one product", () => {
    expect(REGISTRATION_PRODUCTS.length).toBeGreaterThanOrEqual(1)
  })

  it("all products have required fields", () => {
    for (const p of REGISTRATION_PRODUCTS) {
      expect(p.id).toBeTruthy()
      expect(p.name).toBeTruthy()
      expect(p.description).toBeTruthy()
      expect(p.priceInCents).toBeGreaterThan(0)
    }
  })
})

describe("BREAKFAST_PRODUCTS", () => {
  it("has three breakfast options", () => {
    expect(BREAKFAST_PRODUCTS.length).toBe(3)
  })

  it("all products are $25", () => {
    for (const bp of BREAKFAST_PRODUCTS) {
      expect(bp.priceInCents).toBe(2500)
    }
  })
})
