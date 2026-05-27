import { describe, it, expect } from "vitest"
import { partitionEvents } from "@/lib/data/fetch-utils"
import type { EventData } from "@/lib/data/events"

function makeEvent(id: string, startsAt: string): EventData {
  return {
    id,
    title: id,
    date: id,
    startsAt,
    location: "",
    schedule: [],
    details: [],
    description: "",
    flyerSrc: "",
    flyerAlt: "",
  }
}

describe("partitionEvents", () => {
  it("buckets past/today/future correctly when all share a calendar year", () => {
    const now = new Date("2026-06-15T12:00:00Z")
    const past = makeEvent("past", "2026-02-13T18:30:00-05:00")
    const today = makeEvent("today", "2026-06-15T20:00:00Z")
    const future = makeEvent("future", "2026-11-07T19:30:00-05:00")

    const result = partitionEvents([past, today, future], now)

    expect(result.upcoming?.id).toBe("today")
    expect(result.past.map((e) => e.id)).toEqual(["future", "past"])
  })

  it("returns null upcoming and reverse-chronological past when nothing is future", () => {
    const now = new Date("2027-01-01T00:00:00Z")
    const older = makeEvent("older", "2024-11-07T19:30:00-05:00")
    const newer = makeEvent("newer", "2026-02-13T18:30:00-05:00")

    const result = partitionEvents([older, newer], now)

    expect(result.upcoming).toBeNull()
    expect(result.past.map((e) => e.id)).toEqual(["newer", "older"])
  })

  it("sorts multiple upcoming events ascending and pushes the rest into past", () => {
    const now = new Date("2026-01-01T00:00:00Z")
    const soon = makeEvent("soon", "2026-02-13T18:30:00-05:00")
    const later = makeEvent("later", "2026-04-25T14:00:00-04:00")

    const result = partitionEvents([later, soon], now)

    expect(result.upcoming?.id).toBe("soon")
    expect(result.past.map((e) => e.id)).toEqual(["later"])
  })
})
