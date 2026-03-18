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
  location: "CCAR, 755 Main St, Willimantic, CT",
  schedule: [
    { label: "Ice Cream Social & Speed Fellowship", time: "2:00 PM" },
  ],
  details: [
    { label: "Activities", value: "Unlimited ice cream, speed fellowship, and positive sober cat calling" },
    { label: "Suggested Contribution", value: "$15" },
    { label: "Presented by", value: "NECYPAA XXXVI Host Committee" },
  ],
  description:
    "\"Rarely have we seen a person fail who has thoroughly licked their bowl.\" Come cool down with unlimited ice cream, speed fellowship, and good vibes!",
  flyerSrc: "/images/ultimate-cool-down-flyer.png",
  flyerAlt: "The Ultimate Cool Down — Ice Cream Social and Speed Fellowship, April 25th at 2 PM, CCAR Willimantic",
}

export const pastEvents: EventData[] = [
  {
    id: "zombie-prom-2026",
    title: "Zombie Prom",
    date: "Friday, February 13th, 2026",
    location: "Enfield United Church of Christ, 1295 Enfield Street, Enfield, CT 06082",
    schedule: [
      { label: "Hype", time: "6:30 – 7:00 PM" },
      { label: "Meeting", time: "7:00 – 8:00 PM" },
      { label: "Dance", time: "8:00 PM – Dawn" },
    ],
    details: [
      { label: "Hosted by", value: "NECYPAA 36 and The Bay State Bid for NECYPAA" },
      { label: "Suggested Contribution", value: "$15" },
    ],
    description:
      "A spooky night of dancing, fellowship, and fun! Attendees dressed in their best zombie prom attire and celebrated recovery with friends from across the Northeast.",
    flyerSrc: "/images/zombie-prom-flyer.jpeg",
    flyerAlt: "Zombie Prom – Friday February 13th",
  },
  {
    id: "nye-meeting-2026",
    title: "NYE Meeting 2026",
    date: "Wednesday, December 31, 2025",
    location: "Bristol Recovery Club, 67 West St, Bristol, CT",
    schedule: [
      { label: "Meeting", time: "8:30 PM" },
      { label: "Food / Dance / Party", time: "9:30 PM" },
    ],
    details: [
      { label: "Entertainment", value: "Ball Drop Televised Live" },
      { label: "Co-host", value: "The Happy Hour Group & CT Bid for NECYPAA" },
      { label: "Tickets", value: "$15 in advance, $20 at the door" },
      { label: "RSVP", value: "Meadow 860-707-0268, Danielle 860-987-3956" },
    ],
    description: "A fantastic night of recovery, fellowship, and celebration to ring in 2026!",
    flyerSrc: "/images/50a7821a-d39f-4197-ac4e-efc919034db9.jpg",
    flyerAlt: "NYE Meeting 2026 Flyer",
  },
  {
    id: "trivia-night-2025",
    title: "Trivia Night",
    date: "Saturday, December 13, 2025",
    location: "Milford VFW, 422 Naugatuck Ave, Milford, CT",
    schedule: [
      { label: "Doors open", time: "6:30 PM" },
    ],
    details: [
      { label: "Theme", value: "Knowledge Wins; Sobriety Shines" },
      { label: "Suggested Contribution", value: "$15" },
      { label: "Presented by", value: "CT Bid for NECYPAA" },
    ],
    description: "A fun evening of trivia, fellowship, and friendly competition to support our NECYPAA bid!",
    flyerSrc: "/images/a073eef2-301c-4220-ab01-45ca5a3e5ee6.jpg",
    flyerAlt: "Trivia Night Flyer",
  },
  {
    id: "rave-halloween-2025",
    title: "RAVE HALLOWEEN 2.0",
    date: "Thursday, November 7, 2025",
    location: "Bristol Recovery Club, 67 West St, Bristol, CT 06010",
    schedule: [
      { label: "Meeting", time: "7:30 PM" },
      { label: "Rave", time: "8:30 PM" },
    ],
    details: [
      { label: "Attire", value: "Costumes, PJs, or whatever!" },
      { label: "Activities", value: "Dance, Games, Arts and Crafts" },
      { label: "Food", value: "Pizza provided" },
      { label: "Suggested contribution", value: "$10" },
    ],
    description:
      "One night of fright was never enough! An evening of dancing, games, arts and crafts, and fellowship to support our NECYPAA bid.",
    flyerSrc: "/images/rave-halloween.jpeg",
    flyerAlt: "RAVE HALLOWEEN 2.0 Event Flyer",
  },
  {
    id: "cardboard-masquerade-2025",
    title: "Cardboard Masquerade",
    date: "Friday, May 30, 2025 at 7:30 PM",
    location: "3 Mountain Rd, Farmington, CT 06032",
    schedule: [],
    details: [
      { label: "Suggested contribution", value: "$10" },
    ],
    description:
      "A night of mask-making, board games, pizza, and fellowship to support our NECYPAA bid! Featured a masquerade ball, DIY mask-making station, board games, and plenty of snacks.",
    flyerSrc: "/flyer.png",
    flyerAlt: "Cardboard Masquerade Event Flyer",
  },
  {
    id: "game-night-2025",
    title: "Game Night, Pajama Party & Half-Assed Rave",
    date: "Friday, April 11, 2025",
    location: "Pathfinders Club, 102 Norman St, Manchester, CT",
    schedule: [
      { label: "Meeting: 'Happy, Joyous, and Free' Panel", time: "7:30 PM" },
      { label: "Games and Fellowship", time: "8:30 PM" },
    ],
    details: [
      { label: "Suggested donation", value: "$10" },
    ],
    description:
      "A fun night of games, fellowship, and a half-assed rave to support our NECYPAA bid! Featured a panel discussion, board games, and plenty of snacks.",
    flyerSrc: "/images/game-night.jpeg",
    flyerAlt: "Game Night, Pajama Party & Half-Assed Rave Event Flyer",
  },
]
