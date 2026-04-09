"use client"

import BreakfastCheckout from "@/components/breakfast-checkout"
import PageArtAccents from "@/components/art/page-art-accents"
import SiteFooter from "@/components/site-footer"
import MobileCtaBar from "@/components/mobile-cta-bar"

export default function BreakfastPage() {
  return (
    <div className="min-h-screen min-h-screen-safe relative flex flex-col bg-[var(--nec-navy)]">
      <PageArtAccents character="caterpillar" accentColor="var(--nec-gold)" variant="subtle" dividerVariant="compass" />
      <div className="container mx-auto px-4 pt-24 pb-12 relative z-10 flex-1">
        <div className="max-w-3xl mx-auto">
          <div
            className="relative mb-8 overflow-hidden rounded-[2rem] border px-6 py-8 text-center shadow-[0_22px_48px_rgba(44,24,16,0.08)] md:px-8"
            style={{
              background: "rgba(var(--nec-card-rgb),0.78)",
              borderColor: "rgba(var(--nec-gold-rgb),0.14)",
            }}
          >
            <div
              className="absolute inset-x-0 top-0 h-[3px]"
              aria-hidden="true"
              style={{
                background:
                  "linear-gradient(90deg, rgba(var(--nec-gold-rgb),0) 0%, rgba(var(--nec-gold-rgb),0.5) 45%, rgba(var(--nec-purple-rgb),0.45) 100%)",
              }}
            />
            <h1 className="page-enter-1 nec-heading-shadow mb-2 text-3xl font-black text-[var(--nec-text)] md:text-4xl">
              Breakfast Ticket Checkout
            </h1>
            <p className="page-enter-2 text-lg font-bold text-[var(--nec-gold)]">NECYPAA XXXVI</p>
          </div>

          <div className="nec-breakfast-info mb-6 rounded-[1.6rem] p-5 text-sm leading-relaxed">
            <p className="mb-2">
              <strong className="text-[var(--nec-text)]">New Year's Day Breakfast</strong> — Start your morning with fellowship and a great meal at the Hartford Marriott Downtown.
            </p>
            <p>
              Dietary accommodations available. Select your dates below and check out securely.
            </p>
          </div>

          <BreakfastCheckout />
        </div>
      </div>
      <SiteFooter />
      <MobileCtaBar />
    </div>
  )
}
