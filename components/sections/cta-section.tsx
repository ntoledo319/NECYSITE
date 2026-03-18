import Link from "next/link"
import { HOTEL_BOOKING_URL } from "@/lib/constants"
import { ArrowRight, ExternalLink } from "lucide-react"
import { MazePattern } from "@/components/art/steampunk-gears"

export default function CTASection() {
  return (
    <section aria-label="Register and book hotel" className="px-4 md:px-0 relative">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Register card */}
        <div
          className="relative overflow-hidden rounded-2xl p-7 flex flex-col gap-4 backdrop-blur-sm"
          style={{
            background: "linear-gradient(135deg, rgba(124,58,237,0.14) 0%, rgba(26,16,48,0.8) 50%, rgba(192,38,211,0.04) 100%)",
            border: "1px solid rgba(124,58,237,0.30)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        >
          <div
            className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-15"
            style={{ background: "var(--nec-purple)", filter: "blur(60px)" }}
            aria-hidden="true"
          />
          {/* Mad Realm maze floor texture */}
          <MazePattern className="absolute bottom-0 right-0 w-32 h-32 opacity-80" />
          <div className="relative z-10">
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "var(--nec-purple)" }}
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
                className="text-3xl font-black glow-purple"
                style={{ color: "var(--nec-gold)" }}
              >
                $40
              </span>
              <span className="text-sm text-gray-400">pre-registration price</span>
            </div>
          </div>
          <Link href="/register" className="btn-primary self-start mt-1 relative z-10">
            Register Now <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        {/* Hotel card */}
        <div
          className="relative overflow-hidden rounded-2xl p-7 flex flex-col gap-4 backdrop-blur-sm"
          style={{
            background: "linear-gradient(135deg, rgba(212,160,23,0.10) 0%, rgba(26,16,48,0.8) 50%, rgba(212,160,23,0.03) 100%)",
            border: "1px solid rgba(212,160,23,0.25)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)",
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
            <h3 className="text-2xl font-black text-white mt-1">Hartford Marriott Downtown</h3>
            <p className="text-sm text-gray-400 mt-2 leading-relaxed">
              We have a room block at the Marriott with a special NECYPAA group rate. Rooms go
              fast around New Year&apos;s Eve — reserve yours early.
            </p>
            <p
              className="text-sm font-bold italic mt-2"
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
