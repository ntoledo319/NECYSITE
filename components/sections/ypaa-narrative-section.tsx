"use client"

import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { SPRING_GENTLE, SPRING_SLOW, staggerContainer, staggerChild } from "@/components/ui/motion-primitives"

/* ── Inline SVG graphics for the narrative ── */

function DancingFigures() {
  return (
    <svg
      viewBox="0 0 200 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-auto w-full"
      aria-hidden="true"
    >
      {/* Figure 1 - arms up dancing */}
      <circle cx="40" cy="20" r="8" fill="var(--nec-cyan)" opacity="0.8" />
      <line
        x1="40"
        y1="28"
        x2="40"
        y2="60"
        stroke="var(--nec-cyan)"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.8"
      />
      <line
        x1="40"
        y1="36"
        x2="26"
        y2="22"
        stroke="var(--nec-cyan)"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.8"
      />
      <line
        x1="40"
        y1="36"
        x2="54"
        y2="22"
        stroke="var(--nec-cyan)"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.8"
      />
      <line
        x1="40"
        y1="60"
        x2="30"
        y2="80"
        stroke="var(--nec-cyan)"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.8"
      />
      <line
        x1="40"
        y1="60"
        x2="50"
        y2="80"
        stroke="var(--nec-cyan)"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.8"
      />

      {/* Figure 2 - one arm up */}
      <circle cx="80" cy="24" r="8" fill="var(--nec-pink)" opacity="0.8" />
      <line
        x1="80"
        y1="32"
        x2="80"
        y2="64"
        stroke="var(--nec-pink)"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.8"
      />
      <line
        x1="80"
        y1="40"
        x2="66"
        y2="50"
        stroke="var(--nec-pink)"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.8"
      />
      <line
        x1="80"
        y1="40"
        x2="96"
        y2="26"
        stroke="var(--nec-pink)"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.8"
      />
      <line
        x1="80"
        y1="64"
        x2="70"
        y2="84"
        stroke="var(--nec-pink)"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.8"
      />
      <line
        x1="80"
        y1="64"
        x2="90"
        y2="84"
        stroke="var(--nec-pink)"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.8"
      />

      {/* Figure 3 - both arms out */}
      <circle cx="120" cy="22" r="8" fill="var(--nec-gold)" opacity="0.8" />
      <line
        x1="120"
        y1="30"
        x2="120"
        y2="62"
        stroke="var(--nec-gold)"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.8"
      />
      <line
        x1="120"
        y1="38"
        x2="104"
        y2="30"
        stroke="var(--nec-gold)"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.8"
      />
      <line
        x1="120"
        y1="38"
        x2="136"
        y2="30"
        stroke="var(--nec-gold)"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.8"
      />
      <line
        x1="120"
        y1="62"
        x2="110"
        y2="82"
        stroke="var(--nec-gold)"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.8"
      />
      <line
        x1="120"
        y1="62"
        x2="130"
        y2="82"
        stroke="var(--nec-gold)"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.8"
      />

      {/* Figure 4 - jumping */}
      <circle cx="160" cy="16" r="8" fill="var(--nec-purple)" opacity="0.8" />
      <line
        x1="160"
        y1="24"
        x2="160"
        y2="52"
        stroke="var(--nec-purple)"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.8"
      />
      <line
        x1="160"
        y1="32"
        x2="146"
        y2="20"
        stroke="var(--nec-purple)"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.8"
      />
      <line
        x1="160"
        y1="32"
        x2="174"
        y2="20"
        stroke="var(--nec-purple)"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.8"
      />
      <line
        x1="160"
        y1="52"
        x2="148"
        y2="68"
        stroke="var(--nec-purple)"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.8"
      />
      <line
        x1="160"
        y1="52"
        x2="172"
        y2="68"
        stroke="var(--nec-purple)"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.8"
      />

      {/* Music notes floating */}
      <text x="55" y="14" fontSize="12" fill="var(--nec-cyan)" opacity="0.5">
        ♪
      </text>
      <text x="100" y="10" fontSize="14" fill="var(--nec-pink)" opacity="0.4">
        ♫
      </text>
      <text x="142" y="8" fontSize="11" fill="var(--nec-gold)" opacity="0.5">
        ♪
      </text>
      <text x="175" y="12" fontSize="13" fill="var(--nec-purple)" opacity="0.4">
        ♫
      </text>

      {/* Ground line */}
      <line
        x1="10"
        y1="90"
        x2="190"
        y2="90"
        stroke="var(--nec-border)"
        strokeWidth="1"
        strokeDasharray="4 4"
        opacity="0.3"
      />
    </svg>
  )
}

