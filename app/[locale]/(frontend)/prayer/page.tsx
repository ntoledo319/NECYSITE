import type { Metadata } from "next"
import InventoryShell from "@/components/games/inventory-shell"
import SnakeGame from "@/components/games/snake"

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
      gameName="The Journey"
      gameDescription="Collect serenity tokens one day at a time. Arrow keys to move. Don't cross your own path."
    >
      <SnakeGame />
    </InventoryShell>
  )
}
