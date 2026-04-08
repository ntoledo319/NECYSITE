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
  flyerSrc: "/images/ultimate-cool-down-flyer.webp",
  flyerAlt: "The Ultimate Cool Down — Ice Cream Social and Speed Fellowship, April 25th at 2 PM, CCAR 713 Main St Willimantic",
}

export const pastEvents: EventData[] = [
  {
    id: "cardboard-masquerade-2025",
    title: "Cardboard Masquerade",
    date: "Friday, May 30th, 2025",
    location: "3 Mountain Rd, Farmington, CT 06032",
    schedule: [
      { label: "Young Grenadiers Tradition Five Meeting", time: "7:30 PM" },
      { label: "Masquerade Ball, Board Games, Pizza & Snacks", time: "After Meeting" },
    ],
    details: [
      { label: "Activities", value: "Build your mask, masquerade ball, board games, pizza and snacks" },
      { label: "Presented by", value: "CT NECYPAA Bid Committee" },
    ],
    description: "",
    flyerSrc: "/images/flyer.webp",
    flyerAlt: "Cardboard Masquerade — Masquerade ball with build-your-own masks, board games, pizza and snacks, May 30th 2025 at 3 Mountain Rd Farmington CT",
  },
  {
    id: "game-night-pajama-rave-2025",
    title: "Game Night, Pajama Party & Half-Assed Rave",
    date: "Friday, April 11th, 2025",
    location: "Pathfinders Club, 102 Norman St, Manchester, CT",
    schedule: [
      { label: "'Happy, Joyous, and Free' Panel Meeting", time: "7:30 PM" },
      { label: "Games and Fellowship", time: "8:30 PM" },
    ],
    details: [
      { label: "Suggested Donation", value: "$10" },
      { label: "Presented by", value: "CT NECYPAA Bid Committee" },
    ],
    description: "",
    flyerSrc: "/images/game-night.webp",
    flyerAlt: "Game Night, Pajama Party and Half-Assed Rave — April 11th 2025 at Pathfinders Club, 102 Norman St, Manchester CT",
  },
  {
    id: "zombie-prom-2026",
    title: "Zombie Prom",
    date: "Friday, February 13th, 2026",
    location: "Enfield United Church of Christ, 1295 Enfield St, Enfield, CT 06082",
    schedule: [
      { label: "Hype", time: "6:30 PM" },
      { label: "Meeting", time: "7:00 PM" },
      { label: "Dance", time: "8:00 PM – Dawn" },
    ],
    details: [
      { label: "Suggested Contribution", value: "$15" },
      { label: "Presented by", value: "NECYPAA XXXVI Host and the Bay State Bid for NECYPAA" },
    ],
    description: "",
    flyerSrc: "/images/zombie-prom-flyer.webp",
    flyerAlt: "Zombie Prom — Dance and meeting, February 13th 2026 at Enfield United Church of Christ, 1295 Enfield St, Enfield CT",
  },
  {
    id: "nye-bonfire-2025",
    title: "New Year's Eve Bonfire & Fellowship",
    date: "Wednesday, December 31st, 2025",
    location: "",
    schedule: [],
    details: [
      { label: "Presented by", value: "NECYPAA XXXVI Host Committee" },
    ],
    description: "Ring in the New Year sober with fellowship, a bonfire, and good vibes. One year closer to NECYPAA XXXVI.",
    flyerSrc: "/images/nye-event.webp",
    flyerAlt: "New Year's Eve Bonfire and Fellowship — sober celebration with bonfire, music, and friends ringing in 2026",
  },
  {
    id: "rave-halloween-2024",
    title: "Rave: Halloween 2.0",
    date: "Friday, November 7th, 2024",
    location: "Bristol Recovery Club, 67 West St, Bristol, CT 06010",
    schedule: [
      { label: "Meeting", time: "7:30 PM" },
      { label: "Rave", time: "8:30 PM" },
    ],
    details: [
      { label: "Suggested Contribution", value: "$10" },
      { label: "Attire", value: "Costumes, PJs, or whatever" },
      { label: "Activities", value: "Dance, games, arts and crafts" },
      { label: "Food", value: "Pizza provided" },
      { label: "Presented by", value: "CT Bid for NECYPAA" },
    ],
    description: "One night of fright was never enough.",
    flyerSrc: "/images/rave-halloween.webp",
    flyerAlt: "Rave Halloween 2.0 — Dance, games, arts and crafts, November 7th 2024 at Bristol Recovery Club, 67 West St, Bristol CT",
  },
]
