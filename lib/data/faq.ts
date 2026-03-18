/**
 * FAQ data for NECYPAA XXXVI.
 *
 * Grouped by category. Content is informational, not promotional (Tradition 11).
 * No full names, no superlatives, no endorsements.
 */

export interface FAQItem {
  question: string
  answer: string
}

export interface FAQCategory {
  name: string
  items: FAQItem[]
}

export const faqData: FAQCategory[] = []
