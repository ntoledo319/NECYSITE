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
    "The 36th Northeast Convention of Young People in AA. Hartford Marriott Downtown, Dec 31, 2026 – Jan 3, 2027. Speakers, workshops, fellowship, and more.",
}

export default function HomePage() {
  return (
    <div className="relative flex min-h-screen min-h-screen-safe flex-col" style={{ backgroundColor: "var(--nec-navy)" }}>
      <EventJsonLd />
      <OrganizationJsonLd />

      <div className="relative z-10 flex-1">
        <HeroSection />

        <div className="container mx-auto px-4">
          <div className="relative pb-14 md:pb-16">
            <QuickFactsStrip />
          </div>

          <div className="relative pb-16 md:pb-20">
            <CTASection />
          </div>

          <div className="mx-auto max-w-5xl px-2 pb-10 md:pb-12">
            <OrnateDivider variant="key" color="var(--nec-purple)" />
          </div>

          <div className="relative pb-20 md:pb-24">
            <YpaaNarrativeSection />
          </div>

          <div className="mx-auto max-w-5xl px-2 pb-10 md:pb-12">
            <OrnateDivider variant="compass" color="var(--nec-gold)" />
          </div>

          <div className="relative pb-16 md:pb-20">
            <div className="grid gap-10 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] xl:items-start xl:gap-12">
              <BusinessMeetingSection />
              <EventsPreviewSection />
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
      <MobileCtaBar />
    </div>
  )
}
