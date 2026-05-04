"use client"

import Image from "next/image"
import Link from "next/link"
import { HOTEL_BOOKING_URL } from "@/lib/constants"
import { ArrowRight, ExternalLink } from "lucide-react"
import { SpotlightCard, TiltCard, MagneticButton } from "@/components/ui/motion-primitives"

export default function CTASection() {
  return (
    <section aria-label="Register and book hotel" className="relative px-4 md:px-0">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Register card — spotlight tracks cursor, tilt on hover */}
        <TiltCard className="rounded-2xl" tiltDegree={4} glareOpacity={0.06}>
          <SpotlightCard
            className="nec-cta-card nec-cta-card-purple nec-card-lift rounded-2xl"
            spotlightColor="rgba(124,58,237,0.15)"
            spotlightSize={400}
          >
            <div className="relative flex flex-col gap-5 overflow-hidden rounded-2xl p-8 backdrop-blur-sm">
              <div
                className="absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-15"
                style={{ background: "var(--nec-purple)", filter: "blur(60px)" }}
                aria-hidden="true"
              />
              {/* Decorative logo watermark */}
              <div
                className="pointer-events-none absolute -bottom-8 -right-8 h-40 w-40 opacity-[0.06]"
                aria-hidden="true"
              >
                <Image
                  src="/images/mad-realm-logo-no-bg.webp"
                  alt=""
                  width={160}
                  height={160}
                  sizes="160px"
                  className="h-full w-full object-contain"
                  aria-hidden="true"
                />
              </div>
              <div className="relative z-10">
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--nec-purple)" }}>
                  Pre-Registration Open
                </span>
                <h3 className="mt-1 text-2xl font-black text-white md:text-3xl">Secure Your Spot</h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--nec-muted)]">
                  Pre-registration is open for NECYPAA XXXVI — Dec 31, 2026 through Jan 3, 2027 at the Hartford Marriott
                  Downtown. Lock in your spot before the holiday weekend.
                </p>
              </div>
              <MagneticButton className="relative z-10 mt-1 self-start" strength={0.2}>
                <Link href="/register" className="btn-primary">
                  Register Now <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </MagneticButton>
            </div>
          </SpotlightCard>
        </TiltCard>

        {/* Hotel card — gold spotlight, tilt on hover */}
        <TiltCard className="rounded-2xl" tiltDegree={4} glareOpacity={0.06}>
          <SpotlightCard
            className="nec-cta-card nec-cta-card-gold nec-card-lift rounded-2xl"
            spotlightColor="rgba(212,160,23,0.12)"
            spotlightSize={400}
          >
            <div className="relative flex flex-col gap-5 overflow-hidden rounded-2xl p-8 backdrop-blur-sm">
              <div
                className="opacity-12 absolute -right-16 -top-16 h-48 w-48 rounded-full"
                style={{ background: "var(--nec-gold)", filter: "blur(60px)" }}
                aria-hidden="true"
              />
              <div className="relative z-10">
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--nec-gold)" }}>
                  Host Hotel
                </span>
                <h3 className="mt-1 text-2xl font-black text-white md:text-3xl">Hartford Marriott Downtown</h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--nec-muted)]">
                  We have a room block at the Marriott with a special NECYPAA group rate. Rooms go fast around New
                  Year&apos;s Eve — reserve yours early.
                </p>
                <p className="mt-3 text-sm font-bold italic" style={{ color: "var(--nec-gold)" }}>
                  <span aria-hidden="true">✦</span> Special NECYPAA group rate available
                </p>
              </div>
              <MagneticButton className="relative z-10 mt-1 self-start" strength={0.2}>
                <a href={HOTEL_BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                  Book Hotel <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only"> (opens in new tab)</span>
                </a>
              </MagneticButton>
            </div>
          </SpotlightCard>
        </TiltCard>
      </div>
    </section>
  )
}
