"use client"

import { YOUNG_PERSONS_ALANON_MEETINGS, getYPAlAnonStatesWithMeetings } from "@/lib/data/young-persons-alanon-meetings"
import MeetingDirectory from "@/components/meeting-directory"
import type { MeetingDirectoryItem } from "@/components/meeting-directory-card"

/**
 * Client component wrapper for the Young Persons Al-Anon meeting directory.
 * Used on the Al-Anon page (which is a server component exporting metadata).
 *
 * IMPORTANT: These are Young Persons Al-Anon meetings — NOT Alateen.
 * Al-Anon is for adults (18+) affected by someone else's drinking.
 * Alateen is a separate program for teens (13–18).
 */
export default function YoungPersonsAlAnonDirectory() {
  const states = getYPAlAnonStatesWithMeetings()

  const meetings: MeetingDirectoryItem[] = YOUNG_PERSONS_ALANON_MEETINGS.map((m) => ({
    name: m.name,
    state: m.state,
    city: m.city,
    day: m.day,
    time: m.time,
    format: m.format,
    location: m.location,
    onlineUrl: m.onlineUrl,
    meetingId: m.meetingId,
    contactUrl: m.contactUrl,
    notes: m.notes,
    ageRange: m.ageRange,
  }))

  return (
    <MeetingDirectory
      meetings={meetings}
      theme="blue"
      states={states}
      heading="Young Persons Al-Anon Meetings"
      description="Al-Anon meetings specifically for young adults affected by someone else's drinking. These are Al-Anon meetings — not Alateen. Al-Anon is for adults; Alateen is a separate program for teens."
      icon="heart"
    />
  )
}
