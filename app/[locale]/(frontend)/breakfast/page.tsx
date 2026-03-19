"use client"

import BreakfastCheckout from "@/components/breakfast-checkout"
import PageArtAccents from "@/components/art/page-art-accents"

export default function BreakfastPage() {
  return (
    <div className="min-h-screen min-h-screen-safe relative" style={{ background: "var(--nec-navy)" }}>
      <PageArtAccents character="caterpillar" accentColor="var(--nec-gold)" variant="subtle" dividerVariant="compass" />
      <div className="container mx-auto px-4 pt-24 pb-12 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1
              className="text-3xl md:text-4xl font-black text-white mb-2"
              style={{ textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}
            >
              Breakfast Ticket Checkout
            </h1>
            <p className="text-lg font-bold" style={{ color: "var(--nec-gold)" }}>NECYPAA XXXVI</p>

          </div>

          <BreakfastCheckout />
        </div>
      </div>
    </div>
  )
}
