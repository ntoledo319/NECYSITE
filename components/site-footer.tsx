import Image from "next/image"
import Link from "next/link"
import { HOTEL_BOOKING_URL, NECYPAA_ADVISORY_URL, CONTACT_EMAIL } from "@/lib/constants"
import { Mail, ExternalLink } from "lucide-react"
import { Sparkle, Hex } from "@/components/art/graffiti-elements"
import { Gear } from "@/components/art/steampunk-elements"

export default function SiteFooter() {
  return (
    <footer
      className="mt-24 relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, rgba(15,10,30,1) 0%, rgba(10,6,20,1) 100%)" }}
    >
      {/* Top accent bar */}
      <div
        className="h-[2px] w-full"
        style={{
          background: "linear-gradient(90deg, transparent 0%, var(--nec-purple) 20%, var(--nec-pink) 50%, var(--nec-gold) 80%, transparent 100%)",
          boxShadow: "0 0 12px rgba(124,58,237,0.3), 0 0 24px rgba(192,38,211,0.15)",
        }}
      />

      {/* Background character silhouettes — enhanced visibility */}
      <div className="absolute bottom-0 left-8 w-24 h-32 opacity-[0.12] pointer-events-none" aria-hidden="true">
        <Image src="/images/mad-hatter-character.png" alt="" width={96} height={144} className="w-full h-full object-contain" aria-hidden="true" />
      </div>
      <div className="absolute bottom-0 right-8 w-20 h-28 opacity-[0.10] pointer-events-none" aria-hidden="true">
        <Image src="/images/cheshire-cat-character.png" alt="" width={80} height={112} className="w-full h-full object-contain" aria-hidden="true" />
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-16 h-24 opacity-[0.07] pointer-events-none hidden md:block" aria-hidden="true">
        <Image src="/images/caterpillar-character.png" alt="" width={64} height={96} className="w-full h-full object-contain" aria-hidden="true" />
      </div>

      {/* Steampunk gear accents */}
      <div className="absolute top-16 left-4 pointer-events-none hidden md:block" aria-hidden="true">
        <Gear size={40} opacity={0.06} color="var(--nec-gold)" />
      </div>
      <div className="absolute top-20 right-6 pointer-events-none hidden md:block" aria-hidden="true">
        <Gear size={32} opacity={0.05} color="var(--nec-purple)" />
      </div>

      {/* Sparkle accents */}
      <div className="absolute top-10 left-[20%] pointer-events-none" aria-hidden="true">
        <Sparkle color="var(--nec-gold)" size={10} opacity={0.12} />
      </div>
      <div className="absolute top-24 right-[25%] pointer-events-none" aria-hidden="true">
        <Sparkle color="var(--nec-cyan)" size={8} opacity={0.10} />
      </div>
      <div className="absolute bottom-20 left-[40%] pointer-events-none hidden md:block" aria-hidden="true">
        <Hex color="var(--nec-purple)" size={20} opacity={0.05} />
      </div>

      <div className="container mx-auto px-4 py-12 pb-24 md:pb-12 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {/* Identity column */}
          <div className="space-y-3">
            <div className="w-28 h-auto mb-2">
              <Image
                src="/images/mad-realm-logo-no-bg.png"
                alt="Escaping the Mad Realm — NECYPAA XXXVI theme"
                width={112}
                height={112}
                className="w-full h-auto drop-shadow-[0_2px_12px_rgba(124,58,237,0.3)]"
              />
            </div>
            <h2
              className="text-xl font-black uppercase tracking-tight"
              style={{ color: "var(--nec-purple)", textShadow: "0 0 16px rgba(124,58,237,0.25)" }}
            >
              NECYPAA XXXVI
            </h2>
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest">CT Host Committee</p>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              The Northeast Convention of Young People in Alcoholics Anonymous — Hartford, Connecticut.
              Dec 31, 2026 – Jan 3, 2027.
            </p>
          </div>

          {/* Links column */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.3)" }}>Convention</h3>
            <ul className="space-y-2" aria-label="Convention links">
              <li>
                <Link href="/register" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Pre-Register — $40
                </Link>
              </li>
              <li>
                <a
                  href={HOTEL_BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-300 hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  Book Hotel <ExternalLink className="w-3 h-3" aria-hidden="true" /><span className="sr-only"> (opens in new tab)</span>
                </a>
              </li>
              <li>
                <Link href="/program" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Program
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/merch" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Merch
                </Link>
              </li>
              <li>
                <Link href="/breakfast" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Breakfast
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-gray-300 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <a
                  href={NECYPAA_ADVISORY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-300 hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  Advisory Council <ExternalLink className="w-3 h-3" aria-hidden="true" /><span className="sr-only"> (opens in new tab)</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Community column */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.3)" }}>Community</h3>
            <ul className="space-y-2" aria-label="Community links">
              <li>
                <Link href="/blog" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/service" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Get Involved
                </Link>
              </li>
              <li>
                <Link href="/journey" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Our Journey
                </Link>
              </li>
              <li>
                <Link href="/prayer" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Prayer
                </Link>
              </li>
              <li>
                <Link href="/asl" className="text-sm text-gray-300 hover:text-white transition-colors">
                  ASL Resources
                </Link>
              </li>
              <li>
                <Link href="/states" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Find Your State
                </Link>
              </li>
              <li>
                <Link href="/bid" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Start a Bid
                </Link>
              </li>
              <li>
                <Link href="/alanon" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Al-Anon / Alateen
                </Link>
              </li>
              <li>
                <Link href="/accessibility" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact column */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.3)" }}>Contact</h3>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
            >
              <Mail className="w-4 h-4 flex-shrink-0" style={{ color: "var(--nec-cyan)" }} aria-hidden="true" />
              {CONTACT_EMAIL}
            </a>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs pt-1">
              Questions about registration, hotel, accessibility, or anything else — reach out any time.
            </p>
          </div>
        </div>

        {/* Accessibility statement */}
        <div
          className="mt-10 pt-6 border-t text-xs text-gray-500 leading-relaxed"
          style={{ borderColor: "rgba(45,31,78,0.5)" }}
        >
          <p className="max-w-2xl">
            <strong className="text-gray-400">Accessibility:</strong>{" "}
            NECYPAA XXXVI is committed to digital accessibility for people of all abilities.
            This site targets WCAG 2.1 Level AAA wherever achievable, with Level AA as our minimum.{" "}
            <Link href="/accessibility" className="underline text-gray-400 hover:text-white transition-colors">
              Accessibility page
            </Link>{" · "}
            <a
              href="mailto:info@necypaa.org?subject=Accessibility%20Issue"
              className="underline text-gray-400 hover:text-white transition-colors"
            >
              Report a problem
            </a>
          </p>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-4 pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600"
          style={{ borderColor: "rgba(45,31,78,0.5)" }}
        >
          <p>
            © {new Date().getFullYear()} NECYPAA XXXVI CT Host Committee · All rights reserved.
          </p>
          <p className="text-center">
            Northeast Convention of Young People in Alcoholics Anonymous
          </p>
        </div>

        {/* AA trademark acknowledgment (required per Tradition compliance) */}
        <p className="mt-3 text-center text-[11px] text-gray-600 leading-relaxed">
          Alcoholics Anonymous®, A.A.®, and The Big Book® are registered trademarks of Alcoholics Anonymous World Services, Inc.
        </p>
      </div>
    </footer>
  )
}
