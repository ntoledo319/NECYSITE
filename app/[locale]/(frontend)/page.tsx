import type { Metadata } from "next"
import dynamic from "next/dynamic"
import HeroSection from "@/components/sections/hero-section"
import QuickFactsStrip from "@/components/sections/quick-facts-strip"
import CTASection from "@/components/sections/cta-section"
import SiteFooter from "@/components/site-footer"
import MobileCtaBar from "@/components/mobile-cta-bar"
import OrnateDivider from "@/components/art/ornate-divider"
import ScrollReveal from "@/components/scroll-reveal"
import { EventJsonLd, OrganizationJsonLd } from "@/components/json-ld"

const YpaaNarrativeSection = dynamic(() => import("@/components/sections/ypaa-narrative-section"))
const BusinessMeetingSection = dynamic(() => import("@/components/sections/business-meeting-section"))
const EventsPreviewSection = dynamic(() => import("@/components/sections/events-preview-section"))
const CharacterDivider = dynamic(() => import("@/components/character-divider"))
const AmbientBlobs = dynamic(() => import("@/components/ui/ambient-blobs"))
const ArtAccentCluster = dynamic(() => import("@/components/art/graffiti-elements").then(m => ({ default: m.ArtAccentCluster })))
const GearCluster = dynamic(() => import("@/components/art/steampunk-gears").then(m => ({ default: m.GearCluster })))
const MazePattern = dynamic(() => import("@/components/art/steampunk-gears").then(m => ({ default: m.MazePattern })))
const KeyIcon = dynamic(() => import("@/components/art/steampunk-elements").then(m => ({ default: m.KeyIcon })))
const ClockIcon = dynamic(() => import("@/components/art/steampunk-elements").then(m => ({ default: m.ClockIcon })))

export const metadata: Metadata = {
  title: "NECYPAA XXXVI — Escaping the Mad Realm · Hartford, CT · Dec 31, 2026 – Jan 3, 2027",
  description:
    "Pre-register for $40 — the 36th Northeast Convention of Young People in AA. Hartford Marriott Downtown, Dec 31, 2026 – Jan 3, 2027. Speakers, workshops, fellowship, and more.",
}

export default function HomePage() {
  return (
    <div
      className="min-h-screen min-h-screen-safe flex flex-col relative"
      style={{ backgroundColor: "var(--nec-navy)" }}
    >
      <EventJsonLd />
      <OrganizationJsonLd />

      {/* Page-level ambient vortex glow layer — organic floating drift */}
      <AmbientBlobs />

      {/* ── Main content ──── */}
      <div className="flex-1 pt-0 relative z-10">
        {/* 1. Hero — full-width, no container cap */}
        <div className="mb-6">
          <HeroSection />
        </div>

        {/* 2. Quick facts strip */}
        <ScrollReveal className="container mx-auto px-4 mb-10 relative">
          <QuickFactsStrip />
          {/* Edge art accents */}
          <div className="absolute -top-4 -left-4 pointer-events-none hidden lg:block" aria-hidden="true">
            <GearCluster className="opacity-40" />
          </div>
        </ScrollReveal>

        {/* 3. Primary CTA block */}
        <ScrollReveal className="container mx-auto px-4 mb-12 relative">
          <CTASection />
          {/* Graffiti accent cluster — right side */}
          <div className="absolute -top-8 -right-4 pointer-events-none hidden lg:block" aria-hidden="true">
            <ArtAccentCluster mirror />
          </div>
        </ScrollReveal>

        {/* Ornate gear divider + Mad Hatter */}
        <div className="container mx-auto px-4 mb-2">
          <OrnateDivider variant="gear" color="var(--nec-purple)" />
        </div>
        <div className="container mx-auto px-4 mb-8">
          <CharacterDivider character="mad-hatter" />
        </div>

        {/* 4. What is a YPAA? — narrative section */}
        <ScrollReveal className="container mx-auto px-4 mb-12 relative">
          <YpaaNarrativeSection />
          {/* Floating maze pattern accent */}
          <div className="absolute top-8 -left-8 w-32 h-32 pointer-events-none hidden lg:block" aria-hidden="true">
            <MazePattern className="w-full h-full" opacity={0.05} />
          </div>
          {/* Key accent */}
          <div className="absolute bottom-4 -right-4 pointer-events-none hidden lg:block" aria-hidden="true">
            <KeyIcon size={48} opacity={0.08} />
          </div>
        </ScrollReveal>

        {/* Ornate key divider + Cheshire Cat */}
        <div className="container mx-auto px-4 mb-2">
          <OrnateDivider variant="key" color="var(--nec-pink)" />
        </div>
        <div className="container mx-auto px-4 mb-8">
          <CharacterDivider character="cheshire-cat" flip />
        </div>

        {/* 5. Next business meeting */}
        <ScrollReveal className="container mx-auto px-4 mb-12 relative">
          <BusinessMeetingSection />
          {/* Clock accent */}
          <div className="absolute top-2 -right-6 pointer-events-none hidden lg:block" aria-hidden="true">
            <ClockIcon size={56} opacity={0.07} />
          </div>
        </ScrollReveal>

        {/* Ornate compass divider + Caterpillar */}
        <div className="container mx-auto px-4 mb-2">
          <OrnateDivider variant="compass" color="var(--nec-gold)" />
        </div>
        <div className="container mx-auto px-4 mb-8">
          <CharacterDivider character="caterpillar" />
        </div>

        {/* 6. Events preview — upcoming + recent past with link to full page */}
        <ScrollReveal className="container mx-auto px-4 mb-4 pb-20 md:pb-4 relative">
          <EventsPreviewSection />
          {/* Graffiti accent cluster — left side */}
          <div className="absolute -bottom-4 -left-4 pointer-events-none hidden lg:block" aria-hidden="true">
            <ArtAccentCluster />
          </div>
        </ScrollReveal>

        {/* Final ornate potion divider before footer */}
        <div className="container mx-auto px-4">
          <OrnateDivider variant="potion" color="var(--nec-cyan)" />
        </div>
      </div>

      {/* Footer */}
      <SiteFooter />

      {/* Sticky mobile CTA bar */}
      <MobileCtaBar />
    </div>
  )
}
