import HeroSection from "@/components/sections/hero-section"
import QuickFactsStrip from "@/components/sections/quick-facts-strip"
import CTASection from "@/components/sections/cta-section"
import YpaaNarrativeSection from "@/components/sections/ypaa-narrative-section"
import BusinessMeetingSection from "@/components/sections/business-meeting-section"
import MeetingsSection from "@/components/sections/meetings-section"
import EventsPreviewSection from "@/components/sections/events-preview-section"
import SiteFooter from "@/components/site-footer"
import MobileCtaBar from "@/components/mobile-cta-bar"
import CharacterDivider from "@/components/character-divider"

export default function HomePage() {
  return (
    <div
      className="min-h-screen flex flex-col relative"
      style={{ backgroundColor: "var(--nec-navy)" }}
    >
      {/* Page-level ambient vortex glow layer */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute -top-40 -left-40 w-[900px] h-[900px] rounded-full opacity-[0.06]"
          style={{
            background: "radial-gradient(circle, var(--nec-purple) 0%, transparent 65%)",
            filter: "blur(120px)",
          }}
        />
        <div
          className="absolute top-[30%] -right-20 w-[700px] h-[700px] rounded-full opacity-[0.05]"
          style={{
            background: "radial-gradient(circle, var(--nec-pink) 0%, transparent 65%)",
            filter: "blur(120px)",
          }}
        />
        <div
          className="absolute bottom-[10%] left-[20%] w-[600px] h-[600px] rounded-full opacity-[0.04]"
          style={{
            background: "radial-gradient(circle, var(--nec-gold) 0%, transparent 65%)",
            filter: "blur(120px)",
          }}
        />
      </div>

      {/* ── Main content ──── */}
      <div className="flex-1 pt-4 relative z-10">
        {/* 1. Hero — full-width, no container cap */}
        <div className="mb-8">
          <HeroSection />
        </div>

        {/* 2. Quick facts strip */}
        <div className="container mx-auto px-4 mb-8">
          <QuickFactsStrip />
        </div>

        {/* 3. Primary CTA block */}
        <div className="container mx-auto px-4 mb-16">
          <CTASection />
        </div>

        {/* Divider — Mad Hatter leads you into the narrative */}
        <div className="container mx-auto px-4 mb-16">
          <CharacterDivider character="mad-hatter" />
        </div>

        {/* 4. What is a YPAA? — narrative section */}
        <div className="container mx-auto px-4 mb-16">
          <YpaaNarrativeSection />
        </div>

        {/* Divider — Cheshire Cat grins between sections */}
        <div className="container mx-auto px-4 mb-16">
          <CharacterDivider character="cheshire-cat" flip />
        </div>

        {/* 5. Next business meeting */}
        <div className="container mx-auto px-4 mb-16">
          <BusinessMeetingSection />
        </div>

        {/* Divider — Caterpillar guides the way */}
        <div className="container mx-auto px-4 mb-16">
          <CharacterDivider character="caterpillar" />
        </div>

        {/* 6. Young people's meetings */}
        <div className="container mx-auto px-4 mb-16">
          <MeetingsSection />
        </div>

        {/* Divider — Mad Hatter leads into events */}
        <div className="container mx-auto px-4 mb-16">
          <CharacterDivider character="mad-hatter" flip />
        </div>

        {/* 7. Events preview — upcoming + recent past with link to full page */}
        <div className="container mx-auto px-4 mb-4 pb-20 md:pb-4">
          <EventsPreviewSection />
        </div>
      </div>

      {/* Footer */}
      <SiteFooter />

      {/* Sticky mobile CTA bar */}
      <MobileCtaBar />
    </div>
  )
}
