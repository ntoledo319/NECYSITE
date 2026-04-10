import { fetchCalendarEvents } from "@/lib/calendar/fetch"
import CalendarClient from "./calendar-client"

/**
 * Server component that fetches calendar events and passes them
 * to the interactive client component.
 *
 * ISR: revalidates every 5 minutes via fetch cache in lib/calendar/fetch.ts.
 */
export default async function CalendarSection() {
  const events = await fetchCalendarEvents()

  return <CalendarClient events={events} />
}
