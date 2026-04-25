import type { Metadata } from "next"
import dynamic from "next/dynamic"
import InventoryShell from "@/components/games/inventory-shell"

const BreakoutGame = dynamic(() => import("@/components/games/breakout"))

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
      theme="merch"
      gameName="Wall of Denial"
      gameDescription="Break through the Wall of Denial. Mouse/touch or ← → to move the paddle. Space or click to launch."
      pageContent={
        <div className="space-y-4 mb-8 text-[var(--nec-muted)] leading-relaxed">
          <p>
            <strong className="text-[var(--nec-text)]">Status:</strong> Pre-convention merch is available at our live events. An online store for pre-orders is coming soon.
          </p>
          <p>
            <strong className="text-[var(--nec-text)]">Logistics:</strong> Pre-ordered merch will be available for pickup at the convention registration desk. Shipping options may be added later.
          </p>
          <p>
            <strong className="text-[var(--nec-text)]">Last Updated:</strong> April 2026
          </p>
        </div>
      }
    >
      <BreakoutGame />
    </InventoryShell>
  )
}
