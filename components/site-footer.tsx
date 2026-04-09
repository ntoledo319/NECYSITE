"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { HOTEL_BOOKING_URL, NECYPAA_ADVISORY_URL, CONTACT_EMAIL } from "@/lib/constants"
import { Mail, ExternalLink, Rss } from "lucide-react"
import { Sparkle, Hex } from "@/components/art/graffiti-elements"
import { Gear } from "@/components/art/steampunk-elements"
import { staggerContainer, staggerChild } from "@/components/ui/motion-primitives"

export default function SiteFooter() {
  const shouldReduce = useReducedMotion()

  return (
    <footer
      className="relative mt-16 overflow-hidden nec-footer md:mt-20"
    >
      {/* Top accent bar */}
      <motion.div
        className="h-[2px] w-full"
        style={{
          background: "linear-gradient(90deg, transparent 0%, var(--nec-purple) 20%, var(--nec-pink) 50%, var(--nec-gold) 80%, transparent 100%)",
          boxShadow: "0 0 8px rgba(var(--nec-purple-rgb),0.15), 0 0 16px rgba(var(--nec-pink-rgb),0.08)",
        }}
        initial={shouldReduce ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={shouldReduce ? { duration: 0 } : { duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
      />

      {/* Background character silhouettes — enhanced visibility */}
      <div className="absolute bottom-0 left-8 w-24 h-32 opacity-[0.12] pointer-events-none" aria-hidden="true">
        <Image src="/images/mad-hatter-character.webp" alt="" width={96} height={144} sizes="96px" className="w-full h-full object-contain" aria-hidden="true" />
      </div>
      <div className="absolute bottom-0 right-8 w-20 h-28 opacity-[0.10] pointer-events-none" aria-hidden="true">
        <Image src="/images/cheshire-cat-character.webp" alt="" width={80} height={112} sizes="80px" className="w-full h-full object-contain" aria-hidden="true" />
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-16 h-24 opacity-[0.07] pointer-events-none hidden md:block" aria-hidden="true">
        <Image src="/images/caterpillar-character.webp" alt="" width={64} height={96} sizes="64px" className="w-full h-full object-contain" aria-hidden="true" />
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

      <div
        className="container relative z-10 mx-auto px-4 py-10 pb-20 md:py-11 md:pb-10"
        style={{ paddingBottom: "max(5rem, calc(1.25rem + env(safe-area-inset-bottom)))" }}
      >
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {/* Identity column */}
          <motion.div variants={staggerChild} className="space-y-3">
            <div className="w-28 h-auto mb-2">
              <Image
                src="/images/mad-realm-logo-no-bg.webp"
                alt="Escaping the Mad Realm — NECYPAA XXXVI theme"
                width={112}
                height={112}
                sizes="112px"
                className="w-full h-auto"
              />
            </div>
            <h2
              className="text-xl font-black uppercase tracking-tight text-[var(--nec-purple)]"
            >
              NECYPAA XXXVI
            </h2>
            <p className="text-sm font-semibold text-[var(--nec-muted)] uppercase tracking-widest">CT Host Committee</p>
            <p className="text-sm text-[var(--nec-muted)] leading-relaxed max-w-xs">
              The Northeast Convention of Young People in Alcoholics Anonymous — Hartford, Connecticut.
              Dec 31, 2026 – Jan 3, 2027.
            </p>
          </motion.div>

          {/* Links column */}
          <motion.div variants={staggerChild} className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--nec-cyan)]">Convention</h3>
            <ul className="space-y-2" aria-label="Convention links">
              <li>
                <Link href="/register" className="text-sm text-[var(--nec-muted)] hover:text-[var(--nec-text)] transition-colors footer-link">
                  Pre-Register
                </Link>
              </li>
              <li>
                <a
                  href={HOTEL_BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--nec-muted)] hover:text-[var(--nec-text)] transition-colors footer-link inline-flex items-center gap-1"
                >
                  Book Hotel <ExternalLink className="w-3 h-3" aria-hidden="true" /><span className="sr-only"> (opens in new tab)</span>
                </a>
              </li>
              <li>
                <Link href="/program" className="text-sm text-[var(--nec-muted)] hover:text-[var(--nec-text)] transition-colors footer-link">
                  Program
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-sm text-[var(--nec-muted)] hover:text-[var(--nec-text)] transition-colors footer-link">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/merch" className="text-sm text-[var(--nec-muted)] hover:text-[var(--nec-text)] transition-colors footer-link">
                  Merch
                </Link>
              </li>
              <li>
                <Link href="/breakfast" className="text-sm text-[var(--nec-muted)] hover:text-[var(--nec-text)] transition-colors footer-link">
                  Breakfast
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-[var(--nec-muted)] hover:text-[var(--nec-text)] transition-colors footer-link">
                  FAQ
                </Link>
              </li>
              <li>
                <a
                  href={NECYPAA_ADVISORY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--nec-muted)] hover:text-[var(--nec-text)] transition-colors footer-link inline-flex items-center gap-1"
                >
                  Advisory Council <ExternalLink className="w-3 h-3" aria-hidden="true" /><span className="sr-only"> (opens in new tab)</span>
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Community column */}
          <motion.div variants={staggerChild} className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--nec-pink)]">Community</h3>
            <ul className="space-y-2" aria-label="Community links">
              <li>
                <Link href="/blog" className="text-sm text-[var(--nec-muted)] hover:text-[var(--nec-text)] transition-colors footer-link">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/service" className="text-sm text-[var(--nec-muted)] hover:text-[var(--nec-text)] transition-colors footer-link">
                  Get Involved
                </Link>
              </li>
              <li>
                <Link href="/journey" className="text-sm text-[var(--nec-muted)] hover:text-[var(--nec-text)] transition-colors footer-link">
                  Our Journey
                </Link>
              </li>
              <li>
                <Link href="/prayer" className="text-sm text-[var(--nec-muted)] hover:text-[var(--nec-text)] transition-colors footer-link">
                  Prayer
                </Link>
              </li>
              <li>
                <Link href="/asl" className="text-sm text-[var(--nec-muted)] hover:text-[var(--nec-text)] transition-colors footer-link">
                  ASL Resources
                </Link>
              </li>
              <li>
                <Link href="/states" className="text-sm text-[var(--nec-muted)] hover:text-[var(--nec-text)] transition-colors footer-link">
                  Find Your State
                </Link>
              </li>
              <li>
                <Link href="/bid" className="text-sm text-[var(--nec-muted)] hover:text-[var(--nec-text)] transition-colors footer-link">
                  Start a Bid
                </Link>
              </li>
              <li>
                <Link href="/alanon" className="text-sm text-[var(--nec-muted)] hover:text-[var(--nec-text)] transition-colors footer-link">
                  Al-Anon / Alateen
                </Link>
              </li>
              <li>
                <Link href="/accessibility" className="text-sm text-[var(--nec-muted)] hover:text-[var(--nec-text)] transition-colors footer-link">
                  Accessibility
                </Link>
              </li>
              <li>
                <a
                  href="/feed.xml"
                  className="text-sm text-[var(--nec-muted)] hover:text-[var(--nec-text)] transition-colors footer-link inline-flex items-center gap-1"
                >
                  <Rss className="w-3 h-3" aria-hidden="true" />
                  RSS Feed
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Contact column */}
          <motion.div variants={staggerChild} className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--nec-gold)]">Contact</h3>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-2 text-sm text-[var(--nec-muted)] hover:text-[var(--nec-text)] transition-colors"
            >
              <Mail className="w-4 h-4 flex-shrink-0" style={{ color: "var(--nec-cyan)" }} aria-hidden="true" />
              {CONTACT_EMAIL}
            </a>
            <p className="text-sm text-[var(--nec-muted)] leading-relaxed max-w-xs pt-1">
              Questions about registration, hotel, accessibility, or anything else — reach out any time.
            </p>
          </motion.div>
        </motion.div>

        {/* Accessibility statement */}
        <div
          className="mt-10 pt-6 border-t text-xs text-[var(--nec-muted)] leading-relaxed"
          style={{ borderColor: "var(--nec-border)" }}
        >
          <p className="max-w-2xl">
            <strong className="text-[var(--nec-muted)]">Accessibility:</strong>{" "}
            NECYPAA XXXVI is committed to digital accessibility for people of all abilities.
            This site targets WCAG 2.1 Level AAA wherever achievable, with Level AA as our minimum.{" "}
            <Link href="/accessibility" className="underline text-[var(--nec-muted)] hover:text-[var(--nec-text)] transition-colors">
              Accessibility page
            </Link>{" · "}
            <a
              href="mailto:info@necypaa.org?subject=Accessibility%20Issue"
              className="underline text-[var(--nec-muted)] hover:text-[var(--nec-text)] transition-colors"
            >
              Report a problem
            </a>
          </p>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-4 pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--nec-muted)]"
          style={{ borderColor: "var(--nec-border)" }}
        >
          <p>
            © {new Date().getFullYear()} NECYPAA XXXVI CT Host Committee · All rights reserved.
          </p>
          <p className="text-center">
            Northeast Convention of Young People in Alcoholics Anonymous
          </p>
          <p className="text-center italic hidden sm:block">
            Built with love by people who get it.
          </p>
        </div>

        {/* AA trademark acknowledgment (required per Tradition compliance) */}
        <p className="mt-3 text-center text-xs text-[var(--nec-muted)] leading-relaxed">
          Alcoholics Anonymous®, A.A.®, and The Big Book® are registered trademarks of Alcoholics Anonymous World Services, Inc.
        </p>
      </div>
    </footer>
  )
}
