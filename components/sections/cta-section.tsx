import Image from "next/image"
import Link from "next/link"
import { HOTEL_BOOKING_URL } from "@/lib/constants"
import { ArrowRight, ExternalLink } from "lucide-react"

export default function CTASection() {
  return (
    <section aria-label="Register and book hotel" className="px-4 md:px-0 relative">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Register card */}
        <div
          className="nec-cta-card relative overflow-hidden rounded-2xl p-8 flex flex-col gap-5 backdrop-blur-sm"
          style={{
            background: "linear-gradient(135deg, rgba(124,58,237,0.14) 0%, rgba(26,16,48,0.85) 50%, rgba(192,38,211,0.04) 100%)",
            border: "1px solid rgba(124,58,237,0.30)",
            boxShadow: "0 4px 32px rgba(0,0,0,0.40), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        >
          <div
            className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-15"
            style={{ background: "var(--nec-purple)", filter: "blur(60px)" }}
            aria-hidden="true"
          />
          {/* Decorative logo watermark */}
          <div className="absolute -bottom-8 -right-8 w-40 h-40 opacity-[0.06] pointer-events-none" aria-hidden="true">
            <Image
              src="/images/mad-realm-logo-no-bg.png"
              alt=""
              width={160}
              height={160}
              sizes="160px"
              className="w-full h-full object-contain"
              aria-hidden="true"
            />
          </div>
          <div className="relative z-10">
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "var(--nec-purple)" }}
            >
              Pre-Registration Open
            </span>
            <h3 className="text-2xl md:text-3xl font-black text-white mt-1">Secure Your Spot</h3>
            <p className="text-sm text-gray-300 mt-3 leading-relaxed">
              Pre-registration is open at $40. Lock in your spot for NECYPAA XXXVI — Dec 31,
              2026 through Jan 3, 2027 at the Hartford Marriott Downtown.
            </p>
            <div className="mt-3 flex items-center gap-3">
              <span
                className="text-4xl font-black"
                style={{ color: "var(--nec-gold)", textShadow: "0 0 20px rgba(212,160,23,0.3)" }}
              >
                $40
              </span>
              <span className="text-sm text-gray-300">pre-registration price</span>
            </div>
          </div>
          <Link href="/register" className="btn-primary self-start mt-1 relative z-10">
            Register Now <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        {/* Hotel card */}
        <div
          className="nec-cta-card relative overflow-hidden rounded-2xl p-8 flex flex-col gap-5 backdrop-blur-sm"
          style={{
            background: "linear-gradient(135deg, rgba(212,160,23,0.10) 0%, rgba(26,16,48,0.85) 50%, rgba(212,160,23,0.03) 100%)",
            border: "1px solid rgba(212,160,23,0.25)",
            boxShadow: "0 4px 32px rgba(0,0,0,0.40), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        >
          <div
            className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-12"
            style={{ background: "var(--nec-gold)", filter: "blur(60px)" }}
            aria-hidden="true"
          />
          <div className="relative z-10">
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "var(--nec-gold)" }}
            >
              Host Hotel
            </span>
            <h3 className="text-2xl md:text-3xl font-black text-white mt-1">Hartford Marriott Downtown</h3>
            <p className="text-sm text-gray-300 mt-3 leading-relaxed">
              We have a room block at the Marriott with a special NECYPAA group rate. Rooms go
              fast around New Year&apos;s Eve — reserve yours early.
            </p>
            <p
              className="text-sm font-bold italic mt-3"
              style={{ color: "var(--nec-gold)" }}
            >
              <span aria-hidden="true">✦</span> Special NECYPAA group rate available
            </p>
          </div>
          <a
            href={HOTEL_BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary self-start mt-1 relative z-10"
          >
            Book Hotel <ExternalLink className="w-4 h-4" aria-hidden="true" /><span className="sr-only"> (opens in new tab)</span>
          </a>
        </div>
      </div>
    </section>
  )
}
