import type { GlobalConfig } from "payload"

/**
 * Live pricing for registration + breakfast tickets. A Payload global so the
 * committee can adjust prices without a deploy (e.g., to roll out "late
 * registration $50" after a cutoff date). Server code reads these via
 * `lib/pricing.ts` with a fallback to the compiled-in defaults in
 * `lib/registration-products.ts`, so a Payload outage never blocks checkout.
 *
 * Cents fields throughout. UI labels live in `lib/registration-products.ts`
 * because they may be referenced in copy.
 */
export const PricingSettings: GlobalConfig = {
  slug: "pricing-settings",
  admin: {
    description:
      "Live registration and breakfast pricing. Saved values take effect immediately for new checkouts; in-flight sessions keep the price they were created with.",
  },
  access: {
    read: ({ req: { user } }) => Boolean(user?.role === "admin" || user?.role === "registration"),
    update: ({ req: { user } }) => Boolean(user?.role === "admin"),
  },
  fields: [
    {
      name: "registrationPriceCents",
      type: "number",
      required: true,
      defaultValue: 4000,
      min: 0,
      max: 100_000,
      admin: {
        description: "Price of one NECYPAA XXXVI registration, in cents. Default $40 = 4000.",
        step: 100,
      },
    },
    {
      name: "breakfastFridayPriceCents",
      type: "number",
      required: true,
      defaultValue: 2500,
      min: 0,
      max: 50_000,
      admin: { description: "Friday (New Year's Day) breakfast, in cents.", step: 100 },
    },
    {
      name: "breakfastSaturdayPriceCents",
      type: "number",
      required: true,
      defaultValue: 2500,
      min: 0,
      max: 50_000,
      admin: { description: "Saturday breakfast, in cents.", step: 100 },
    },
    {
      name: "breakfastSundayPriceCents",
      type: "number",
      required: true,
      defaultValue: 2500,
      min: 0,
      max: 50_000,
      admin: { description: "Sunday breakfast, in cents.", step: 100 },
    },
    {
      name: "lastUpdatedNote",
      type: "textarea",
      admin: {
        description: "Optional change-log entry: who changed pricing and why.",
      },
    },
  ],
}
