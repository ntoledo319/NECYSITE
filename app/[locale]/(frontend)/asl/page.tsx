import type { Metadata } from "next"
import InventoryShell from "@/components/games/inventory-shell"
import PongGame from "@/components/games/pong"

export const metadata: Metadata = {
  title: "ASL Resources — NECYPAA XXXVI",
  description: "American Sign Language resources and interpretation information for NECYPAA XXXVI.",
}

export default function ASLPage() {
  return (
    <InventoryShell
      badge="ASL"
      title="ASL Resources"
      subtitle="American Sign Language interpretation and signing resources for the convention. Details coming soon."
      character="cheshire-cat"
      gameName="Carry the Message"
      gameDescription="Keep the message going back and forth. ↑ ↓ or mouse to move your paddle. First to 7 wins."
    >
      <PongGame />
    </InventoryShell>
  )
}
