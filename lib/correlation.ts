/**
 * Correlation IDs let a single registration attempt be traced across server
 * actions, webhook events, DLQ entries, and client error reports. Format is
 * sortable and easy to read in a Slack message: `reg_20260516T143015_a1b2c3`.
 */

function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n)
}

function timestampSegment(now = new Date()): string {
  const y = now.getUTCFullYear()
  const m = pad2(now.getUTCMonth() + 1)
  const d = pad2(now.getUTCDate())
  const hh = pad2(now.getUTCHours())
  const mm = pad2(now.getUTCMinutes())
  const ss = pad2(now.getUTCSeconds())
  return `${y}${m}${d}T${hh}${mm}${ss}`
}

function randomSegment(): string {
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    const bytes = new Uint8Array(4)
    crypto.getRandomValues(bytes)
    return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("")
  }
  return Math.random().toString(16).slice(2, 10).padEnd(8, "0")
}

export type CorrelationId = string

export function newCorrelationId(prefix = "reg"): CorrelationId {
  return `${prefix}_${timestampSegment()}_${randomSegment()}`
}

export function isCorrelationId(value: unknown): value is CorrelationId {
  return typeof value === "string" && /^[a-z]+_\d{8}T\d{6}_[0-9a-f]{6,}$/i.test(value)
}
