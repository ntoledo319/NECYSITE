import { expect, test } from "@playwright/test"
import { REGISTRATION_PRODUCTS } from "../lib/registration-products"

const defaultScholarshipAmount = (
  (REGISTRATION_PRODUCTS.find((product) => product.id === "necypaa-xxxvi-registration")?.priceInCents ?? 0) / 100
).toFixed(2)

async function fillScholarshipRegistrationForm(page: import("@playwright/test").Page) {
  await page.getByRole("button", { name: /scholarship purchase/i }).click()
  await page.getByLabel(/Purchaser name/i).fill("Jordan Sponsor")
  await page.getByLabel(/^Email/i).fill("jordan@example.com")
  await page.getByLabel(/State \/ region/i).selectOption({ label: "Connecticut" })
  await page.getByLabel(/Homegroup \/ committee/i).fill("Hartford YPAA")
  await page.getByLabel(/Recipient name/i).fill("Casey Recipient")
  await page.getByLabel(/Recipient email/).fill("casey@example.com")
}

test("paid registration scholarship flow keeps default pricing synced and supports custom amount entry", async ({ page }) => {
  await page.goto("/register", { waitUntil: "networkidle" })

  await fillScholarshipRegistrationForm(page)
  await page.locator("form button[type='submit']").click()

  await expect(page.getByText("Scholarship Pricing")).toBeVisible()
  await expect(page.getByText("Synced to pre-registration")).toBeVisible()
  await expect(page.getByText(`$${defaultScholarshipAmount}`).first()).toBeVisible()

  await page.getByRole("button", { name: /use custom amount/i }).click()
  await page.getByLabel("Custom amount per scholarship").fill("55.50")
  await page.getByLabel("Custom amount per scholarship").blur()

  await expect(page.getByText(/^Custom amount$/)).toBeVisible()
  await expect(page.getByText("Current scholarship total")).toBeVisible()
  await expect(page.getByText("$55.50").first()).toBeVisible()

  await page.getByRole("button", { name: /use synced amount/i }).click()
  await expect(page.getByText("Synced to pre-registration")).toBeVisible()
})

test("cash scholarship flow carries the amount controls into confirmation with the right copy", async ({ page }) => {
  await page.goto("/cash", { waitUntil: "networkidle" })

  await fillScholarshipRegistrationForm(page)
  await page.locator("form button[type='submit']").click()

  const checkboxes = page.getByRole("checkbox")
  const checkboxCount = await checkboxes.count()
  for (let index = 0; index < checkboxCount; index += 1) {
    await checkboxes.nth(index).click()
  }

  await page.getByRole("button", { name: "Continue to Confirmation" }).click()

  await expect(page.getByRole("heading", { name: "Confirm Cash Scholarship" })).toBeVisible()
  await expect(page.getByText("Cash Scholarship Amount")).toBeVisible()
  await expect(page.getByText(`$${defaultScholarshipAmount}`).first()).toBeVisible()

  await page.getByRole("button", { name: /use custom amount/i }).click()
  await page.getByLabel("Custom amount per scholarship").fill("60")
  await page.getByLabel("Custom amount per scholarship").blur()
  await page.getByRole("button", { name: "Increase scholarship quantity" }).click()

  await expect(page.getByText("Current scholarship total")).toBeVisible()
  await expect(page.getByText("$120.00").first()).toBeVisible()
  await expect(page.getByRole("button", { name: "Save Cash Scholarship" })).toBeEnabled()
})
