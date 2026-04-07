import type { Metadata } from "next"
import dynamic from "next/dynamic"
import HeroSection from "@/components/sections/hero-section"
import QuickFactsStrip from "@/components/sections/quick-facts-strip"
import CTASection from "@/components/sections/cta-section"
import SiteFooter from "@/components/site-footer"
import MobileCtaBar from "@/components/mobile-cta-bar"
import OrnateDivider from "@/components/art/ornate-divider"
import { EventJsonLd, OrganizationJsonLd } from "@/components/json-ld"

const YpaaNarrativeSection = dynamic(() => import("@/components/sections/ypaa-narrative-section"))
const BusinessMeetingSection = dynamic(() => import("@/components/sections/business-meeting-section"))
const EventsPreviewSection = dynamic(() => import("@/components/sections/events-preview-section"))

export const metadata: Metadata = {
  title: "NECYPAA XXXVI — Escaping the Mad Realm · Hartford, CT · Dec 31, 2026 – Jan 3, 2027",
  description:
    "Pre-register for $40 — the 36th Northeast Convention of Young People in AA. Hartford Marriott Downtown, Dec 31, 2026 – Jan 3, 2027. Speakers, workshops, fellowship, and more.",
}

export default function HomePage() {
  return (
    <div className="relative flex min-h-screen min-h-screen-safe flex-col" style={{ backgroundColor: "var(--nec-navy)" }}>
      <EventJsonLd />
      <OrganizationJsonLd />

      <div className="relative z-10 flex-1">
        <HeroSection />

        <div className="container mx-auto px-4 pb-20 md:pb-12">
          <div className="space-y-16 md:space-y-20">
            <QuickFactsStrip />

            <CTASection />

            <div className="px-2">
              <OrnateDivider variant="key" color="var(--nec-purple)" />
            </div>

            <YpaaNarrativeSection />

            <div className="grid gap-10 xl:grid-cols-[0.86fr_1.14fr] xl:items-start">
              <BusinessMeetingSection />
              <EventsPreviewSection />
            </div>

            <div className="px-2">
              <OrnateDivider variant="compass" color="var(--nec-gold)" />
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
      <MobileCtaBar />
    </div>
  )
}
