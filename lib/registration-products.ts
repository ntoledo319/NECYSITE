/** A purchasable item (registration tier or breakfast ticket) with Stripe-compatible pricing. */
export interface RegistrationProduct {
  id: string
  name: string
  description: string
  /** Price in US cents (e.g. 4000 = $40.00). */
  priceInCents: number
}

// Registration pricing for NECYPAA XXXVI
export const REGISTRATION_PRODUCTS: RegistrationProduct[] = [
  {
    id: "necypaa-xxxvi-registration",
    name: "NECYPAA XXXVI Registration",
    description: "The Archway of Freedom - Full conference registration",
    priceInCents: 4000, // $40.00
  },
]

// Breakfast ticket products
export const BREAKFAST_PRODUCTS: RegistrationProduct[] = [
  {
    id: "breakfast-friday",
    name: "New Year's Day Breakfast - Friday",
    description: "New Year's Day Breakfast at the convention - Start your new year with fellowship! Most local restaurants will be closed.",
    priceInCents: 2500, // $25.00
  },
  {
    id: "breakfast-saturday",
    name: "Breakfast - Saturday",
    description: "Saturday morning breakfast at the convention",
    priceInCents: 2500, // $25.00
  },
  {
    id: "breakfast-sunday",
    name: "Breakfast - Sunday",
    description: "Sunday morning breakfast at the convention",
    priceInCents: 2500, // $25.00
  },
]

/** Gross-up fee: covers Stripe's 2.9% + $0.30 on the fee itself. */
export function calculateProcessingFee(amountInCents: number): number {
  const fixedFee = 30
  const percentageRate = 0.029
  return Math.round((amountInCents + fixedFee) / (1 - percentageRate) - amountInCents)
}
