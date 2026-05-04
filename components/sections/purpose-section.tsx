"use client"

import { motion } from "framer-motion"
import { SpotlightCard, staggerContainer, staggerChild } from "@/components/ui/motion-primitives"

export default function PurposeSection() {
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
        <h2 className="section-heading mt-3">What is NECYPAA?</h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--nec-muted)]">
          Founded in 1989, the Northeast Convention of Young People in Alcoholics Anonymous brings together young people
          in recovery for an annual multi-day conference. NECYPAA has been a cornerstone of AA service and fellowship
          across the Northeast for over three decades.
        </p>
      </div>

      <motion.div
        className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
      >
        {pillars.map((p) => (
          <motion.div
            key={p.title}
            variants={staggerChild}
            className="nec-card space-y-3 p-5 transition-all duration-200 hover:-translate-y-0.5"
          >
            <span className="text-3xl" role="img" aria-hidden="true">
              {p.icon}
            </span>
            <h3 className="text-base font-bold text-[var(--nec-text)]">{p.title}</h3>
            <p className="text-sm leading-relaxed text-[var(--nec-muted)]">{p.body}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* First-timer callout */}
      <SpotlightCard spotlightColor="rgba(var(--nec-purple-rgb),0.08)" spotlightSize={500}>
        <div
          className="nec-callout-card relative overflow-hidden rounded-2xl p-6 backdrop-blur-sm md:p-8"
          style={{
            background:
              "linear-gradient(135deg, rgba(var(--nec-purple-rgb),0.06) 0%, rgba(var(--nec-card-rgb),0.6) 50%, rgba(var(--nec-pink-rgb),0.04) 100%)",
            border: "1px solid rgba(var(--nec-purple-rgb),0.15)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <div className="relative z-10 flex flex-col items-start gap-4 md:flex-row md:items-center md:gap-8">
            <div className="flex-1 space-y-2">
              <h3 className="text-lg font-bold text-[var(--nec-text)]">First time at NECYPAA?</h3>
              <p className="max-w-xl text-sm leading-relaxed text-[var(--nec-muted)]">
                NECYPAA is for the young and young at heart — the only requirement is an honest desire to stop drinking.
                If you&apos;re in AA, you belong here. We&apos;ll have speaker meetings, workshops, dances, and a whole
                lot of fellowship from Dec 31 – Jan 3 at the Hartford Marriott Downtown.
              </p>
              <p className="text-sm font-semibold" style={{ color: "var(--nec-cyan)" }}>
                Questions? Reach out at{" "}
                <a
                  href="mailto:info@necypaa.org"
                  className="underline underline-offset-2 transition-opacity hover:opacity-80"
                >
                  info@necypaa.org
                </a>
              </p>
            </div>
            <div
              className="hidden h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl text-3xl md:flex"
              style={{
                background: "rgba(var(--nec-purple-rgb),0.08)",
                border: "1px solid rgba(var(--nec-purple-rgb),0.18)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              👋
            </div>
          </div>
        </div>
      </SpotlightCard>
    </section>
  )
}
