export type EventCategory = "host-business" | "host-event" | "external"

export interface CalendarEvent {
  id: string
  title: string
  category: EventCategory
  start: string // ISO 8601
  end: string // ISO 8601
  location: string
  description: string
  htmlLink: string // Google Calendar event URL
}
