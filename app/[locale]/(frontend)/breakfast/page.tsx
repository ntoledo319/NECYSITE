"use client"

import BreakfastCheckout from "@/components/breakfast-checkout"
import PageArtAccents from "@/components/art/page-art-accents"

export default function BreakfastPage() {
  return (
    <div className="min-h-screen min-h-screen-safe relative bg-[var(--nec-navy)]">
      <PageArtAccents character="caterpillar" accentColor="var(--nec-gold)" variant="subtle" dividerVariant="compass" />
      <div className="container mx-auto px-4 pt-24 pb-12 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-black text-[var(--nec-text)] mb-2 nec-heading-shadow">
              Breakfast Ticket Checkout
            </h1>
            <p className="text-lg font-bold text-[var(--nec-gold)]">NECYPAA XXXVI</p>

          </div>

          <div className="nec-breakfast-info rounded-xl p-5 mb-6 text-sm leading-relaxed">
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
    </div>
  )
}
