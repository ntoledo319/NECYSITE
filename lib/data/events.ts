export interface EventData {
  id: string
  title: string
  date: string
  location: string
  schedule: { label: string; time: string }[]
  details: { label: string; value: string }[]
  description: string
  flyerSrc: string
  flyerAlt: string
}

/** @deprecated Use EventData instead */
export type PastEvent = EventData

export const upcomingEvent: EventData = {
  id: "ultimate-cool-down-2026",
  title: "The Ultimate Cool Down",
  date: "Saturday, April 25th, 2026",
  location: "CCAR, 713 Main St, Willimantic, CT",
  schedule: [
    { label: "Ice Cream Social & Speed Fellowship", time: "2:00 PM" },
  ],
  details: [
    { label: "Activities", value: "Unlimited ice cream, speed fellowship, and positive and emotionally sober cat calling" },
    { label: "Suggested Contribution", value: "$15" },
    { label: "Presented by", value: "NECYPAA XXXVI Host Committee" },
  ],
  description:
    "\"Rarely have we seen a person fail who has thoroughly licked their bowl.\" Come cool down with unlimited ice cream, speed fellowship, and good vibes!",
  flyerSrc: "/images/ultimate-cool-down-flyer.png",
  flyerAlt: "The Ultimate Cool Down — Ice Cream Social and Speed Fellowship, April 25th at 2 PM, CCAR 713 Main St Willimantic",
}

export const pastEvents: EventData[] = []
