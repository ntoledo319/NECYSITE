"use client"

import { motion, useReducedMotion } from "framer-motion"
import { SpotlightCard, staggerContainer, staggerChild } from "@/components/ui/motion-primitives"

export default function PurposeSection() {
  const shouldReduce = useReducedMotion()
  const pillars = [
    {
      icon: "🤝",
      title: "Fellowship",
      body: "Connect with young people in recovery from across the Northeast. NECYPAA is built on AA principles and the shared experience of getting and staying sober.",
    },
    {
      icon: "🎤",
      title: "AA Speakers",
      body: "World-class speaker meetings, workshops, and panels — all grounded in the AA program and the Twelve Steps.",
    },
    {
      icon: "🎉",
      title: "Celebration",
      body: "Four days of dancing, music, meetings, and memories. Proof that recovery doesn't just work — it's genuinely joyful.",
    },
    {
      icon: "🌱",
      title: "New to NECYPAA?",
      body: "NECYPAA is for the young and young at heart. The only requirement is an honest desire to stop drinking. All are welcome — come as you are.",
    },
  ]

  return (
    <section id="purpose" aria-label="About NECYPAA" className="px-4 md:px-0">
      <div className="mb-8">
        <span className="section-badge mb-4">About NECYPAA</span>
        <h2 className="section-heading mt-3" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>What is NECYPAA?</h2>
        <p className="mt-3 text-base text-[var(--nec-muted)] max-w-2xl leading-relaxed">
          Founded in 1989, the Northeast Convention of Young People in Alcoholics Anonymous brings
          together young people in recovery for an annual multi-day conference. NECYPAA has been a
          cornerstone of AA service and fellowship across the Northeast for over three decades.
        </p>
      </div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
      >
        {pillars.map((p) => (
          <motion.div
            key={p.title}
            variants={staggerChild}
            className="nec-card p-5 space-y-3 transition-all duration-200 hover:-translate-y-0.5"
          >
            <span className="text-3xl" role="img" aria-hidden="true">{p.icon}</span>
            <h3 className="font-bold text-white text-base" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.3)" }}>{p.title}</h3>
            <p className="text-sm text-[var(--nec-muted)] leading-relaxed">{p.body}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* First-timer callout */}
      <SpotlightCard spotlightColor="rgba(124,58,237,0.10)" spotlightSize={500}>
      <div
        className="nec-callout-card rounded-2xl p-6 md:p-8 relative overflow-hidden backdrop-blur-sm"
        style={{
          background: "linear-gradient(135deg, rgba(124,58,237,0.08) 0%, rgba(26,16,48,0.6) 50%, rgba(192,38,211,0.05) 100%)",
          border: "1px solid rgba(124,58,237,0.22)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
          <div className="flex-1 space-y-2">
            <h3 className="text-lg font-bold text-white" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.3)" }}>First time at NECYPAA?</h3>
            <p className="text-sm text-[var(--nec-muted)] leading-relaxed max-w-xl">
              NECYPAA is for the young and young at heart — the only requirement is an honest desire
              to stop drinking. If you&apos;re in AA, you belong here. We&apos;ll have
              speaker meetings, workshops, dances, and a whole lot of fellowship from Dec 31 – Jan 3
              at the Hartford Marriott Downtown.
            </p>
            <p className="text-sm font-semibold" style={{ color: "var(--nec-cyan)" }}>
              Questions? Reach out at{" "}
              <a
                href="mailto:info@necypaa.org"
                className="underline underline-offset-2 hover:opacity-80 transition-opacity"
              >
                info@necypaa.org
              </a>
            </p>
          </div>
          <div
            className="hidden md:flex flex-shrink-0 w-16 h-16 rounded-2xl items-center justify-center text-3xl"
            style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.25)", boxShadow: "0 2px 12px rgba(0,0,0,0.25)" }}
          >
            👋
          </div>
        </div>
      </div>
      </SpotlightCard>
    </section>
  )
}
