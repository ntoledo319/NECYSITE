import type { EventCategory } from "./types"

/**
 * Parse a Google Calendar event title to determine its category
 * and return a cleaned display title.
 *
 * Convention:
 *   **Title** (double asterisks) → host-event
 *   *Title*  (single asterisks) → host-business
 *   Plain title                 → external
 */
export function categorizeEvent(rawTitle: string): {
  category: EventCategory
  title: string
} {
  const trimmed = rawTitle.trim()

  // Double asterisks first (more specific match)
  const doubleMatch = trimmed.match(/^\*\*(.+)\*\*$/)
  if (doubleMatch) {
    return { category: "host-event", title: doubleMatch[1].trim() }
  }

  // Single asterisks
  const singleMatch = trimmed.match(/^\*(.+)\*$/)
  if (singleMatch) {
    return { category: "host-business", title: singleMatch[1].trim() }
  }

  // No asterisks — external
  return { category: "external", title: trimmed }
}
