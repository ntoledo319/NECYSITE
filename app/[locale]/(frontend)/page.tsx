import type { Metadata } from "next"
import dynamic from "next/dynamic"
import HeroSection from "@/components/sections/hero-section"
import QuickFactsStrip from "@/components/sections/quick-facts-strip"
import BusinessMeetingSection from "@/components/sections/business-meeting-section"
import SiteFooter from "@/components/site-footer"
import MobileCtaBar from "@/components/mobile-cta-bar"
import OrnateDivider from "@/components/art/ornate-divider"
import ScrollReveal from "@/components/scroll-reveal"
import { EventJsonLd, OrganizationJsonLd } from "@/components/json-ld"
import { fetchCalendarEvents } from "@/lib/calendar/fetch"
import { getEvents } from "@/lib/data/fetch-utils"

const YpaaNarrativeSection = dynamic(() => import("@/components/sections/ypaa-narrative-section"))
const EventsPreviewSection = dynamic(() => import("@/components/sections/events-preview-section"))

export const metadata: Metadata = {
  title: "NECYPAA XXXVI — Escaping the Mad Realm · Hartford, CT · Dec 31, 2026 – Jan 3, 2027",
  description:
    "The 36th Northeast Convention of Young People in AA. Hartford Marriott Downtown, Dec 31, 2026 – Jan 3, 2027. Speakers, workshops, fellowship, and more.",
}

export default async function HomePage() {
  const hostEvents = await getEvents()
  const events = await fetchCalendarEvents()
  const now = new Date()
  const nextBusinessMeeting = events.find((e) => e.category === "host-business" && new Date(e.start) >= now)

  return (
    <div
      className="min-h-screen-safe relative flex min-h-screen flex-col"
      style={{ backgroundColor: "var(--nec-navy)" }}
    >
      <EventJsonLd />
      <OrganizationJsonLd />

      <div className="relative z-10 flex-1">
        <HeroSection />

        <ScrollReveal className="container relative mx-auto mb-14 px-4 pt-10 md:pt-14">
          <YpaaNarrativeSection />
        </ScrollReveal>

        <div className="container mx-auto mb-12 px-4">
          <OrnateDivider variant="gear" color="var(--nec-purple)" />
        </div>

        <ScrollReveal className="container mx-auto mb-14 px-4">
          <QuickFactsStrip />
        </ScrollReveal>

        <div className="container mx-auto mb-12 px-4">
          <OrnateDivider variant="key" color="var(--nec-pink)" />
        </div>

        <ScrollReveal className="section-atmosphere-gold container relative mx-auto mb-14 px-4">
          <BusinessMeetingSection nextMeeting={nextBusinessMeeting} />
        </ScrollReveal>

        <div className="container mx-auto mb-12 px-4">
          <OrnateDivider variant="compass" color="var(--nec-gold)" />
        </div>

        <ScrollReveal className="container relative mx-auto mb-6 px-4 pb-20 md:pb-6">
          <EventsPreviewSection upcomingEvent={hostEvents.upcoming} pastEvents={hostEvents.past} />
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
