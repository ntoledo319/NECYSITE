import type { Metadata } from "next"
import InventoryShell from "@/components/games/inventory-shell"
import BreakoutGame from "@/components/games/breakout"

export const metadata: Metadata = {
  title: "Merch — NECYPAA XXXVI",
  description: "Official NECYPAA XXXVI merchandise. All proceeds support the convention.",
}

export default function MerchPage() {
  return (
    <InventoryShell
      badge="Merch"
      title="Merchandise"
      subtitle="Official NECYPAA XXXVI gear is on the way. All proceeds support the convention."
      character="mad-hatter"
      gameName="Wall of Denial"
      gameDescription="Break through the Wall of Denial. Mouse/touch or ← → to move the paddle. Space or click to launch."
    >
      <BreakoutGame />
    </InventoryShell>
  )
}
