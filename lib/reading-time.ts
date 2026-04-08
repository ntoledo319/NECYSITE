/**
 * Estimate reading time for a given text.
 * Uses 200 words per minute (average comfortable reading speed).
 * Returns a human-readable string like "3 min read".
 */
export function getReadingTime(text: string): string {
  const words = text.trim().split(/\s+/).length
  const minutes = Math.max(1, Math.round(words / 200))
  return `${minutes} min read`
}
