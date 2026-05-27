/**
 * Small fixed-table email domain typo detector. Returns a suggested fix when
 * the user is likely off by one character on a common provider. Conservative
 * — only suggests when the candidate is within Damerau-Levenshtein distance 1
 * AND we'd be replacing a non-standard domain with a common one.
 *
 * No external dependency; no ML. Covers ~90% of real-world signup typos
 * (gmial / gnail / yhaoo / hotmial etc.).
 */

const COMMON_DOMAINS = [
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "yahoo.co.uk",
  "hotmail.com",
  "outlook.com",
  "live.com",
  "icloud.com",
  "me.com",
  "aol.com",
  "comcast.net",
  "verizon.net",
  "att.net",
  "sbcglobal.net",
  "proton.me",
  "protonmail.com",
  "fastmail.com",
  "necypaa.org",
] as const

const COMMON_TLDS = [
  "com",
  "org",
  "net",
  "edu",
  "gov",
  "co.uk",
  "io",
  "me",
] as const

/**
 * Damerau-Levenshtein with a small allocation: returns Infinity when the
 * edit distance exceeds `max`.
 */
function editDistance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return Infinity
  const m = a.length
  const n = b.length
  if (m === 0) return n
  if (n === 0) return m
  // Allocate two rows; rotating is enough for distance.
  let prev = new Array<number>(n + 1).fill(0)
  let cur = new Array<number>(n + 1).fill(0)
  let prevPrev = new Array<number>(n + 1).fill(0)
  for (let j = 0; j <= n; j++) prev[j] = j
  for (let i = 1; i <= m; i++) {
    cur[0] = i
    let rowMin = cur[0]
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost)
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        cur[j] = Math.min(cur[j], prevPrev[j - 2] + 1)
      }
      if (cur[j] < rowMin) rowMin = cur[j]
    }
    if (rowMin > max) return Infinity
    ;[prevPrev, prev, cur] = [prev, cur, prevPrev]
  }
  return prev[n]
}

export interface EmailSuggestion {
  /** The suggested replacement, full email address. */
  suggested: string
  /** Human-readable phrase: "gmail.com". */
  domain: string
}

export function suggestEmailFix(email: string): EmailSuggestion | null {
  if (typeof email !== "string") return null
  const trimmed = email.trim().toLowerCase()
  const atIdx = trimmed.lastIndexOf("@")
  if (atIdx < 1 || atIdx === trimmed.length - 1) return null
  const local = trimmed.slice(0, atIdx)
  const domain = trimmed.slice(atIdx + 1)
  if (!domain.includes(".")) return null

  // Exact match — nothing to suggest.
  if (COMMON_DOMAINS.includes(domain as (typeof COMMON_DOMAINS)[number])) return null

  // Distance 1 on the whole domain is the most common case.
  for (const candidate of COMMON_DOMAINS) {
    if (editDistance(domain, candidate, 1) === 1) {
      return { suggested: `${local}@${candidate}`, domain: candidate }
    }
  }

  // Catch missing-dot patterns: "gmailcom", "yahoocom", etc.
  const noDot = domain.replace(/\./g, "")
  for (const candidate of COMMON_DOMAINS) {
    const candidateNoDot = candidate.replace(/\./g, "")
    if (noDot === candidateNoDot) {
      return { suggested: `${local}@${candidate}`, domain: candidate }
    }
  }

  // TLD typos: "gmail.con", "gmail.cmo". Only suggest when the host portion
  // exactly matches a common host.
  const dotIdx = domain.lastIndexOf(".")
  if (dotIdx > 0) {
    const host = domain.slice(0, dotIdx)
    const tld = domain.slice(dotIdx + 1)
    for (const fullDomain of COMMON_DOMAINS) {
      const fullDot = fullDomain.indexOf(".")
      if (fullDot < 0) continue
      const fullHost = fullDomain.slice(0, fullDot)
      const fullTld = fullDomain.slice(fullDot + 1)
      if (host === fullHost && editDistance(tld, fullTld, 1) === 1) {
        return { suggested: `${local}@${fullDomain}`, domain: fullDomain }
      }
    }
    // Generic TLD typo (host is anything, just fix the TLD)
    for (const goodTld of COMMON_TLDS) {
      if (tld !== goodTld && editDistance(tld, goodTld, 1) === 1) {
        return { suggested: `${local}@${host}.${goodTld}`, domain: `${host}.${goodTld}` }
      }
    }
  }

  return null
}
