import type { Metadata } from "next"
import InventoryShell from "@/components/games/inventory-shell"
import TetrisGame from "@/components/games/tetris"

export const metadata: Metadata = {
  title: "Program — NECYPAA XXXVI",
  description: "Convention program and schedule for NECYPAA XXXVI. Hartford Marriott Downtown, Dec 31, 2026 – Jan 3, 2027.",
}

export default function ProgramPage() {
  return (
    <InventoryShell
      badge="Program"
      title="Convention Program"
      subtitle="Four days of speakers, workshops, meetings, and fellowship. The full schedule will be posted here as the convention approaches."
      character="cheshire-cat"
      gameName="Recovery Blocks"
      gameDescription="Build your program one block at a time. Each piece carries a recovery slogan. ← → move, ↑ rotate, Space hard drop."
    >
      <TetrisGame />
    </InventoryShell>
  )
}
