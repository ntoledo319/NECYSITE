import type { Metadata } from "next"
import dynamic from "next/dynamic"
import InventoryShell from "@/components/games/inventory-shell"

const PongGame = dynamic(() => import("@/components/games/pong"))

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
      theme="asl"
      gameName="Carry the Message"
      gameDescription="Keep the message going back and forth. ↑ ↓ or mouse to move your paddle. First to 7 wins."
      pageContent={
        <div className="mb-8 space-y-4 leading-relaxed text-[var(--nec-muted)]">
          <p>
            <strong className="text-[var(--nec-text)]">Status:</strong> We are actively coordinating ASL interpretation
            for main speakers and key events.
          </p>
          <p>
            Our commitment is clear: NECYPAA XXXVI must be accessible to all members. We are working with qualified
            interpreters to ensure full access.
          </p>
          <p>
            <strong className="text-[var(--nec-text)]">Request Accommodations:</strong> If you need ASL interpretation
            or have specific accessibility needs, please indicate this during registration or{" "}
            <a href="mailto:info@necypaa.org" className="font-semibold text-[var(--nec-text)] underline">
              contact us directly
            </a>
            .
          </p>
          <p>
            <strong className="text-[var(--nec-text)]">Last Updated:</strong> April 2026
          </p>
        </div>
      }
    >
      <PongGame />
    </InventoryShell>
  )
}
