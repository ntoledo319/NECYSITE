"use client"

import BreakfastCheckout from "@/components/breakfast-checkout"

export default function BreakfastPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--nec-navy)" }}>
      <div className="container mx-auto px-4 pt-24 pb-12">
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
