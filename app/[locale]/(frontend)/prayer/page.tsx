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
      pageContent={
        <div className="mb-8 space-y-4 leading-relaxed text-[var(--nec-muted)]">
          <p className="italic">
            &ldquo;God, grant me the serenity to accept the things I cannot change, the courage to change the things I
            can, and the wisdom to know the difference.&rdquo;
          </p>
          <p>
            <strong className="text-[var(--nec-text)]">Status:</strong> Our Prayer Chair is compiling spiritual
            resources, local meditation meetings, and spaces for quiet reflection during the convention.
          </p>
          <p>The convention will feature dedicated spaces for prayer and meditation away from the main hustle.</p>
        </div>
      }
    >
      <SnakeGame />
    </InventoryShell>
  )
}
