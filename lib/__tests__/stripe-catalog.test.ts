import { describe, it, expect, beforeEach, vi, afterEach } from "vitest"

const productsSearchMock = vi.fn()

vi.mock("@/lib/stripe", () => ({
  stripe: {
    products: { search: productsSearchMock },
  },
}))

describe("lib/stripe-catalog", () => {
  let originalSecret: string | undefined
  let originalProductEnv: string | undefined
  let originalProductTestEnv: string | undefined

  beforeEach(async () => {
    originalSecret = process.env.STRIPE_SECRET_KEY
    originalProductEnv = process.env.STRIPE_PRODUCT_REGISTRATION
    originalProductTestEnv = process.env.STRIPE_PRODUCT_REGISTRATION_TEST
    productsSearchMock.mockReset()
    const mod = await import("../stripe-catalog")
    mod._resetCatalogCacheForTests()
  })

  afterEach(() => {
    if (originalSecret === undefined) delete process.env.STRIPE_SECRET_KEY
    else process.env.STRIPE_SECRET_KEY = originalSecret
    if (originalProductEnv === undefined) delete process.env.STRIPE_PRODUCT_REGISTRATION
    else process.env.STRIPE_PRODUCT_REGISTRATION = originalProductEnv
    if (originalProductTestEnv === undefined) delete process.env.STRIPE_PRODUCT_REGISTRATION_TEST
    else process.env.STRIPE_PRODUCT_REGISTRATION_TEST = originalProductTestEnv
  })

  it("prefers the test-mode env var when STRIPE_SECRET_KEY is a test key", async () => {
    process.env.STRIPE_SECRET_KEY = "sk_test_abc"
    process.env.STRIPE_PRODUCT_REGISTRATION_TEST = "prod_test_reg"
    process.env.STRIPE_PRODUCT_REGISTRATION = "prod_live_reg"
    const { resolveProductId } = await import("../stripe-catalog")
    expect(await resolveProductId("necypaa-xxxvi-registration")).toBe("prod_test_reg")
    expect(productsSearchMock).not.toHaveBeenCalled()
  })

  it("prefers the live env var when STRIPE_SECRET_KEY is a live key", async () => {
    process.env.STRIPE_SECRET_KEY = "sk_live_abc"
    process.env.STRIPE_PRODUCT_REGISTRATION = "prod_live_reg"
    process.env.STRIPE_PRODUCT_REGISTRATION_TEST = "prod_test_reg"
    const { resolveProductId } = await import("../stripe-catalog")
    expect(await resolveProductId("necypaa-xxxvi-registration")).toBe("prod_live_reg")
    expect(productsSearchMock).not.toHaveBeenCalled()
  })

  it("falls through to Stripe products.search when no env var is set", async () => {
    process.env.STRIPE_SECRET_KEY = "sk_test_abc"
    delete process.env.STRIPE_PRODUCT_REGISTRATION_TEST
    delete process.env.STRIPE_PRODUCT_REGISTRATION
    productsSearchMock.mockResolvedValueOnce({ data: [{ id: "prod_searched" }] })
    const { resolveProductId } = await import("../stripe-catalog")
    expect(await resolveProductId("necypaa-xxxvi-registration")).toBe("prod_searched")
    expect(productsSearchMock).toHaveBeenCalledOnce()
  })

  it("caches resolved Product IDs across calls", async () => {
    process.env.STRIPE_SECRET_KEY = "sk_test_abc"
    delete process.env.STRIPE_PRODUCT_REGISTRATION_TEST
    delete process.env.STRIPE_PRODUCT_REGISTRATION
    productsSearchMock.mockResolvedValueOnce({ data: [{ id: "prod_cached" }] })
    const { resolveProductId } = await import("../stripe-catalog")
    await resolveProductId("necypaa-xxxvi-registration")
    await resolveProductId("necypaa-xxxvi-registration")
    expect(productsSearchMock).toHaveBeenCalledOnce()
  })

  it("returns null and lets the caller fall back when search yields nothing", async () => {
    process.env.STRIPE_SECRET_KEY = "sk_test_abc"
    delete process.env.STRIPE_PRODUCT_REGISTRATION_TEST
    delete process.env.STRIPE_PRODUCT_REGISTRATION
    productsSearchMock.mockResolvedValueOnce({ data: [] })
    const { resolveProductId } = await import("../stripe-catalog")
    expect(await resolveProductId("necypaa-xxxvi-registration")).toBeNull()
  })
})

describe("lib/stripe-catalog priceDataForCatalogItem", () => {
  beforeEach(async () => {
    productsSearchMock.mockReset()
    const mod = await import("../stripe-catalog")
    mod._resetCatalogCacheForTests()
  })

  it("uses product reference when a Product can be resolved", async () => {
    process.env.STRIPE_SECRET_KEY = "sk_test_abc"
    process.env.STRIPE_PRODUCT_REGISTRATION_TEST = "prod_test_reg"
    const { priceDataForCatalogItem } = await import("../stripe-catalog")
    const result = await priceDataForCatalogItem({
      key: "necypaa-xxxvi-registration",
      unitAmountCents: 4000,
      fallbackName: "Reg",
      fallbackDescription: "desc",
    })
    expect(result.price_data.product).toBe("prod_test_reg")
    expect(result.price_data.product_data).toBeUndefined()
    expect(result.price_data.unit_amount).toBe(4000)
  })

  it("falls back to inline product_data when no Product is resolvable", async () => {
    process.env.STRIPE_SECRET_KEY = "sk_test_abc"
    delete process.env.STRIPE_PRODUCT_REGISTRATION_TEST
    productsSearchMock.mockResolvedValueOnce({ data: [] })
    const { priceDataForCatalogItem } = await import("../stripe-catalog")
    const result = await priceDataForCatalogItem({
      key: "necypaa-xxxvi-registration",
      unitAmountCents: 4000,
      fallbackName: "Reg",
      fallbackDescription: "desc",
    })
    expect(result.price_data.product).toBeUndefined()
    expect(result.price_data.product_data?.name).toBe("Reg")
    expect(result.price_data.unit_amount).toBe(4000)
  })
})
