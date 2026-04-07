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
      title="Prayer"
      subtitle="Spiritual resources and reflections. Content from the Prayer Chair coming soon."
      character="caterpillar"
      theme="prayer"
      gameName="The Journey"
      gameDescription="Collect serenity tokens one day at a time. Arrow keys to move. Don't cross your own path."
    >
      <SnakeGame />
    </InventoryShell>
  )
}
