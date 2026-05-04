import type { Metadata } from "next"
import dynamic from "next/dynamic"
import InventoryShell from "@/components/games/inventory-shell"

const TetrisGame = dynamic(() => import("@/components/games/tetris"))

export const metadata: Metadata = {
  title: "Program — NECYPAA XXXVI",
  description:
    "Convention program and schedule for NECYPAA XXXVI. Hartford Marriott Downtown, Dec 31, 2026 – Jan 3, 2027.",
}

export default function ProgramPage() {
  return (
    <InventoryShell
      badge="Program"
      title="Convention Program"
      subtitle="Four days of speakers, workshops, meetings, and fellowship. The full schedule will be posted here as the convention approaches."
      character="cheshire-cat"
      theme="program"
      gameName="Recovery Blocks"
      gameDescription="Build your program one block at a time. Each piece carries a recovery slogan. ← → move, ↑ rotate, Space hard drop."
      pageContent={
        <div className="mb-8 space-y-4 leading-relaxed text-[var(--nec-muted)]">
          <p>
            <strong className="text-[var(--nec-text)]">Status:</strong> We are currently building the schedule for
            NECYPAA XXXVI. Expect a full weekend of speakers, panels, marathon meetings, and entertainment.
          </p>
          <p>
            <strong className="text-[var(--nec-text)]">Attendees:</strong> We anticipate 500+ young people in AA from
            across the Northeast.
          </p>
          <p>
            <strong className="text-[var(--nec-text)]">Last Updated:</strong> April 2026
          </p>
          <p>
            Got a question or want to get involved with programming?{" "}
            <a href="mailto:info@necypaa.org" className="font-semibold text-[var(--nec-text)] underline">
              Contact the committee
            </a>
            .
          </p>
        </div>
      }
    >
      <TetrisGame />
    </InventoryShell>
  )
}