function ConnectionWeb() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-auto w-full"
      aria-hidden="true"
    >
      {/* Connection lines */}
      <line x1="100" y1="40" x2="40" y2="100" stroke="var(--nec-purple)" strokeWidth="1" opacity="0.3" />
      <line x1="100" y1="40" x2="160" y2="100" stroke="var(--nec-pink)" strokeWidth="1" opacity="0.3" />
      <line x1="40" y1="100" x2="100" y2="160" stroke="var(--nec-cyan)" strokeWidth="1" opacity="0.3" />
      <line x1="160" y1="100" x2="100" y2="160" stroke="var(--nec-gold)" strokeWidth="1" opacity="0.3" />
      <line x1="40" y1="100" x2="160" y2="100" stroke="var(--nec-purple)" strokeWidth="1" opacity="0.2" />
      <line x1="100" y1="40" x2="100" y2="160" stroke="var(--nec-pink)" strokeWidth="1" opacity="0.2" />

      {/* Node dots - people */}
      <circle cx="100" cy="40" r="12" fill="var(--nec-purple)" opacity="0.7" />
      <circle cx="40" cy="100" r="12" fill="var(--nec-cyan)" opacity="0.7" />
      <circle cx="160" cy="100" r="12" fill="var(--nec-pink)" opacity="0.7" />
      <circle cx="100" cy="160" r="12" fill="var(--nec-gold)" opacity="0.7" />

      {/* Glow rings */}
      <circle cx="100" cy="40" r="18" stroke="var(--nec-purple)" strokeWidth="1" opacity="0.2" />
      <circle cx="40" cy="100" r="18" stroke="var(--nec-cyan)" strokeWidth="1" opacity="0.2" />
      <circle cx="160" cy="100" r="18" stroke="var(--nec-pink)" strokeWidth="1" opacity="0.2" />
      <circle cx="100" cy="160" r="18" stroke="var(--nec-gold)" strokeWidth="1" opacity="0.2" />

      {/* Center heart/connection */}
      <circle cx="100" cy="100" r="6" fill="white" opacity="0.6" />
      <circle cx="100" cy="100" r="14" stroke="white" strokeWidth="0.5" opacity="0.15" />
    </svg>
  )
}

