import type { EventCategory } from "./types"

/**
 * Parse a Google Calendar event title to determine its category
 * and return a cleaned display title.
 *
 * The calendar uses two naming conventions (both supported):
 *
 * Bracket prefixes (current):
 *   [BIZ]  → host-business
 *   [SUB]  → host-business
 *   [AREA] → host-business
 *   [HOST] → host-event
 *
 * Asterisk wrapping (legacy):
 *   *Title*    (single)  → host-business
 *   **Title**  (double)  → host-event
 *   ***Title*** (triple) → host-event
 *
 * Plain title → external
 */
export function categorizeEvent(rawTitle: string): {
  category: EventCategory
  title: string
} {
  const trimmed = rawTitle.trim()

  // Bracket prefixes — check first (unambiguous, current convention)
  const bracketMatch = trimmed.match(/^\[([A-Z]+)\]\s*(.*)$/)
  if (bracketMatch) {
    const tag = bracketMatch[1]
    const title = bracketMatch[2].trim()
    if (tag === "HOST") {
      return { category: "host-event", title }
    }
    // BIZ, SUB, AREA — all host business
    return { category: "host-business", title }
  }

  // Triple asterisks (host-event)
  const tripleMatch = trimmed.match(/^\*\*\*(.+)\*\*\*$/)
  if (tripleMatch) {
    return { category: "host-event", title: tripleMatch[1].trim() }
  }

  // Double asterisks (host-event)
  const doubleMatch = trimmed.match(/^\*\*(.+)\*\*$/)
  if (doubleMatch) {
    return { category: "host-event", title: doubleMatch[1].trim() }
  }

  // Single asterisks (host-business)
  const singleMatch = trimmed.match(/^\*(.+)\*$/)
  if (singleMatch) {
    return { category: "host-business", title: singleMatch[1].trim() }
  }

  // No prefix — external
  return { category: "external", title: trimmed }
}
