/**
 * Young Persons Al-Anon Meeting Directory
 *
 * Al-Anon meetings specifically for young adults (typically 18–35)
 * who have been affected by someone else's drinking.
 *
 * IMPORTANT: These are NOT Alateen meetings.
 * Alateen is a separate program for teens (13–18).
 * Young Persons Al-Anon is for adults in the Al-Anon program.
 *
 * Per Al-Anon Traditions: no member names, no attendance data.
 * These are resource listings, not affiliations.
 */

import type { MeetingFormat } from "./ypaa-meetings"

export interface YoungPersonsAlAnonMeeting {
  name: string
  state: string
  city: string
  day: string
  time: string
  format: MeetingFormat
  location?: string
  onlineUrl?: string
  meetingId?: string
  ageRange?: string
  contactUrl?: string
  notes?: string
}

export const YOUNG_PERSONS_ALANON_MEETINGS: YoungPersonsAlAnonMeeting[] = [
  {
    name: "Transforming Hope AFG",
    state: "CT",
    city: "Middletown",
    day: "Sunday",
    time: "12:30 PM",
    format: "in-person",
    location: "90 Court St, Middletown, CT 06457",
    ageRange: "Young People",
    contactUrl: "https://ctalanon.org/",
    notes: "Closed meeting (Al-Anon members and prospective members). CT Al-Anon: 1-888-825-2666.",
  },
  {
    name: "Young Adults And The Young At Heart AFG",
    state: "CT",
    city: "West Hartford",
    day: "Tuesday",
    time: "",
    format: "in-person",
    location: "Saint Peter Claver Church Classroom 6, 47 Pleasant St, West Hartford, CT 06107",
    ageRange: "Young Adults",
    contactUrl: "https://ctalanon.org/",
    notes: "Open meeting. Wheelchair accessible. Time not confirmed \u2014 call CT Al-Anon 1-888-825-2666 to verify.",
  },
  {
    name: "Young Peoples\u2019 AFG",
    state: "NY",
    city: "Online (Capital District)",
    day: "Monday",
    time: "7:30 PM",
    format: "online",
    onlineUrl: "https://global.gotomeeting.com/join/543862269",
    meetingId: "543-862-269 / Phone: +1 (872) 240-3212",
    ageRange: "18\u201340",
    contactUrl: "https://www.al-anon-8ny.org/online-meeting-schedule",
    notes: "District 8 Capital District Al-Anon. In need of more attendees and support. Online so accessible to anyone in the Northeast.",
  },
  {
    name: "Serenity Seekers AFG",
    state: "CA",
    city: "Garden Grove",
    day: "Thursday",
    time: "",
    format: "hybrid",
    location: "First Presbyterian Church, 11832 Euclid St, Garden Grove, CA 92840",
    meetingId: "Zoom: 344 516 9083 (no password)",
    ageRange: "Young Adults",
    contactUrl: "https://www.ocalanon.org/meeting-directory/",
    notes: "Open meeting with young adult focus. Based in California but Zoom-accessible to anyone. Time not confirmed \u2014 contact OC AIS.",
  },
]

// ─── Helpers ────────────────────────────────────────────────────────

/** Get meetings for a specific state */
export function getYPAlAnonMeetingsByState(state: string): YoungPersonsAlAnonMeeting[] {
  return YOUNG_PERSONS_ALANON_MEETINGS.filter((m) => m.state === state)
}

/** Get all unique states that have meetings */
export function getYPAlAnonStatesWithMeetings(): string[] {
  return [...new Set(YOUNG_PERSONS_ALANON_MEETINGS.map((m) => m.state))].sort()
}

/** Total meeting count */
export const YP_ALANON_MEETING_COUNT = YOUNG_PERSONS_ALANON_MEETINGS.length
