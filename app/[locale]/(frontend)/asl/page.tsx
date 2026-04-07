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
      title="Access to the message matters."
      subtitle="This page is where interpretation details, signing resources, and practical ASL information will live as the committee confirms coverage for the convention."
      character="cheshire-cat"
      dividerVariant="key"
      statusLabel="Access Coordination"
      statusTitle="The ASL page is being built as a usable access hub, not a token mention buried in the footer."
      statusCopy="As requests come in and interpretation plans are finalized, this page will hold the clearest version of what is available, how to ask for support, and where signed access is being prioritized."
      detailItems={[
        { label: "Primary purpose", value: "Give Deaf and hard-of-hearing attendees a real path to request and understand support", accent: "cyan" },
        { label: "Likely coverage", value: "Priority sessions, large gatherings, and the most planning-sensitive moments", accent: "pink" },
        { label: "Where to ask", value: "Through the accessibility process so nothing gets lost in the shuffle", accent: "purple" },
        { label: "Design standard", value: "Clarity first. No hidden details, no vague promises, no access theater.", accent: "gold" },
      ]}
      bridgeLinks={[
        {
          href: "/accessibility",
          label: "Accessibility page",
          description: "The broader accommodations picture lives here until the ASL resource board is complete.",
          accent: "cyan",
        },
        {
          href: "/register",
          label: "Registration flow",
          description: "The current registration process already gives people a way to flag interpretation and support needs.",
          accent: "purple",
        },
        {
          href: "mailto:info@necypaa.org?subject=ASL%20Support%20for%20NECYPAA%20XXXVI",
          label: "Email the committee directly",
          description: "If you already know what support you need, reach out now so the committee can plan around something real.",
          external: true,
          accent: "gold",
        },
      ]}
      notesTitle="What this page will hold"
      notes={[
        {
          title: "Request guidance",
          body: "How to tell the committee what you need early enough for it to be actionable, not reactive.",
        },
        {
          title: "Coverage details",
          body: "Which spaces are interpreted, which are still pending, and what people should not have to guess about.",
        },
        {
          title: "On-site wayfinding",
          body: "The practical side: where to go, who to ask for, and what is available once the weekend is underway.",
        },
        {
          title: "Related resources",
          body: "A clear bridge into the broader accessibility work without burying ASL inside a catch-all page forever.",
        },
      ]}
      committeeNote="The right version of this page is quiet, explicit, and trustworthy. No one should have to decode it."
      portalCaption="This room should become one of the clearest pages on the site because access breaks the fastest when wording gets vague."
      gameName="Carry the Message"
      gameDescription="Keep the message going back and forth. ↑ ↓ or mouse to move your paddle. First to 7 wins."
      gamePrompt="The actual goal is access. Until that board is fully in place, there is at least a paddle you can keep in play."
    >
      <PongGame />
    </InventoryShell>
  )
}