function SpeakerPodium() {
  return (
    <svg
      viewBox="0 0 160 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-auto w-full"
      aria-hidden="true"
    >
      {/* Speaker figure */}
      <circle cx="80" cy="24" r="12" fill="var(--nec-gold)" opacity="0.8" />
      <line
        x1="80"
        y1="36"
        x2="80"
        y2="72"
        stroke="var(--nec-gold)"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.8"
      />
      <line
        x1="80"
        y1="46"
        x2="60"
        y2="58"
        stroke="var(--nec-gold)"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.8"
      />
      <line
        x1="80"
        y1="46"
        x2="100"
        y2="58"
        stroke="var(--nec-gold)"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.8"
      />

      {/* Podium */}
      <rect x="60" y="72" width="40" height="30" rx="4" fill="var(--nec-purple)" opacity="0.4" />
      <rect x="56" y="68" width="48" height="6" rx="2" fill="var(--nec-purple)" opacity="0.6" />

      {/* Sound/speech waves */}
      <path
        d="M110 36 Q120 36 120 46"
        stroke="var(--nec-cyan)"
        strokeWidth="1.5"
        fill="none"
        opacity="0.4"
        strokeLinecap="round"
      />
      <path
        d="M114 30 Q128 30 128 48"
        stroke="var(--nec-cyan)"
        strokeWidth="1.5"
        fill="none"
        opacity="0.3"
        strokeLinecap="round"
      />
      <path
        d="M118 24 Q136 24 136 50"
        stroke="var(--nec-cyan)"
        strokeWidth="1.5"
        fill="none"
        opacity="0.2"
        strokeLinecap="round"
      />

      {/* Audience dots */}
      <circle cx="30" cy="115" r="5" fill="var(--nec-pink)" opacity="0.4" />
      <circle cx="50" cy="120" r="5" fill="var(--nec-cyan)" opacity="0.4" />
      <circle cx="70" cy="118" r="5" fill="var(--nec-purple)" opacity="0.4" />
      <circle cx="90" cy="120" r="5" fill="var(--nec-gold)" opacity="0.4" />
      <circle cx="110" cy="118" r="5" fill="var(--nec-pink)" opacity="0.4" />
      <circle cx="130" cy="115" r="5" fill="var(--nec-cyan)" opacity="0.4" />
    </svg>
  )
}

/* ── Narrative timeline step data ── */
const narrativeSteps = [
  {
    text: "You show up and you wonder, why am I here?",
    color: "var(--nec-purple)",
  },
  {
    text: "You go to a panel that addresses that specific question.",
    color: "var(--nec-cyan)",
  },
  {
    text: "You meet people from another state while making your nametag with some admittedly pretty cool stickers.",
    color: "var(--nec-pink)",
  },
  {
    text: "You go to the Main Meeting Room and see a bunch of young people in recovery dancing to Like A G6.",
    color: "var(--nec-gold)",
  },
  {
    text: "You wonder who hired the DJ.",
    color: "var(--nec-purple)",
  },
  {
    text: "You listen to the Main Speaker and laugh, maybe shed a tear.",
    color: "var(--nec-cyan)",
  },
  {
    text: "You walk around the outreach tables after the meeting and meet people involved in service.",
    color: "var(--nec-pink)",
  },
  {
    text: "You ask questions and you learn. What is a Bid Committee? Why do they keep stealing your banner?",
    color: "var(--nec-gold)",
  },
  {
    text: "They know your name now. You pre-register for their Convention.",
    color: "var(--nec-purple)",
  },
  {
    text: "They convince you to go to the dance even though you didn\u2019t bring an outfit to go with the theme.",
    color: "var(--nec-cyan)",
  },
  {
    text: 'You end up dancing even though "you\'re not a dancer" and the two hours goes by as if it was 30 minutes.',
    color: "var(--nec-pink)",
  },
  {
    text: "You follow a trail of people and walk into a room filled with laughter and loud voices.",
    color: "var(--nec-gold)",
  },
  {
    text: "You play games with your new friends. You share experiences, hardships.",
    color: "var(--nec-purple)",
  },
  {
    text: "You experience connection.",
    color: "var(--nec-cyan)",
    emphasis: true,
  },
  {
    text: 'You live all that stuff you didn\u2019t believe in "A Vision for You".',
    color: "var(--nec-gold)",
    emphasis: true,
  },
  {
    text: "You wake up the next day and do it all over again.",
    color: "var(--nec-pink)",
  },
]

