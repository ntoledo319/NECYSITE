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
      pageContent={
        <div className="space-y-4 mb-8 text-[var(--nec-muted)] leading-relaxed">
          <p>
            Hosting a NECYPAA convention is a profound act of service that unifies your local fellowship.
          </p>
          <p>
            <strong className="text-[var(--nec-text)]">Status:</strong> The official bidding requirements and packets for NECYPAA XXXVII are being finalized by the Advisory Council.
          </p>
          <p>
            If you&apos;re interested in forming a bid committee, <a href="mailto:info@necypaa.org" className="underline text-[var(--nec-text)] font-semibold">reach out to us</a> for guidance.
          </p>
        </div>
      }
    >
      <SpaceInvadersGame />
    </InventoryShell>
  )
}
