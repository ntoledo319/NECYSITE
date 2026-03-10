"use client"

import Image from "next/image"
import Link from "next/link"
import { HOTEL_BOOKING_URL } from "@/lib/constants"
import { ArrowRight, ExternalLink } from "lucide-react"

export default function CTASection() {
  return (
    <section aria-label="Register and book hotel" className="px-4 md:px-0 relative">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Register card */}
        <div
          className="relative overflow-hidden rounded-2xl p-7 flex flex-col gap-4"
          style={{
            background: "linear-gradient(135deg, rgba(232,0,110,0.18) 0%, rgba(232,0,110,0.06) 100%)",
            border: "1px solid rgba(232,0,110,0.30)",
          }}
        >
          {/* Logo watermark in card */}
          <div className="absolute -top-4 -right-4 w-[120px] h-[80px] pointer-events-none select-none opacity-[0.06]">
            <Image
              src="/images/necypaa-logo.webp"
              alt=""
              fill
              className="object-contain"
              aria-hidden="true"
            />
          </div>

          <div
            className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-20"
            style={{ background: "var(--nec-pink)", filter: "blur(50px)" }}
          />
          <div className="relative z-10">
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "var(--nec-pink)" }}
            >
              Pre-Registration
            </span>
            <h3 className="text-2xl font-black text-white mt-1">Secure Your Spot</h3>
            <p className="text-sm text-gray-400 mt-2 leading-relaxed">
              Pre-registration is open now at $40. Lock in your spot for NECYPAA XXXVI — Dec 31,
              2026 through Jan 3, 2027 at the Hartford Marriott Downtown.
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span
                className="text-3xl font-black glow-pink"
                style={{ color: "var(--nec-pink)" }}
              >
                $40
              </span>
              <span className="text-sm text-gray-400">pre-registration price</span>
            </div>
          </div>
          <Link href="/register" className="btn-primary self-start mt-1 relative z-10">
            Register Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Hotel card */}
        <div
          className="relative overflow-hidden rounded-2xl p-7 flex flex-col gap-4"
          style={{
            background: "linear-gradient(135deg, rgba(0,212,232,0.14) 0%, rgba(0,212,232,0.04) 100%)",
            border: "1px solid rgba(0,212,232,0.25)",
          }}
        >
          {/* CT state watermark in card */}
          <div className="absolute -bottom-8 -left-8 w-[150px] h-[180px] pointer-events-none select-none opacity-[0.04]">
            <Image
              src="/images/ct-state-art.webp"
              alt=""
              fill
              className="object-contain"
              aria-hidden="true"
            />
          </div>

          <div
            className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-15"
            style={{ background: "var(--nec-cyan)", filter: "blur(50px)" }}
          />
          <div className="relative z-10">
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "var(--nec-cyan)" }}
            >
              Host Hotel
            </span>
            <h3 className="text-2xl font-black text-white mt-1">Hartford Marriott Downtown</h3>
            <p className="text-sm text-gray-400 mt-2 leading-relaxed">
              We have a room block at the Marriott with a special NECYPAA group rate. Book now and
              pay later — rooms go fast around New Year&apos;s Eve.
            </p>
            <p
              className="text-sm font-bold italic mt-2"
              style={{ color: "var(--nec-gold)" }}
            >
              ✦ Book now, pay later — no upfront charge
            </p>
          </div>
          <a
            href={HOTEL_BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary self-start mt-1 relative z-10"
          >
            Book Hotel <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  )
}