/* ── Highlight chips for "What is a YPAA?" section ── */
const highlights = [
  {
    text: "Panels that discuss what isn\u2019t discussed enough",
    accent: "var(--nec-cyan)",
    accentRgb: "var(--nec-cyan-rgb)",
  },
  { text: "Workshops that expand your perspective", accent: "var(--nec-gold)", accentRgb: "var(--nec-gold-rgb)" },
  {
    text: "Keynote speakers that change trajectories",
    accent: "var(--nec-purple)",
    accentRgb: "var(--nec-purple-rgb)",
  },
  { text: "Community that crosses state lines", accent: "var(--nec-pink)", accentRgb: "var(--nec-pink-rgb)" },
  { text: "Dancing and laughing until 3 A.M.", accent: "var(--nec-cyan)", accentRgb: "var(--nec-cyan-rgb)" },
  { text: "Spiritual experiences, sober", accent: "var(--nec-gold)", accentRgb: "var(--nec-gold-rgb)" },
]

export default function YpaaNarrativeSection() {
  const shouldReduce = useReducedMotion()

  return (
    <section id="what-is-ypaa" aria-label="What is a YPAA Convention">
      {/* ═══════════════════════════════════════════
          PART 1: "What is a YPAA?"
          ═══════════════════════════════════════════ */}
      <div className="mb-20 md:mb-24">
        {/* Section header */}
        <motion.div
          className="mb-12 text-center"
          initial={shouldReduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={SPRING_GENTLE}
        >
          <span className="section-badge mb-4 inline-block">About YPAA</span>
          <h2 className="section-heading mt-3">
            What is a{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, var(--nec-purple) 0%, var(--nec-pink) 45%, var(--nec-gold) 100%)",
              }}
            >
              YPAA?
            </span>
          </h2>
        </motion.div>

        {/* Main explainer card */}
        <div className="nec-card relative overflow-hidden rounded-[1.95rem] p-7 sm:p-9 md:p-11">
          <div
            className="absolute inset-x-0 top-0 h-[3px]"
            aria-hidden="true"
            style={{
              background:
                "linear-gradient(90deg, rgba(var(--nec-purple-rgb),0) 0%, rgba(var(--nec-purple-rgb),0.42) 26%, rgba(var(--nec-pink-rgb),0.42) 62%, rgba(var(--nec-gold-rgb),0.38) 100%)",
            }}
          />
          <div
            className="absolute inset-0 rounded-[inherit]"
            style={{
              background:
                "linear-gradient(180deg, rgba(var(--nec-card-rgb),0.98) 0%, rgba(var(--nec-card-rgb),0.94) 100%)",
              border: "1px solid rgba(var(--nec-purple-rgb),0.12)",
              boxShadow: "0 22px 50px rgba(44, 24, 16, 0.08), 0 2px 6px rgba(0, 0, 0, 0.03)",
              borderRadius: "inherit",
            }}
          />
          <div
            className="pointer-events-none absolute -right-12 top-10 h-40 w-40 rounded-full"
            aria-hidden="true"
            style={{
              background: "radial-gradient(circle, rgba(var(--nec-purple-rgb),0.10) 0%, transparent 72%)",
            }}
          />
          <div
            className="pointer-events-none absolute -bottom-16 left-8 h-32 w-32 rounded-full"
            aria-hidden="true"
            style={{
              background: "radial-gradient(circle, rgba(var(--nec-gold-rgb),0.08) 0%, transparent 76%)",
            }}
          />

          <div className="relative z-10">
            <div className="grid gap-8 xl:grid-cols-[minmax(0,1.08fr)_minmax(280px,0.92fr)] xl:items-start xl:gap-12">
              <div>
                {/* Lede paragraph */}
                <p className="mb-6 text-base leading-relaxed text-[var(--nec-text)] sm:text-lg md:text-xl">
                  A Convention sounds inherently boring.{" "}
                  <span style={{ color: "var(--nec-muted)" }}>We&apos;re right there with you.</span> But a YPAA
                  Convention is so much more than the title &ldquo;Convention&rdquo; can convey.
                </p>

                <p className="mb-8 text-base leading-relaxed text-[var(--nec-text)] sm:text-lg">
                  It&apos;s being surrounded by hundreds — sometimes <em>thousands</em> — of young people passionate
                  about their sobriety. It&apos;s hearing Keynote Speakers that change the trajectory of your recovery.
                  It&apos;s dancing and laughing until 3&nbsp;A.M. It&apos;s having spiritual experiences sober while
                  surrounded by the experience, strength, and hope that AA has to offer.
                </p>

                <div className="mb-6">
                  <p
                    className="mb-4 text-center text-sm font-bold uppercase tracking-widest"
                    style={{ color: "var(--nec-purple)" }}
                  >
                    What you&apos;ll experience
                  </p>
                  <motion.div
                    className="grid gap-3 sm:grid-cols-2"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-40px" }}
                  >
                    {highlights.map((h) => (
                      <motion.div
                        key={h.text}
                        variants={staggerChild}
                        className="rounded-[1.25rem] border px-4 py-3.5"
                        style={{
                          background: "rgba(var(--nec-card-rgb),0.68)",
                          borderColor: `rgba(${h.accentRgb},0.15)`,
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className="mt-1 inline-flex h-3 w-3 flex-shrink-0 rounded-full"
                            style={{ background: h.accent, boxShadow: `0 0 0 5px rgba(${h.accentRgb},0.08)` }}
                            aria-hidden="true"
                          />
                          <span className="text-sm leading-6 text-[var(--nec-text)]">{h.text}</span>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </div>

              <div className="space-y-6 md:space-y-7">
                {/* Graphic: Dancing figures */}
                <div className="rounded-[1.6rem] border border-[rgba(var(--nec-purple-rgb),0.12)] bg-[linear-gradient(145deg,rgba(var(--nec-purple-rgb),0.05),rgba(var(--nec-card-rgb),0.8))] p-5">
                  <div className="mx-auto max-w-md opacity-80">
                    <DancingFigures />
                  </div>
                </div>

                {/* The deeper question row */}
                <motion.div
                  className="grid grid-cols-1 gap-4"
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-40px" }}
                >
                  <motion.div
                    variants={staggerChild}
                    className="rounded-xl p-5 text-center"
                    style={{
                      background: "rgba(var(--nec-cyan-rgb),0.05)",
                      border: "1px solid rgba(var(--nec-cyan-rgb),0.15)",
                    }}
                  >
                    <div className="mx-auto mb-3 h-12 w-12">
                      <SpeakerPodium />
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--nec-muted)" }}>
                      What is it like to get sober young? To be a parent in sobriety?
                    </p>
                  </motion.div>
                  <motion.div
                    variants={staggerChild}
                    className="rounded-xl p-5 text-center"
                    style={{
                      background: "rgba(var(--nec-pink-rgb),0.05)",
                      border: "1px solid rgba(var(--nec-pink-rgb),0.15)",
                    }}
                  >
                    <div className="mx-auto mb-3 h-12 w-12">
                      <ConnectionWeb />
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--nec-muted)" }}>
                      Building community in AA that crosses state and even country lines.
                    </p>
                  </motion.div>
                  <motion.div
                    variants={staggerChild}
                    className="rounded-xl p-5 text-center"
                    style={{
                      background: "rgba(var(--nec-gold-rgb),0.05)",
                      border: "1px solid rgba(var(--nec-gold-rgb),0.15)",
                    }}
                  >
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(var(--nec-gold-rgb),0.15)] bg-[rgba(var(--nec-gold-rgb),0.08)]">
                      <span
                        className="h-4 w-4 rounded-full bg-[var(--nec-gold)] shadow-[0_0_0_5px_rgba(var(--nec-gold-rgb),0.08)]"
                        aria-hidden="true"
                      />
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--nec-muted)" }}>
                      What does a healthy sober relationship look like? What does joy look like?
                    </p>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          PART 2: "A YPAA Convention goes something like this."
          The narrative timeline
          ═══════════════════════════════════════════ */}
      <div>
        {/* Section header */}
        <div className="mb-14 text-center">
          <h2 className="text-2xl font-black leading-tight text-[var(--nec-text)] sm:text-3xl md:text-4xl">
            A YPAA Convention goes{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(90deg, var(--nec-cyan) 0%, var(--nec-purple) 100%)",
              }}
            >
              something like this.
            </span>
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative mx-auto max-w-3xl rounded-[1.9rem] border border-[rgba(var(--nec-purple-rgb),0.10)] bg-[rgba(var(--nec-card-rgb),0.52)] px-5 py-9 sm:px-8 md:px-12 md:py-10">
          {/* Vertical timeline line */}
          <motion.div
            className="absolute bottom-0 left-4 top-0 w-px md:left-6"
            aria-hidden="true"
            style={{
              background:
                "linear-gradient(180deg, rgba(var(--nec-purple-rgb),0.45) 0%, rgba(var(--nec-cyan-rgb),0.28) 100%)",
            }}
            initial={shouldReduce ? false : { scaleY: 0, originY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={shouldReduce ? { duration: 0 } : { ...SPRING_SLOW, duration: 2 }}
          />

          <div className="space-y-6 md:space-y-7">
            {narrativeSteps.map((step, i) => (
              <motion.div
                key={i}
                className="relative pl-12 md:pl-16"
                initial={shouldReduce ? false : { opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={shouldReduce ? { duration: 0 } : { ...SPRING_GENTLE, delay: i * 0.04 }}
              >
                {/* Timeline dot */}
                <div
                  className="absolute left-2.5 top-1.5 h-3 w-3 rounded-full md:left-4"
                  aria-hidden="true"
                  style={{
                    background: step.color,
                    boxShadow: `0 0 0 6px rgba(var(--nec-card-rgb),0.94)`,
                  }}
                />

                <p
                  className={`rounded-[1.2rem] border border-[rgba(var(--nec-purple-rgb),0.08)] bg-[rgba(var(--nec-card-rgb),0.72)] px-4 py-3 leading-relaxed shadow-[0_10px_22px_rgba(44,24,16,0.04)] ${
                    step.emphasis ? "text-lg font-bold sm:text-xl md:text-2xl" : "text-base sm:text-lg"
                  }`}
                  style={{
                    color: "var(--nec-text)",
                  }}
                >
                  {step.text}
                </p>
              </motion.div>
            ))}
          </div>

          {/* ── Welcome Home ── */}
          <div className="relative mt-12 pt-6">
            <div
              className="absolute -top-0 left-4 h-8 w-px md:left-6"
              aria-hidden="true"
              style={{
                background: "linear-gradient(180deg, var(--nec-gold) 0%, transparent 100%)",
              }}
            />
            <div
              className="relative overflow-hidden rounded-2xl p-6 text-center sm:p-8"
              style={{
                background:
                  "linear-gradient(180deg, rgba(var(--nec-purple-rgb),0.05) 0%, rgba(var(--nec-card-rgb),0.96) 100%)",
                border: "1px solid rgba(var(--nec-purple-rgb),0.14)",
                boxShadow: "0 22px 48px rgba(44, 24, 16, 0.08), 0 2px 6px rgba(0, 0, 0, 0.03)",
              }}
            >
              <div className="relative z-10">
                <p
                  className="mb-2 text-2xl font-black sm:text-3xl md:text-4xl"
                  style={{
                    background:
                      "linear-gradient(90deg, var(--nec-purple) 0%, var(--nec-pink) 40%, var(--nec-gold) 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Welcome to YPAA.
                </p>
                <p
                  className="text-xl font-black sm:text-2xl md:text-3xl"
                  style={{
                    color: "var(--nec-text)",
                    textShadow: "none",
                  }}
                >
                  Welcome home.
                </p>

                {/* CTA */}
                <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                  <Link href="/register" className="btn-primary justify-center text-center">
                    Register Now
                  </Link>
                  <Link href="/faq" className="btn-ghost justify-center text-center">
                    Still have questions?
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
