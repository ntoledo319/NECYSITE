"use client"

import Link from "next/link"
import Image from "next/image"
import { motion, useReducedMotion } from "framer-motion"
import { SPRING_GENTLE } from "@/components/ui/motion-primitives"
import PageArtAccents from "@/components/art/page-art-accents"
import { CONTACT_EMAIL } from "@/lib/constants"
import { Mail, ArrowRight } from "lucide-react"

export default function NotFound() {
  const shouldReduce = useReducedMotion()

  return (
    <div
      className="relative flex min-h-[80vh] flex-col justify-center overflow-hidden px-4 py-16"
      style={{ backgroundColor: "var(--nec-navy)" }}
    >
      <PageArtAccents character="cheshire-cat" accentColor="var(--nec-purple)" variant="subtle" dividerVariant="gear" />

      <motion.div
        className="relative z-10 mx-auto w-full max-w-5xl"
        initial={shouldReduce ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={shouldReduce ? { duration: 0 } : SPRING_GENTLE}
      >
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="relative overflow-hidden rounded-[2rem] border border-[rgba(var(--nec-purple-rgb),0.16)] bg-[linear-gradient(145deg,rgba(var(--nec-purple-rgb),0.08),rgba(var(--nec-card-rgb),0.92))] p-5 shadow-[0_22px_54px_rgba(44,24,16,0.08)]">
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
              <div className="absolute left-6 top-6 h-16 w-16 rounded-full border border-[rgba(var(--nec-purple-rgb),0.16)]" />
              <div className="absolute right-8 top-8 h-12 w-20 rounded-[1rem] border border-[rgba(var(--nec-gold-rgb),0.14)]" />
            </div>

            <div className="relative flex min-h-[22rem] items-center justify-center overflow-hidden rounded-[1.4rem] border border-[rgba(var(--nec-purple-rgb),0.14)] bg-[rgba(var(--nec-card-rgb),0.88)] p-6">
              <div
                className="absolute h-56 w-56 rounded-full opacity-[0.12]"
                aria-hidden="true"
                style={{
                  background: "radial-gradient(circle, rgba(var(--nec-purple-rgb),0.8) 0%, transparent 70%)",
                  filter: "blur(36px)",
                }}
              />
              <Image
                src="/images/cheshire-cat-portal.webp"
                alt=""
                width={220}
                height={220}
                className="relative z-10 h-40 w-40 object-contain drop-shadow-[0_4px_30px_rgba(var(--nec-purple-rgb),0.25)] md:h-48 md:w-48"
                aria-hidden="true"
              />
            </div>
          </div>

          <div className="max-w-xl">
            <span className="section-badge mb-4 inline-block">404</span>

            <h1 className="nec-heading-shadow mb-3 text-3xl font-black text-[var(--nec-text)] md:text-5xl">
              Lost in the Mad Realm
            </h1>

            <p className="mb-6 text-base leading-relaxed text-[var(--nec-muted)] md:text-lg">
              This page doesn&apos;t exist — or perhaps the Cheshire Cat hid it. Either way, let&apos;s get you back to
              familiar ground.
            </p>

            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/" className="btn-primary">
                Back to the Portal
              </Link>
              <Link href="/register" className="btn-ghost">
                Register
              </Link>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--nec-muted)]">
                Or try one of these
              </p>
              <nav aria-label="Helpful links">
                <ul className="flex flex-wrap gap-x-4 gap-y-1">
                  {[
                    { href: "/blog", label: "Blog" },
                    { href: "/events", label: "Events" },
                    { href: "/faq", label: "FAQ" },
                    { href: "/service", label: "Get Involved" },
                    { href: "/program", label: "Program" },
                  ].map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="inline-flex items-center gap-1 text-sm text-[var(--nec-muted)] transition-colors hover:text-[var(--nec-text)]"
                      >
                        <ArrowRight className="h-3 w-3" aria-hidden="true" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="mt-2 inline-flex items-center gap-1.5 text-xs text-[var(--nec-muted)] transition-colors hover:text-[var(--nec-text)]"
              >
                <Mail className="h-3 w-3" aria-hidden="true" />
                Still stuck? Reach out — {CONTACT_EMAIL}
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
