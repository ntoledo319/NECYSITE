import type { Metadata } from "next"
import dynamic from "next/dynamic"
import HeroSection from "@/components/sections/hero-section"
import QuickFactsStrip from "@/components/sections/quick-facts-strip"
import SiteFooter from "@/components/site-footer"
import MobileCtaBar from "@/components/mobile-cta-bar"
import OrnateDivider from "@/components/art/ornate-divider"
import ScrollReveal from "@/components/scroll-reveal"
import { EventJsonLd, OrganizationJsonLd } from "@/components/json-ld"

const YpaaNarrativeSection = dynamic(() => import("@/components/sections/ypaa-narrative-section"))
const BusinessMeetingSection = dynamic(() => import("@/components/sections/business-meeting-section"))
const EventsPreviewSection = dynamic(() => import("@/components/sections/events-preview-section"))

export const metadata: Metadata = {
  title: "NECYPAA XXXVI — Escaping the Mad Realm · Hartford, CT · Dec 31, 2026 – Jan 3, 2027",
  description:
    "The 36th Northeast Convention of Young People in AA. Hartford Marriott Downtown, Dec 31, 2026 – Jan 3, 2027. Speakers, workshops, fellowship, and more.",
}

export default function HomePage() {
  return (
    <div
      className="relative flex min-h-screen min-h-screen-safe flex-col"
      style={{ backgroundColor: "var(--nec-navy)" }}
    >
      <EventJsonLd />
      <OrganizationJsonLd />

      <div className="relative z-10 flex-1">
        {/* Hero — poster fills viewport as atmosphere, content materializes */}
        <HeroSection />

        {/* What is a YPAA? — the emotional core, story before logistics */}
        <ScrollReveal className="relative container mx-auto px-4 pt-10 mb-14 md:pt-14">
          <YpaaNarrativeSection />
        </ScrollReveal>

        <div className="container mx-auto px-4 mb-12">
          <OrnateDivider variant="gear" color="var(--nec-purple)" />
        </div>

        {/* Quick facts strip */}
        <ScrollReveal className="container mx-auto px-4 mb-14">
          <QuickFactsStrip />
        </ScrollReveal>

        <div className="container mx-auto px-4 mb-12">
          <OrnateDivider variant="key" color="var(--nec-pink)" />
        </div>

        {/* Next business meeting */}
        <ScrollReveal className="section-atmosphere-gold relative container mx-auto px-4 mb-14">
          <BusinessMeetingSection />
        </ScrollReveal>

        <div className="container mx-auto px-4 mb-12">
          <OrnateDivider variant="compass" color="var(--nec-gold)" />
        </div>

        {/* Events preview */}
        <ScrollReveal className="relative container mx-auto px-4 mb-6 pb-20 md:pb-6">
          <EventsPreviewSection />
        </ScrollReveal>

        <div className="container mx-auto px-4">
          <OrnateDivider variant="potion" color="var(--nec-cyan)" />
        </div>
      </div>

      <SiteFooter />
      <MobileCtaBar />
    </div>
  )
}
