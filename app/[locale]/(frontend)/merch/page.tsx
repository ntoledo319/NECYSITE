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
      title="Wear the weekend home with you."
      subtitle="Merchandise should feel like a souvenir from a specific convention, not generic conference swag. This page will hold the pieces worth lining up for when the first drop is ready."
      character="mad-hatter"
      dividerVariant="key"
      statusLabel="Merch Bench"
      statusTitle="The merch table is being built with real poster energy, not throwaway filler."
      statusCopy="As the host committee locks the art applications and quantities, this page becomes the place for previews, pricing, pickup details, and the drops that actually deserve attention."
      detailItems={[
        { label: "Likely drops", value: "Shirts, hoodies, stickers, posters, and one or two oddball keepsakes", accent: "purple" },
        { label: "Why it matters", value: "Fundraising for the convention, yes, but also memory-making after the weekend ends", accent: "gold" },
        { label: "Pickup rhythm", value: "Expect on-site pickup and limited quantities once the store opens", accent: "pink" },
        { label: "Design standard", value: "Poster art first, merch second. Nothing should feel mass-generated.", accent: "cyan" },
      ]}
      bridgeLinks={[
        {
          href: "/blog",
          label: "Read the host committee voice",
          description: "The tone of the merch should sound like the committee writing, not a print-on-demand store.",
          accent: "pink",
        },
        {
          href: "/events",
          label: "Follow the road to Hartford",
          description: "Every fundraiser and every night out adds more context to what the merch should commemorate.",
          accent: "purple",
        },
        {
          href: "/register",
          label: "Register before you shop",
          description: "The real flex is already having your weekend booked when the merch drops go live.",
          accent: "gold",
        },
      ]}
      notesTitle="What this shop should carry"
      notes={[
        {
          title: "Pieces with poster DNA",
          body: "The strongest items should feel like they came from the Mad Realm world itself, not a blank tee plus logo.",
        },
        {
          title: "Small keepsakes",
          body: "Stickers, prints, and low-friction pieces that still feel specific enough to keep after the weekend.",
        },
        {
          title: "Pickup clarity",
          body: "Exactly where to buy, where to collect, and what sells out first so nobody feels jerked around.",
        },
        {
          title: "Proceeds with purpose",
          body: "A clear line between what you spend here and what that support does for the convention.",
        },
      ]}
      committeeNote="If it would look at home in any random merch tab, it does not belong here."
      portalCaption="This page should eventually read like a merch wall in the lobby, not a forgotten Shopify stub."
      gameName="Wall of Denial"
      gameDescription="Break through the Wall of Denial. Mouse/touch or ← → to move the paddle. Space or click to launch."
      gamePrompt="If you came looking for the merch drop before it landed, at least there’s a wall here you can actually break."
    >
      <BreakoutGame />
    </InventoryShell>
  )
}
