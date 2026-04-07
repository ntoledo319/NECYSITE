import type { Metadata } from "next"
import SiteFooter from "@/components/site-footer"
import MobileCtaBar from "@/components/mobile-cta-bar"
import BlogGrid from "@/components/blog-grid"
import PageArtAccents from "@/components/art/page-art-accents"
import MotionHeader from "@/components/ui/motion-header"

export const metadata: Metadata = {
  title: "NECYBLOG aka BLOGYPAA — NECYPAA XXXVI",
  description:
    "Experience, strength, and hope from the NECYPAA XXXVI CT Host Committee. Anonymous stories from the road to Hartford.",
}

export default function BlogPage() {
  return (
    <div
      className="min-h-screen min-h-screen-safe flex flex-col relative"
      style={{ backgroundColor: "var(--nec-navy)" }}
    >
      <PageArtAccents character="caterpillar" accentColor="var(--nec-gold)" dividerVariant="compass" />

      <div className="flex-1 pt-24 pb-20 md:pb-12 relative z-10">
        <div className="container mx-auto px-4">
          {/* ── Page Header ────────────────────────── */}
          <MotionHeader className="max-w-3xl mx-auto text-center mb-16">
            <span className="section-badge mb-4 inline-block">NECYBLOG</span>
            <h1 className="section-heading mb-2">
              NECYBLOG{" "}
              <span className="block text-lg sm:text-xl font-bold mt-1 text-[var(--nec-pink)]">
                aka BLOGYPAA
              </span>
            </h1>

            {/* Accent divider */}
            <div
              className="mx-auto my-6 h-[2px] w-24 rounded-full"
              aria-hidden="true"
              style={{
                background:
                  "linear-gradient(90deg, var(--nec-purple), var(--nec-pink), var(--nec-gold))",
                boxShadow:
                  "0 0 12px rgba(var(--nec-purple-rgb),0.15), 0 0 24px rgba(var(--nec-pink-rgb),0.08)",
              }}
            />

            <div className="space-y-4 text-base sm:text-lg leading-relaxed text-[var(--nec-muted)]">
              <p>
                It is our hope for this to be a place where everyone involved in
                the creation of this convention gets a few opportunities to
                anonymously share their experience, strength, and hope as it
                relates to happenings with this service structure.
              </p>
              <p
                className="font-semibold text-[var(--nec-text)] italic"
              >
                Take what works, vibe with the rest.
              </p>
              <p>
                We do take the liberty of scrubbing any accidental tradition
                violations from the content.
              </p>
              <p>
                Aside from that, here you&apos;ll get everyone on
                host&apos;s raw, unfiltered takes, so help us HP.
              </p>
            </div>
          </MotionHeader>

          {/* ── Blog Cards Grid ────────────────────── */}
          <BlogGrid />
        </div>
      </div>

      <SiteFooter />
      <MobileCtaBar />
    </div>
  )
}
