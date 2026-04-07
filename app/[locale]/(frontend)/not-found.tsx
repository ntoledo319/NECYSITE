"use client"

import Link from "next/link"
import Image from "next/image"
import { motion, useReducedMotion } from "framer-motion"
import { FloatingElement, MagneticButton, SPRING_GENTLE } from "@/components/ui/motion-primitives"

export default function NotFound() {
  const shouldReduce = useReducedMotion()

  return (
    <div
      className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center relative overflow-hidden"
      style={{ backgroundColor: "var(--nec-navy)" }}
    >
      {/* Ambient glow */}
      <div
        className="nec-glow-blob absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.08]"
        aria-hidden="true"
        style={{
          background: "radial-gradient(circle, var(--nec-purple) 0%, transparent 65%)",
          filter: "blur(100px)",
        }}
      />

      <motion.div
        className="relative z-10 max-w-lg"
        initial={shouldReduce ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={shouldReduce ? { duration: 0 } : SPRING_GENTLE}
      >
        {/* Portal art */}
        <FloatingElement yOffset={8} duration={5}>
          <div className="relative w-32 h-32 mx-auto mb-8">
            <Image
              src="/images/cheshire-cat-portal.png"
              alt=""
              width={128}
              height={128}
              className="w-full h-full object-contain drop-shadow-[0_4px_30px_rgba(124,58,237,0.35)]"
              aria-hidden="true"
            />
          </div>
        </FloatingElement>

        <span
          className="section-badge mb-4 inline-block"
        >
          404
        </span>

        <h1 className="text-3xl md:text-4xl font-black text-[var(--nec-text)] mb-3 nec-heading-shadow">
          Lost in the Mad Realm
        </h1>

        <p className="text-base md:text-lg leading-relaxed mb-8 text-[var(--nec-muted)]">
          This page doesn&apos;t exist — or perhaps the Cheshire Cat hid it.
          Either way, let&apos;s get you back to familiar ground.
        </p>

        <MagneticButton strength={0.25}>
          <Link
            href="/"
            className="nec-cta-accent inline-flex items-center gap-2 font-bold text-sm rounded-xl px-6 py-3 transition-colors text-[var(--nec-text)]"
          >
            Back to the Portal
          </Link>
        </MagneticButton>
      </motion.div>
    </div>
  )
}
