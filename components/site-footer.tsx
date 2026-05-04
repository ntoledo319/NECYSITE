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
    <footer className="nec-footer relative mt-16 overflow-hidden md:mt-20">
      {/* Top accent bar */}
      <motion.div
        className="h-[2px] w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, var(--nec-purple) 20%, var(--nec-pink) 50%, var(--nec-gold) 80%, transparent 100%)",
          boxShadow: "0 0 8px rgba(var(--nec-purple-rgb),0.15), 0 0 16px rgba(var(--nec-pink-rgb),0.08)",
        }}
        initial={shouldReduce ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={shouldReduce ? { duration: 0 } : { duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
      />

      {/* Background character silhouettes — enhanced visibility */}
      <div className="pointer-events-none absolute bottom-0 left-8 h-32 w-24 opacity-[0.12]" aria-hidden="true">
        <Image
          src="/images/mad-hatter-character.webp"
          alt=""
          width={96}
          height={144}
          sizes="96px"
          className="h-full w-full object-contain"
          aria-hidden="true"
        />
      </div>
      <div className="pointer-events-none absolute bottom-0 right-8 h-28 w-20 opacity-[0.10]" aria-hidden="true">
        <Image
          src="/images/cheshire-cat-character.webp"
          alt=""
          width={80}
          height={112}
          sizes="80px"
          className="h-full w-full object-contain"
          aria-hidden="true"
        />
      </div>
      <div
        className="pointer-events-none absolute bottom-4 left-1/2 hidden h-24 w-16 -translate-x-1/2 opacity-[0.07] md:block"
        aria-hidden="true"
      >
        <Image
          src="/images/caterpillar-character.webp"
          alt=""
          width={64}
          height={96}
          sizes="64px"
          className="h-full w-full object-contain"
          aria-hidden="true"
        />
      </div>

      {/* Steampunk gear accents */}
      <div className="pointer-events-none absolute left-4 top-16 hidden md:block" aria-hidden="true">
        <Gear size={40} opacity={0.06} color="var(--nec-gold)" />
      </div>
      <div className="pointer-events-none absolute right-6 top-20 hidden md:block" aria-hidden="true">
        <Gear size={32} opacity={0.05} color="var(--nec-purple)" />
      </div>

      {/* Sparkle accents */}
      <div className="pointer-events-none absolute left-[20%] top-10" aria-hidden="true">
        <Sparkle color="var(--nec-gold)" size={10} opacity={0.12} />
      </div>
      <div className="pointer-events-none absolute right-[25%] top-24" aria-hidden="true">
        <Sparkle color="var(--nec-cyan)" size={8} opacity={0.1} />
      </div>
      <div className="pointer-events-none absolute bottom-20 left-[40%] hidden md:block" aria-hidden="true">
        <Hex color="var(--nec-purple)" size={20} opacity={0.05} />
      </div>

      <div
        className="container relative z-10 mx-auto px-4 py-10 pb-20 md:py-11 md:pb-10"
        style={{ paddingBottom: "max(5rem, calc(1.25rem + env(safe-area-inset-bottom)))" }}
      >
        <motion.div
          className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {/* Identity column */}
          <motion.div variants={staggerChild} className="space-y-3">
            <div className="mb-2 h-auto w-28">
              <Image
                src="/images/mad-realm-logo-no-bg.webp"
                alt="Escaping the Mad Realm — NECYPAA XXXVI theme"
                width={112}
                height={112}
                sizes="112px"
                className="h-auto w-full"
              />
            </div>
            <h2 className="text-xl font-black uppercase tracking-tight text-[var(--nec-purple)]">NECYPAA XXXVI</h2>
            <p className="text-sm font-semibold uppercase tracking-widest text-[var(--nec-muted)]">CT Host Committee</p>
            <p className="max-w-xs text-sm leading-relaxed text-[var(--nec-muted)]">
              The Northeast Convention of Young People in Alcoholics Anonymous — Hartford, Connecticut. Dec 31, 2026 –
              Jan 3, 2027.
            </p>
          </motion.div>

          {/* Links column */}
          <motion.div variants={staggerChild} className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--nec-cyan)]">Convention</h3>
            <ul className="space-y-2" aria-label="Convention links">
              <li>
                <Link
                  href="/register"
                  className="footer-link text-sm text-[var(--nec-muted)] transition-colors hover:text-[var(--nec-text)]"
                >
                  Pre-Register
                </Link>
              </li>
              <li>
                <a
                  href={HOTEL_BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link inline-flex items-center gap-1 text-sm text-[var(--nec-muted)] transition-colors hover:text-[var(--nec-text)]"
                >
                  Book Hotel <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  <span className="sr-only"> (opens in new tab)</span>
                </a>
              </li>
              <li>
                <Link
                  href="/program"
                  className="footer-link text-sm text-[var(--nec-muted)] transition-colors hover:text-[var(--nec-text)]"
                >
                  Program
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="footer-link text-sm text-[var(--nec-muted)] transition-colors hover:text-[var(--nec-text)]"
                >
                  Events
                </Link>
              </li>
              <li>
                <Link
                  href="/merch"
                  className="footer-link text-sm text-[var(--nec-muted)] transition-colors hover:text-[var(--nec-text)]"
                >
                  Merch
                </Link>
              </li>
              <li>
                <Link
                  href="/breakfast"
                  className="footer-link text-sm text-[var(--nec-muted)] transition-colors hover:text-[var(--nec-text)]"
                >
                  Breakfast
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="footer-link text-sm text-[var(--nec-muted)] transition-colors hover:text-[var(--nec-text)]"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <a
                  href={NECYPAA_ADVISORY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link inline-flex items-center gap-1 text-sm text-[var(--nec-muted)] transition-colors hover:text-[var(--nec-text)]"
                >
                  Advisory Council <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  <span className="sr-only"> (opens in new tab)</span>
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Community column */}
          <motion.div variants={staggerChild} className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--nec-pink)]">Community</h3>
            <ul className="space-y-2" aria-label="Community links">
              <li>
                <Link
                  href="/blog"
                  className="footer-link text-sm text-[var(--nec-muted)] transition-colors hover:text-[var(--nec-text)]"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/service"
                  className="footer-link text-sm text-[var(--nec-muted)] transition-colors hover:text-[var(--nec-text)]"
                >
                  Get Involved
                </Link>
              </li>
              <li>
                <Link
                  href="/journey"
                  className="footer-link text-sm text-[var(--nec-muted)] transition-colors hover:text-[var(--nec-text)]"
                >
                  Our Journey
                </Link>
              </li>
              <li>
                <Link
                  href="/prayer"
                  className="footer-link text-sm text-[var(--nec-muted)] transition-colors hover:text-[var(--nec-text)]"
                >
                  Prayer
                </Link>
              </li>
              <li>
                <Link
                  href="/asl"
                  className="footer-link text-sm text-[var(--nec-muted)] transition-colors hover:text-[var(--nec-text)]"
                >
                  ASL Resources
                </Link>
              </li>
              <li>
                <Link
                  href="/states"
                  className="footer-link text-sm text-[var(--nec-muted)] transition-colors hover:text-[var(--nec-text)]"
                >
                  Find Your State
                </Link>
              </li>
              <li>
                <Link
                  href="/bid"
                  className="footer-link text-sm text-[var(--nec-muted)] transition-colors hover:text-[var(--nec-text)]"
                >
                  Start a Bid
                </Link>
              </li>
              <li>
                <Link
                  href="/alanon"
                  className="footer-link text-sm text-[var(--nec-muted)] transition-colors hover:text-[var(--nec-text)]"
                >
                  Al-Anon / Alateen
                </Link>
              </li>
              <li>
                <Link
                  href="/accessibility"
                  className="footer-link text-sm text-[var(--nec-muted)] transition-colors hover:text-[var(--nec-text)]"
                >
                  Accessibility
                </Link>
              </li>
              <li>
                <a
                  href="/feed.xml"
                  className="footer-link inline-flex items-center gap-1 text-sm text-[var(--nec-muted)] transition-colors hover:text-[var(--nec-text)]"
                >
                  <Rss className="h-3 w-3" aria-hidden="true" />
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
              className="inline-flex items-center gap-2 text-sm text-[var(--nec-muted)] transition-colors hover:text-[var(--nec-text)]"
            >
              <Mail className="h-4 w-4 flex-shrink-0" style={{ color: "var(--nec-cyan)" }} aria-hidden="true" />
              {CONTACT_EMAIL}
            </a>
            <p className="max-w-xs pt-1 text-sm leading-relaxed text-[var(--nec-muted)]">
              Questions about registration, hotel, accessibility, or anything else — reach out any time.
            </p>
          </motion.div>
        </motion.div>

        {/* Accessibility statement */}
        <div
          className="mt-10 border-t pt-6 text-xs leading-relaxed text-[var(--nec-muted)]"
          style={{ borderColor: "var(--nec-border)" }}
        >
          <p className="max-w-2xl">
            <strong className="text-[var(--nec-muted)]">Accessibility:</strong> NECYPAA XXXVI is committed to digital
            accessibility for people of all abilities. This site targets WCAG 2.1 Level AAA wherever achievable, with
            Level AA as our minimum.{" "}
            <Link
              href="/accessibility"
              className="text-[var(--nec-muted)] underline transition-colors hover:text-[var(--nec-text)]"
            >
              Accessibility page
            </Link>
            {" · "}
            <a
              href="mailto:info@necypaa.org?subject=Accessibility%20Issue"
              className="text-[var(--nec-muted)] underline transition-colors hover:text-[var(--nec-text)]"
            >
              Report a problem
            </a>
          </p>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-4 flex flex-col items-center justify-between gap-3 border-t pt-4 text-xs text-[var(--nec-muted)] sm:flex-row"
          style={{ borderColor: "var(--nec-border)" }}
        >
          <p>© {new Date().getFullYear()} NECYPAA XXXVI CT Host Committee · All rights reserved.</p>
          <p className="text-center">Northeast Convention of Young People in Alcoholics Anonymous</p>
          <p className="hidden text-center italic sm:block">Built with love by people who get it.</p>
        </div>

        {/* AA trademark acknowledgment (required per Tradition compliance) */}
        <p className="mt-3 text-center text-xs leading-relaxed text-[var(--nec-muted)]">
          Alcoholics Anonymous®, A.A.®, and The Big Book® are registered trademarks of Alcoholics Anonymous World
          Services, Inc.
        </p>
      </div>
    </footer>
  )
}
