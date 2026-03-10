"use client"

import Image from "next/image"
import Link from "next/link"
import { HOTEL_BOOKING_URL } from "@/lib/constants"

export default function HeroSection() {
  return (
    <section 
      aria-label="NECYPAA XXXVi Convention Hero" 
      className="relative overflow-hidden px-4 md:px-0"
    >
      {/* Background ambient glow blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute -top-20 -left-20 w-[600px] h-[600px] rounded-full opacity-[0.08]"
          style={{ 
            background: "radial-gradient(circle, var(--nec-cyan) 0%, transparent 70%)",
            filter: "blur(80px)"
          }} 
        />
        <div 
          className="absolute top-1/2 -right-40 w-[500px] h-[500px] rounded-full opacity-[0.06]"
          style={{ 
            background: "radial-gradient(circle, var(--nec-pink) 0%, transparent 70%)",
            filter: "blur(80px)"
          }} 
        />
        <div 
          className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full opacity-[0.05]"
          style={{ 
            background: "radial-gradient(circle, var(--nec-orange) 0%, transparent 70%)",
            filter: "blur(80px)"
          }} 
        />
      </div>

      {/* CSS-only paint splatter texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="absolute top-[20%] left-[10%] w-4 h-4 rounded-full bg-cyan-400" />
        <div className="absolute top-[30%] left-[25%] w-2 h-2 rounded-full bg-pink-500" />
        <div className="absolute top-[15%] left-[60%] w-3 h-3 rounded-full bg-orange-400" />
        <div className="absolute top-[45%] left-[75%] w-2 h-2 rounded-full bg-cyan-400" />
        <div className="absolute top-[60%] left-[15%] w-3 h-3 rounded-full bg-pink-500" />
        <div className="absolute top-[70%] left-[45%] w-2 h-2 rounded-full bg-orange-400" />
        <div className="absolute top-[50%] left-[80%] w-4 h-4 rounded-full bg-cyan-400" />
        <div className="absolute top-[80%] left-[20%] w-2 h-2 rounded-full bg-pink-500" />
        <div className="absolute top-[35%] left-[5%] w-3 h-3 rounded-full bg-orange-400" />
        <div className="absolute top-[65%] left-[65%] w-2 h-2 rounded-full bg-cyan-400" />
      </div>

      {/* Main hero composition */}
      <div className="relative z-10">
        {/* Desktop: Two-column layout */}
        <div className="hidden md:grid md:grid-cols-12 md:gap-6 md:items-center md:min-h-[500px]">
          {/* Left column: Logo, location, dates */}
          <div className="md:col-span-7 lg:col-span-6 flex flex-col gap-6">
            {/* Main graffiti logo */}
            <div className="relative">
              <Image
                src="/images/necypaa-logo.webp"
                alt="NECYPAA XXXVi"
                width={600}
                height={400}
                className="w-full max-w-[550px] h-auto"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Glow shadow behind logo */}
              <div 
                className="absolute -inset-4 -z-10 rounded-full opacity-30 blur-3xl"
                style={{ 
                  background: "linear-gradient(135deg, var(--nec-pink) 0%, var(--nec-cyan) 100%)"
                }} 
              />
            </div>

            {/* Location text graphic */}
            <div className="mt-2">
              <Image
                src="/images/hartford-ct-text.webp"
                alt="Hartford, Connecticut"
                width={400}
                height={200}
                className="w-full max-w-[350px] h-auto"
                priority
                sizes="(max-width: 768px) 80vw, 350px"
              />
            </div>

            {/* Dates strip */}
            <div className="mt-1">
              <Image
                src="/images/event-dates.webp"
                alt="December 31, 2026 through January 3, 2027"
                width={500}
                height={50}
                className="w-full max-w-[450px] h-auto"
                priority
                sizes="(max-width: 768px) 90vw, 450px"
              />
            </div>

            {/* Pre-reg price badge */}
            <div className="mt-4 flex items-center gap-4">
              <div 
                className="px-5 py-3 rounded-xl font-black text-2xl uppercase tracking-wide"
                style={{ 
                  background: "var(--nec-pink)",
                  color: "white",
                  boxShadow: "0 4px 20px rgba(232,0,110,0.4)"
                }}
              >
                Pre-Reg $40
              </div>
              <p className="text-sm text-gray-400 max-w-[200px] leading-tight">
                Limited pre-registration pricing. Lock in your spot now.
              </p>
            </div>
          </div>

          {/* Right column: CT state art floating accent */}
          <div className="md:col-span-5 lg:col-span-6 relative">
            <div className="relative transform rotate-3">
              <Image
                src="/images/ct-state-art.webp"
                alt="Connecticut state outline with NECYPAA event details"
                width={500}
                height={600}
                className="w-full max-w-[450px] h-auto ml-auto"
                priority
                sizes="(max-width: 768px) 100vw, 40vw"
              />
              {/* Glow behind CT art */}
              <div 
                className="absolute inset-0 -z-10 opacity-20 blur-3xl scale-110"
                style={{ 
                  background: "linear-gradient(180deg, var(--nec-cyan) 0%, var(--nec-pink) 50%, var(--nec-orange) 100%)"
                }} 
              />
            </div>
          </div>
        </div>

        {/* Mobile: Single column stack */}
        <div className="md:hidden flex flex-col items-center gap-4">
          {/* Logo */}
          <div className="relative w-full max-w-[400px]">
            <Image
              src="/images/necypaa-logo.webp"
              alt="NECYPAA XXXVi"
              width={400}
              height={260}
              className="w-full h-auto"
              priority
              sizes="100vw"
            />
            <div 
              className="absolute -inset-2 -z-10 rounded-full opacity-25 blur-2xl"
              style={{ 
                background: "linear-gradient(135deg, var(--nec-pink) 0%, var(--nec-cyan) 100%)"
              }} 
            />
          </div>

          {/* CT state art (smaller) */}
          <div className="relative w-full max-w-[280px] transform rotate-1">
            <Image
              src="/images/ct-state-art.webp"
              alt="Connecticut state outline"
              width={280}
              height={340}
              className="w-full h-auto"
              priority
              sizes="100vw"
            />
          </div>

          {/* Location & dates */}
          <div className="w-full max-w-[350px] space-y-3">
            <Image
              src="/images/hartford-ct-text.webp"
              alt="Hartford, Connecticut"
              width={350}
              height={175}
              className="w-full h-auto"
              priority
              sizes="100vw"
            />
            <Image
              src="/images/event-dates.webp"
              alt="December 31, 2026 through January 3, 2027"
              width={350}
              height={35}
              className="w-full h-auto"
              priority
              sizes="100vw"
            />
          </div>

          {/* Price badge */}
          <div 
            className="px-4 py-2 rounded-xl font-black text-xl uppercase tracking-wide"
            style={{ 
              background: "var(--nec-pink)",
              color: "white",
              boxShadow: "0 4px 20px rgba(232,0,110,0.4)"
            }}
          >
            Pre-Reg $40
          </div>
        </div>

        {/* CTA row */}
        <div className="mt-8 md:mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/register" 
            className="btn-primary text-center justify-center"
          >
            Register — $40
          </Link>
          <a
            href={HOTEL_BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-center justify-center"
          >
            Book Hotel — Book Now, Pay Later
          </a>
        </div>

        {/* Event details text (for SEO/accessibility) */}
        <p className="sr-only">
          NECYPAA XXXVi — The Northeast Convention of Young People in Alcoholics Anonymous. 
          Hartford, Connecticut. December 31, 2026 through January 3, 2027. 
          Pre-registration is $40. Hotel: Hartford Marriott Downtown.
        </p>
      </div>
    </section>
  )
}
