import HeroSection from "@/components/sections/hero-section"
import QuickFactsStrip from "@/components/sections/quick-facts-strip"
import CTASection from "@/components/sections/cta-section"
import PurposeSection from "@/components/sections/purpose-section"
import BusinessMeetingSection from "@/components/sections/business-meeting-section"
import MeetingsSection from "@/components/sections/meetings-section"
import PastEventsSection from "@/components/sections/past-events-section"
import SiteFooter from "@/components/site-footer"
import MobileCtaBar from "@/components/mobile-cta-bar"
import SectionDivider from "@/components/section-divider"

export default function HomePage() {
  return (
    <div
      className="min-h-screen flex flex-col relative"
      style={{ backgroundColor: "var(--nec-navy)" }}
    >
      {/* Page-level ambient neon glow layer */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute -top-40 -left-40 w-[900px] h-[900px] rounded-full opacity-[0.05]"
          style={{
            background: "radial-gradient(circle, var(--nec-cyan) 0%, transparent 65%)",
            filter: "blur(120px)",
          }}
        />
        <div
          className="absolute top-[30%] -right-20 w-[700px] h-[700px] rounded-full opacity-[0.04]"
          style={{
            background: "radial-gradient(circle, var(--nec-pink) 0%, transparent 65%)",
            filter: "blur(120px)",
          }}
        />
        <div
          className="absolute bottom-[10%] left-[20%] w-[600px] h-[600px] rounded-full opacity-[0.04]"
          style={{
            background: "radial-gradient(circle, var(--nec-orange) 0%, transparent 65%)",
            filter: "blur(120px)",
          }}
        />
      </div>

      {/* ── Main content – padded for sticky header ──── */}
      <main className="flex-1 pt-20 relative z-10">
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

        {/* Divider - glow variant */}
        <div className="container mx-auto px-4 mb-16">
          <SectionDivider variant="glow" />
        </div>

        {/* 4. Purpose / What is NECYPAA */}
        <div className="container mx-auto px-4 mb-16">
          <PurposeSection />
        </div>

        {/* Divider - accent variant */}
        <div className="container mx-auto px-4 mb-16">
          <SectionDivider variant="accent" />
        </div>

        {/* 5. Next business meeting */}
        <div className="container mx-auto px-4 mb-16">
          <BusinessMeetingSection />
        </div>

        {/* Divider - subtle variant */}
        <div className="container mx-auto px-4 mb-16">
          <SectionDivider variant="subtle" />
        </div>

        {/* 6. Young people's meetings */}
        <div className="container mx-auto px-4 mb-16">
          <MeetingsSection />
        </div>

        {/* Divider - glow variant */}
        <div className="container mx-auto px-4 mb-16">
          <SectionDivider variant="glow" />
        </div>

        {/* 7. Past events archive */}
        <div className="container mx-auto px-4 mb-4 pb-20 md:pb-4">
          <PastEventsSection />
        </div>
      </main>

      {/* Footer */}
      <SiteFooter />

      {/* Sticky mobile CTA bar */}
      <MobileCtaBar />
    </div>
  )
}
