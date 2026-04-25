import { categorizeEvent } from "./categorize"
import { GOOGLE_CALENDAR_ID } from "@/lib/constants"
import type { CalendarEvent } from "./types"

const API_BASE = "https://www.googleapis.com/calendar/v3"

interface GoogleCalendarEvent {
  id: string
  summary?: string
  start?: { dateTime?: string; date?: string; timeZone?: string }
  end?: { dateTime?: string; date?: string; timeZone?: string }
  location?: string
  description?: string
  status?: string
  htmlLink?: string
  iCalUID?: string
}

interface GoogleCalendarResponse {
  items?: GoogleCalendarEvent[]
  nextPageToken?: string
}

function resolveDateTime(dt?: { dateTime?: string; date?: string }): string | null {
  if (!dt) return null
  // dateTime includes timezone offset; date is all-day (YYYY-MM-DD)
  return dt.dateTime ?? (dt.date ? `${dt.date}` : null)
}

export async function fetchCalendarEvents(): Promise<CalendarEvent[]> {
  const apiKey = process.env.GOOGLE_CALENDAR_API_KEY
  if (!apiKey) {
    console.error("[calendar] GOOGLE_CALENDAR_API_KEY is not set")
    return []
  }

  const now = new Date()
  const timeMin = new Date(now)
  timeMin.setMonth(timeMin.getMonth() - 6)
  const timeMax = new Date(now)
  timeMax.setMonth(timeMax.getMonth() + 12)

  const allItems: GoogleCalendarEvent[] = []
  let pageToken: string | undefined
  let pages = 0
  const MAX_PAGES = 20

  try {
    do {
      const params = new URLSearchParams({
        key: apiKey,
        timeMin: timeMin.toISOString(),
        timeMax: timeMax.toISOString(),
        singleEvents: "true",
        orderBy: "startTime",
        maxResults: "250",
      })
      if (pageToken) params.set("pageToken", pageToken)

      const url = `${API_BASE}/calendars/${encodeURIComponent(GOOGLE_CALENDAR_ID)}/events?${params}`
      const res = await fetch(url, {
        next: { revalidate: 300 },
        signal: AbortSignal.timeout(10_000),
      })

      if (!res.ok) {
        const msg =
          `[calendar] Google API ${res.status} ${res.statusText}` +
          (res.status === 401 || res.status === 403 ? " — check GOOGLE_CALENDAR_API_KEY restrictions" : "")
        if (res.status >= 500) {
          console.warn(msg)
        } else {
          console.error(msg)
        }
        return []
      }

      const data: GoogleCalendarResponse = await res.json()
      if (data.items) allItems.push(...data.items)
      pageToken = data.nextPageToken
      pages++
    } while (pageToken && pages < MAX_PAGES)

    if (pages >= MAX_PAGES) {
      console.warn("[calendar] Pagination limit reached — some events may be missing")
    }
  } catch (err) {
    if (err instanceof DOMException && err.name === "TimeoutError") {
      console.error("[calendar] Google API request timed out (10s)")
    } else {
      console.error("[calendar] Failed to fetch events:", err)
    }
    return []
  }

  // Deduplicate by iCalUID + start (handles recurring event expansion edge cases)
  const seen = new Set<string>()
  const events: CalendarEvent[] = []

  for (const item of allItems) {
    // Skip cancelled events
    if (item.status === "cancelled") continue
    if (!item.summary) continue

    const start = resolveDateTime(item.start)
    if (!start) continue // Skip events with no parseable start time

    const end = resolveDateTime(item.end) ?? start
    const dedupeKey = `${item.iCalUID ?? item.id}_${start}`
    if (seen.has(dedupeKey)) continue
    seen.add(dedupeKey)

    const { category, title } = categorizeEvent(item.summary)

    events.push({
      id: item.id,
      title,
      category,
      start,
      end,
      location: item.location ?? "",
      description: item.description ?? "",
      htmlLink: item.htmlLink ?? "",
    })
  }

  // Sort ascending by start
  events.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())

  return events
}
