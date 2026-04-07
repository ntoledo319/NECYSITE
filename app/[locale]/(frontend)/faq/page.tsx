import type { Metadata } from "next"
import dynamic from "next/dynamic"
import InventoryShell from "@/components/games/inventory-shell"
import { HOTEL_BOOKING_URL } from "@/lib/constants"

const MemoryGame = dynamic(() => import("@/components/games/memory"))

export const metadata: Metadata = {
  title: "FAQ — NECYPAA XXXVI",
  description:
    "Frequently asked questions about NECYPAA XXXVI, registration, the hotel, and the convention experience.",
}

export default function FAQPage() {
  return (
    <InventoryShell
      badge="FAQ"
      title="Answers for the questions people actually ask."
      subtitle="We are building this around real attendee uncertainty, not filler. Until the full answer desk is published, the fastest answers already live on the pages below."
      character="cheshire-cat"
      dividerVariant="gear"
      statusLabel="Answer Desk"
      statusTitle="The full FAQ is being assembled from the practical things people need before they travel."
      statusCopy="The host committee would rather publish fewer clear answers than fill this page with guesses. As details harden, this becomes the place to check before you spiral in the group chat."
      detailItems={[
        { label: "Fastest answers", value: "Registration, hotel, events, and access details", accent: "pink" },
        { label: "How it gets filled", value: "Committee chairs confirm details first, then answers are posted here", accent: "purple" },
        { label: "Best use right now", value: "Handle the things with deadlines before the weekend sneaks up", accent: "gold" },
        { label: "Tone", value: "Direct, specific, and free of fake corporate FAQ energy", accent: "cyan" },
      ]}
      bridgeLinks={[
        {
          href: "/register",
          label: "Registration answers live here",
          description: "Ticket price, scholarship paths, and what you need before checkout.",
          accent: "purple",
        },
        {
          href: HOTEL_BOOKING_URL,
          label: "Hotel block",
          description: "Book the Hartford Marriott before the room block starts to disappear.",
          external: true,
          accent: "gold",
        },
        {
          href: "/accessibility",
          label: "Accessibility and accommodations",
          description: "Requests, support options, and how to tell us what you need.",
          accent: "cyan",
        },
      ]}
      notesTitle="What will land here"
      notes={[
        {
          title: "Arrival and check-in",
          body: "When to come in, what to bring, and how the weekend starts once you get to Hartford.",
        },
        {
          title: "Program and schedules",
          body: "What is locked, what is still in motion, and where to look before you make plans around it.",
        },
        {
          title: "Money and extras",
          body: "Breakfast, merch, scholarships, and anything else that changes what you need to budget for.",
        },
        {
          title: "Access and support",
          body: "ASL, food, mobility, sensory needs, and the practical stuff that makes the weekend usable.",
        },
      ]}
      committeeNote="If you only handle two things early, make them registration and hotel. Those decisions age well."
      portalCaption="This page becomes the committee’s answer board once the details are confirmed enough to trust."
      gameName="Matching Principles"
      gameDescription="Match each AA principle to its step. Arrow keys to navigate, Enter or Space to flip. Find all 8 pairs."
      gamePrompt="If you need a minute while the answer board catches up, here’s a memory game instead of a dead end."
    >
      <MemoryGame />
    </InventoryShell>
  )
}
