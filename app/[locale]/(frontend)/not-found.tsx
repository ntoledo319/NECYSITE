"use client"

import Link from "next/link"
import Image from "next/image"
import { motion, useReducedMotion } from "framer-motion"
import { SPRING_GENTLE } from "@/components/ui/motion-primitives"
import PageArtAccents from "@/components/art/page-art-accents"

export default function NotFound() {
  const shouldReduce = useReducedMotion()

  return (
    <div
      className="min-h-[80vh] flex flex-col justify-center px-4 py-16 relative overflow-hidden"
      style={{ backgroundColor: "var(--nec-navy)" }}
    >
      <PageArtAccents character="cheshire-cat" accentColor="var(--nec-purple)" variant="subtle" dividerVariant="gear" />

      <motion.div
        className="relative z-10 max-w-5xl mx-auto w-full"
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

            <div className="relative flex items-center justify-center overflow-hidden rounded-[1.4rem] border border-[rgba(var(--nec-purple-rgb),0.14)] bg-[rgba(var(--nec-card-rgb),0.88)] p-6 min-h-[22rem]">
              <div
                className="absolute h-56 w-56 rounded-full opacity-[0.12]"
                aria-hidden="true"
                style={{
                  background: "radial-gradient(circle, rgba(var(--nec-purple-rgb),0.8) 0%, transparent 70%)",
                  filter: "blur(36px)",
                }}
              />
              <Image
                src="/images/cheshire-cat-portal.png"
                alt=""
                width={220}
                height={220}
                className="relative z-10 w-40 h-40 md:w-48 md:h-48 object-contain drop-shadow-[0_4px_30px_rgba(var(--nec-purple-rgb),0.25)]"
                aria-hidden="true"
              />
            </div>
          </div>

          <div className="max-w-xl">
            <span className="section-badge mb-4 inline-block">
              404
            </span>

            <h1 className="text-3xl md:text-5xl font-black text-[var(--nec-text)] mb-3 nec-heading-shadow">
              Lost in the Mad Realm
            </h1>

            <p className="text-base md:text-lg leading-relaxed mb-8 text-[var(--nec-muted)]">
              This page doesn&apos;t exist — or perhaps the Cheshire Cat hid it.
              Either way, let&apos;s get you back to familiar ground.
            </p>

            <Link
              href="/"
              className="nec-cta-accent inline-flex items-center gap-2 font-bold text-sm rounded-xl px-6 py-3 transition-colors text-[var(--nec-text)]"
            >
              Back to the Portal
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
