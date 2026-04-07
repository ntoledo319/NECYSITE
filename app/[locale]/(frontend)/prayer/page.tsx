import type { Metadata } from "next"
import dynamic from "next/dynamic"
import InventoryShell from "@/components/games/inventory-shell"

const SnakeGame = dynamic(() => import("@/components/games/snake"))

export const metadata: Metadata = {
  title: "Prayer — NECYPAA XXXVI",
  description: "Prayer and spiritual resources for NECYPAA XXXVI attendees.",
}

export default function PrayerPage() {
  return (
    <InventoryShell
      badge="Prayer"
      title="Spiritual footing without clinical energy."
      subtitle="This room will hold the quieter side of the convention: the readings, reflections, and breathing space that keep the weekend grounded when everything else gets loud."
      character="caterpillar"
      theme="prayer"
      dividerVariant="compass"
      statusLabel="Spiritual Room"
      statusTitle="The prayer page is being shaped into a calm place to land, not a pile of generic inspirational quotes."
      statusCopy="When it is finished, this should help people start the morning, reset in the middle of the day, and close out the night without feeling like recovery got flattened into a motivational poster."
      detailItems={[
        { label: "Morning tone", value: "Grounding material before the noise of the day kicks in", accent: "gold" },
        { label: "Daytime use", value: "A place to pause, refocus, and find a little room inside the convention pace", accent: "cyan" },
        { label: "Night close", value: "Readings and reflections for the ride back to the room", accent: "purple" },
        { label: "What it should avoid", value: "Preachiness, empty inspiration, and anything that sounds mass-produced", accent: "pink" },
      ]}
      bridgeLinks={[
        {
          href: "/accessibility",
          label: "Accessibility and sensory support",
          description: "A quiet room only matters if the broader weekend is usable for the people who need it.",
          accent: "cyan",
        },
        {
          href: "/program",
          label: "Program board",
          description: "The spiritual rhythm of the weekend should eventually tie back into the full program.",
          accent: "gold",
        },
        {
          href: "/register",
          label: "Register for the weekend",
          description: "The best preparation still starts with actually being there when Hartford opens up.",
          accent: "purple",
        },
      ]}
      notesTitle="What belongs in this room"
      notes={[
        {
          title: "Morning readings",
          body: "Something brief, clear, and actually useful before the elevators, coffee lines, and first meetings start.",
        },
        {
          title: "Meditation prompts",
          body: "Low-noise guidance that can help someone settle without feeling managed or watched.",
        },
        {
          title: "Night reflections",
          body: "A softer landing after the panels, the dance floor, the emotional intensity, and the fellowship overload.",
        },
        {
          title: "Shared spiritual language",
          body: "Recovery language broad enough to welcome different understandings of Higher Power without flattening them.",
        },
      ]}
      committeeNote="This page should feel handmade and lived-in. If it reads like a wellness app, we missed."
      portalCaption="The quietest page on the site still has to feel like NECYPAA, not a sterile side room someone forgot to light."
      gameName="The Journey"
      gameDescription="Collect serenity tokens one day at a time. Arrow keys to move. Don't cross your own path."
      gamePrompt="A little meditation break would be ideal. A recovery-themed snake game is the second-best option."
    >
      <SnakeGame />
    </InventoryShell>
  )
}
