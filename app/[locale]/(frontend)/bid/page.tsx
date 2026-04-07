import type { Metadata } from "next"
import dynamic from "next/dynamic"
import InventoryShell from "@/components/games/inventory-shell"
import { NECYPAA_ADVISORY_URL } from "@/lib/constants"

const SpaceInvadersGame = dynamic(() => import("@/components/games/space-invaders"))

export const metadata: Metadata = {
  title: "Start a Bid — NECYPAA XXXVI",
  description: "Learn how to start a bid to host a future NECYPAA convention. Requirements, timeline, process, and resources.",
}

export default function BidPage() {
  return (
    <InventoryShell
      badge="Bidding"
      title="If your area wants to host next, start here."
      subtitle="A future bid should feel possible, but not casual. This page is where the process, expectations, and real committee wisdom will eventually be gathered in one place."
      character="mad-hatter"
      theme="bid"
      dividerVariant="potion"
      statusLabel="Future Host Track"
      statusTitle="The bid page is being prepared as a serious handoff room for the next area that wants to step up."
      statusCopy="When this is finished, it should help a real group move from “we should bid” to an actual plan with people, structure, and enough honesty to know what they are taking on."
      detailItems={[
        { label: "What a bid needs", value: "A willing core team, local support, and enough stamina to stay upright after the excitement wears off", accent: "purple" },
        { label: "What it should answer", value: "Timeline, expectations, guidance, and where to get help before making promises", accent: "gold" },
        { label: "Who it serves", value: "Areas thinking about bidding, not just curious readers passing through", accent: "pink" },
        { label: "Ideal tone", value: "Encouraging but sober about the actual work", accent: "cyan" },
      ]}
      bridgeLinks={[
        {
          href: NECYPAA_ADVISORY_URL,
          label: "NECYPAA Advisory",
          description: "The larger regional body and its resources sit upstream of any serious future bid.",
          external: true,
          accent: "gold",
        },
        {
          href: "/service",
          label: "Service opportunities",
          description: "One of the best ways to understand bidding is to serve long enough to see how a host committee really runs.",
          accent: "purple",
        },
        {
          href: "/journey",
          label: "Watch how this host got built",
          description: "The road to Hartford is a better lesson than abstract advice ever will be.",
          accent: "pink",
        },
      ]}
      notesTitle="What a real bid page should explain"
      notes={[
        {
          title: "Readiness",
          body: "How to tell the difference between a good idea and a bid team with enough structure to survive.",
        },
        {
          title: "Timeline and milestones",
          body: "What needs to happen when, and which parts of the process people usually underestimate.",
        },
        {
          title: "Committee roles",
          body: "The people work behind the title list: who carries the weight and where gaps become expensive.",
        },
        {
          title: "Support and guidance",
          body: "Where a new bid committee can ask for help before reinventing every hard lesson from scratch.",
        },
      ]}
      committeeNote="A page about bidding should make people feel called up, not tricked into something they do not understand."
      portalCaption="Eventually this should feel like a field manual handed from one host committee to the next."
      gameName="Defect Invaders"
      gameDescription="The AA triangle fires spiritual principles at character defects. Arrow keys to move, Space to fire."
      gamePrompt="Future hosts probably need something closer to a manual than a video game. Today, at least, there is a game."
    >
      <SpaceInvadersGame />
    </InventoryShell>
  )
}
