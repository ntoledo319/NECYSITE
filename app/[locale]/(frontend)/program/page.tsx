import type { Metadata } from "next"
import dynamic from "next/dynamic"
import InventoryShell from "@/components/games/inventory-shell"
import { HOTEL_BOOKING_URL, CONVENTION_DATES } from "@/lib/constants"

const TetrisGame = dynamic(() => import("@/components/games/tetris"))

export const metadata: Metadata = {
  title: "Program — NECYPAA XXXVI",
  description: "Convention program and schedule for NECYPAA XXXVI. Hartford Marriott Downtown, Dec 31, 2026 – Jan 3, 2027.",
}

export default function ProgramPage() {
  return (
    <InventoryShell
      badge="Program"
      title="A four-day weekend needs a readable spine."
      subtitle={`The full convention program is still being built, but the shape of the weekend is already clear: arrive ready for fellowship, movement, meetings, speakers, and late-night recovery energy from ${CONVENTION_DATES}.`}
      character="cheshire-cat"
      dividerVariant="compass"
      statusLabel="Weekend Structure"
      statusTitle="This page will become the schedule people actually plan their weekend around."
      statusCopy="Instead of pretending the lineup is finished, we’re giving the broad architecture now. Once workshop rooms, speakers, and dance details lock, this becomes the living program board."
      detailItems={[
        { label: "Thursday", value: "Arrival, opening energy, and that first-night reunion feeling", accent: "pink" },
        { label: "Friday", value: "Meetings, panels, and the busiest daytime flow", accent: "purple" },
        { label: "Saturday", value: "Keynote moments, fellowship, and the loudest convention energy", accent: "gold" },
        { label: "Sunday", value: "Closing cadence, goodbyes, and travel back into real life", accent: "cyan" },
      ]}
      bridgeLinks={[
        {
          href: "/register",
          label: "Get registered first",
          description: "It is a lot easier to care about the program once your spot is already locked in.",
          accent: "purple",
        },
        {
          href: HOTEL_BOOKING_URL,
          label: "Book the host hotel",
          description: "Stay close to the action so the actual program can shape your whole weekend.",
          external: true,
          accent: "gold",
        },
        {
          href: "/events",
          label: "Road-to-Hartford events",
          description: "The committee energy that builds this weekend is already happening before New Year’s Eve.",
          accent: "cyan",
        },
      ]}
      notesTitle="What will live here"
      notes={[
        {
          title: "Meetings and speakers",
          body: "The rooms that hold the actual message, not just the decorative perimeter around the convention.",
        },
        {
          title: "Panels and workshops",
          body: "Service, sponsorship, access, fellowship, and all the side rooms where people really connect.",
        },
        {
          title: "Dances and fellowship",
          body: "The stuff that makes a YPAA weekend feel alive after the formal program ends for the day.",
        },
        {
          title: "Quiet and practical details",
          body: "Breaks, accessible options, and the connective tissue that keeps the big moments usable.",
        },
      ]}
      committeeNote="This page is meant to become a planning tool, not a vague promise. Readability matters more than hype."
      portalCaption="The finished program should feel like a bulletin board with authority, not a PDF someone remembers to upload at the last minute."
      gameName="Recovery Blocks"
      gameDescription="Build your program one block at a time. Each piece carries a recovery slogan. ← → move, ↑ rotate, Space hard drop."
      gamePrompt="While the real schedule is still stacking into place, there’s at least one kind of program you can finish right now."
    >
      <TetrisGame />
    </InventoryShell>
  )
}
