import type { Metadata } from "next"
import dynamic from "next/dynamic"
import InventoryShell from "@/components/games/inventory-shell"

const MemoryGame = dynamic(() => import("@/components/games/memory"))

export const metadata: Metadata = {
  title: "FAQ — NECYPAA XXXVI",
  description:
    "Frequently asked questions about NECYPAA XXXVI, registration, the hotel, and the convention experience.",
}

export default function FAQPage() {
  return (
    <InventoryShell
      badge="FAQ"
      title="Frequently Asked Questions"
      subtitle="Answers to everything you need to know about NECYPAA XXXVI. This page is being assembled by the host committee."
      character="cheshire-cat"
      theme="faq"
      gameName="Matching Principles"
      gameDescription="Match each AA principle to its step. Arrow keys to navigate, Enter or Space to flip. Find all 8 pairs."
    >
      <MemoryGame />
    </InventoryShell>
  )
}
