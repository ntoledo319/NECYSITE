import type { Metadata } from "next"
import dynamic from "next/dynamic"
import InventoryShell from "@/components/games/inventory-shell"

const SpaceInvadersGame = dynamic(() => import("@/components/games/space-invaders"))

export const metadata: Metadata = {
  title: "Start a Bid — NECYPAA XXXVI",
  description: "Learn how to start a bid to host a future NECYPAA convention. Requirements, timeline, process, and resources.",
}

export default function BidPage() {
  return (
    <InventoryShell
      badge="Bidding"
      title="How to Start a Bid"
      subtitle="Interested in hosting a future NECYPAA? The bidding guide is being put together by the host committee."
      character="mad-hatter"
      theme="bid"
      gameName="Defect Invaders"
      gameDescription="The AA triangle fires spiritual principles at character defects. Arrow keys to move, Space to fire."
    >
      <SpaceInvadersGame />
    </InventoryShell>
  )
}
