"use client"

import Link from "next/link"

/* ── Inline SVG graphics for the narrative ── */

function DancingFigures() {
  return (
    <svg
      viewBox="0 0 200 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto"
      aria-hidden="true"
    >
      {/* Figure 1 - arms up dancing */}
      <circle cx="40" cy="20" r="8" fill="var(--nec-cyan)" opacity="0.8" />
      <line x1="40" y1="28" x2="40" y2="60" stroke="var(--nec-cyan)" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
      <line x1="40" y1="36" x2="26" y2="22" stroke="var(--nec-cyan)" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
      <line x1="40" y1="36" x2="54" y2="22" stroke="var(--nec-cyan)" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
      <line x1="40" y1="60" x2="30" y2="80" stroke="var(--nec-cyan)" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
      <line x1="40" y1="60" x2="50" y2="80" stroke="var(--nec-cyan)" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />

      {/* Figure 2 - one arm up */}
      <circle cx="80" cy="24" r="8" fill="var(--nec-pink)" opacity="0.8" />
      <line x1="80" y1="32" x2="80" y2="64" stroke="var(--nec-pink)" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
      <line x1="80" y1="40" x2="66" y2="50" stroke="var(--nec-pink)" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
      <line x1="80" y1="40" x2="96" y2="26" stroke="var(--nec-pink)" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
      <line x1="80" y1="64" x2="70" y2="84" stroke="var(--nec-pink)" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
      <line x1="80" y1="64" x2="90" y2="84" stroke="var(--nec-pink)" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />

      {/* Figure 3 - both arms out */}
      <circle cx="120" cy="22" r="8" fill="var(--nec-gold)" opacity="0.8" />
      <line x1="120" y1="30" x2="120" y2="62" stroke="var(--nec-gold)" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
      <line x1="120" y1="38" x2="104" y2="30" stroke="var(--nec-gold)" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
      <line x1="120" y1="38" x2="136" y2="30" stroke="var(--nec-gold)" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
      <line x1="120" y1="62" x2="110" y2="82" stroke="var(--nec-gold)" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
      <line x1="120" y1="62" x2="130" y2="82" stroke="var(--nec-gold)" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />

      {/* Figure 4 - jumping */}
      <circle cx="160" cy="16" r="8" fill="var(--nec-purple)" opacity="0.8" />
      <line x1="160" y1="24" x2="160" y2="52" stroke="var(--nec-purple)" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
      <line x1="160" y1="32" x2="146" y2="20" stroke="var(--nec-purple)" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
      <line x1="160" y1="32" x2="174" y2="20" stroke="var(--nec-purple)" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
      <line x1="160" y1="52" x2="148" y2="68" stroke="var(--nec-purple)" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
      <line x1="160" y1="52" x2="172" y2="68" stroke="var(--nec-purple)" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />

      {/* Music notes floating */}
      <text x="55" y="14" fontSize="12" fill="var(--nec-cyan)" opacity="0.5">♪</text>
      <text x="100" y="10" fontSize="14" fill="var(--nec-pink)" opacity="0.4">♫</text>
      <text x="142" y="8" fontSize="11" fill="var(--nec-gold)" opacity="0.5">♪</text>
      <text x="175" y="12" fontSize="13" fill="var(--nec-purple)" opacity="0.4">♫</text>

      {/* Ground line */}
      <line x1="10" y1="90" x2="190" y2="90" stroke="var(--nec-border)" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
    </svg>
  )
}

function ConnectionWeb() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto"
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
      className="w-full h-auto"
      aria-hidden="true"
    >
      {/* Speaker figure */}
      <circle cx="80" cy="24" r="12" fill="var(--nec-gold)" opacity="0.8" />
      <line x1="80" y1="36" x2="80" y2="72" stroke="var(--nec-gold)" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
      <line x1="80" y1="46" x2="60" y2="58" stroke="var(--nec-gold)" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
      <line x1="80" y1="46" x2="100" y2="58" stroke="var(--nec-gold)" strokeWidth="3" strokeLinecap="round" opacity="0.8" />

      {/* Podium */}
      <rect x="60" y="72" width="40" height="30" rx="4" fill="var(--nec-purple)" opacity="0.4" />
      <rect x="56" y="68" width="48" height="6" rx="2" fill="var(--nec-purple)" opacity="0.6" />

      {/* Sound/speech waves */}
      <path d="M110 36 Q120 36 120 46" stroke="var(--nec-cyan)" strokeWidth="1.5" fill="none" opacity="0.4" strokeLinecap="round" />
      <path d="M114 30 Q128 30 128 48" stroke="var(--nec-cyan)" strokeWidth="1.5" fill="none" opacity="0.3" strokeLinecap="round" />
      <path d="M118 24 Q136 24 136 50" stroke="var(--nec-cyan)" strokeWidth="1.5" fill="none" opacity="0.2" strokeLinecap="round" />

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
  { text: "Panels that discuss what isn\u2019t discussed enough", icon: "\uD83C\uDFA4" },
  { text: "Workshops that expand your perspective", icon: "\uD83D\uDCA1" },
  { text: "Keynote speakers that change trajectories", icon: "\u2B50" },
  { text: "Community that crosses state lines", icon: "\uD83C\uDF0D" },
  { text: "Dancing and laughing until 3 A.M.", icon: "\uD83D\uDC83" },
  { text: "Spiritual experiences, sober", icon: "\u2728" },
]

export default function YpaaNarrativeSection() {
  return (
    <section id="what-is-ypaa" aria-label="What is a YPAA Convention">
      {/* ═══════════════════════════════════════════
          PART 1: "What is a YPAA?"
          ═══════════════════════════════════════════ */}
      <div className="mb-20">
        {/* Section header */}
        <div className="text-center mb-10">
          <span className="section-badge mb-4 inline-block">About YPAA</span>
          <h2
            className="section-heading mt-3"
            style={{ textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}
          >
            What is a{" "}
            <span
              style={{
                background: "linear-gradient(90deg, var(--nec-purple) 0%, var(--nec-pink) 50%, var(--nec-gold) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              YPAA?
            </span>
          </h2>
        </div>

        {/* Main explainer card */}
        <div
          className="relative overflow-hidden rounded-2xl p-6 sm:p-8 md:p-10 backdrop-blur-sm"
          style={{
            background: "linear-gradient(135deg, rgba(26,16,48,0.85) 0%, rgba(15,10,30,0.95) 100%)",
            border: "1px solid rgba(124,58,237,0.25)",
            boxShadow: "0 4px 40px rgba(0,0,0,0.4), 0 0 80px rgba(124,58,237,0.06)",
          }}
        >
          {/* Decorative corner glows */}
          <div
            className="pointer-events-none absolute -top-20 -right-20 w-64 h-64"
            aria-hidden="true"
            style={{
              background: "radial-gradient(circle, rgba(192,38,211,0.12) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />
          <div
            className="pointer-events-none absolute -bottom-20 -left-20 w-64 h-64"
            aria-hidden="true"
            style={{
              background: "radial-gradient(circle, rgba(124,58,237,0.10) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />

          <div className="relative z-10">
            {/* Lede paragraph */}
            <p className="text-base sm:text-lg md:text-xl leading-relaxed mb-6" style={{ color: "var(--nec-text)" }}>
              A Convention sounds inherently boring.{" "}
              <span style={{ color: "var(--nec-muted)" }}>We&apos;re right there with you.</span>{" "}
              But a YPAA Convention is so much more than the title &ldquo;Convention&rdquo; can convey.
            </p>

            <p className="text-base sm:text-lg leading-relaxed mb-8" style={{ color: "var(--nec-text)" }}>
              It&apos;s being surrounded by hundreds — sometimes <em>thousands</em> — of
              young people passionate about their sobriety. It&apos;s hearing Keynote
              Speakers that change the trajectory of your recovery. It&apos;s dancing and
              laughing until 3&nbsp;A.M. It&apos;s having spiritual experiences sober while
              surrounded by the experience, strength, and hope that AA has to offer.
            </p>

            {/* Graphic: Dancing figures */}
            <div className="max-w-md mx-auto mb-8 opacity-80">
              <DancingFigures />
            </div>

            {/* Topic chips */}
            <div className="mb-6">
              <p
                className="text-sm font-bold uppercase tracking-widest mb-4 text-center"
                style={{ color: "var(--nec-purple)" }}
              >
                What you&apos;ll experience
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {highlights.map((h) => (
                  <div
                    key={h.text}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm"
                    style={{
                      background: "rgba(124,58,237,0.08)",
                      border: "1px solid rgba(124,58,237,0.20)",
                      color: "var(--nec-text)",
                    }}
                  >
                    <span aria-hidden="true">{h.icon}</span>
                    <span>{h.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* The deeper question row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div
                className="rounded-xl p-5 text-center"
                style={{
                  background: "rgba(20,184,166,0.06)",
                  border: "1px solid rgba(20,184,166,0.18)",
                }}
              >
                <div className="mx-auto mb-3 w-12 h-12">
                  <SpeakerPodium />
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--nec-muted)" }}>
                  What is it like to get sober young? To be a parent in sobriety?
                </p>
              </div>
              <div
                className="rounded-xl p-5 text-center"
                style={{
                  background: "rgba(192,38,211,0.06)",
                  border: "1px solid rgba(192,38,211,0.18)",
                }}
              >
                <div className="mx-auto mb-3 w-12 h-12">
                  <ConnectionWeb />
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--nec-muted)" }}>
                  Building community in AA that crosses state and even country lines.
                </p>
              </div>
              <div
                className="rounded-xl p-5 text-center"
                style={{
                  background: "rgba(212,160,23,0.06)",
                  border: "1px solid rgba(212,160,23,0.18)",
                }}
              >
                <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center text-3xl">
                  <span aria-hidden="true">💃</span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--nec-muted)" }}>
                  What does a healthy sober relationship look like? What does joy look like?
                </p>
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
        <div className="text-center mb-12">
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-black leading-tight text-white"
            style={{ textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}
          >
            A YPAA Convention goes{" "}
            <span
              style={{
                background: "linear-gradient(90deg, var(--nec-cyan) 0%, var(--nec-purple) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              something like this.
            </span>
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative max-w-2xl mx-auto">
          {/* Vertical glowing line */}
          <div
            className="absolute left-4 md:left-6 top-0 bottom-0 w-px"
            aria-hidden="true"
            style={{
              background: "linear-gradient(180deg, var(--nec-purple) 0%, var(--nec-pink) 30%, var(--nec-cyan) 60%, var(--nec-gold) 100%)",
              boxShadow: "0 0 8px rgba(124,58,237,0.3)",
            }}
          />

          <div className="space-y-6">
            {narrativeSteps.map((step, i) => (
              <div
                key={i}
                className="relative pl-12 md:pl-16"
              >
                {/* Timeline dot */}
                <div
                  className="absolute left-2.5 md:left-4 top-1.5 w-3 h-3 rounded-full"
                  aria-hidden="true"
                  style={{
                    background: step.color,
                    boxShadow: `0 0 8px ${step.color}`,
                  }}
                />

                <p
                  className={`leading-relaxed ${
                    step.emphasis
                      ? "text-lg sm:text-xl md:text-2xl font-bold"
                      : "text-base sm:text-lg"
                  }`}
                  style={{
                    color: step.emphasis ? "white" : "var(--nec-text)",
                    textShadow: step.emphasis
                      ? `0 0 30px ${step.color}`
                      : undefined,
                  }}
                >
                  {step.text}
                </p>
              </div>
            ))}
          </div>

          {/* ── Welcome Home ── */}
          <div className="relative mt-12 pt-8">
            <div
              className="absolute left-4 md:left-6 -top-0 w-px h-8"
              aria-hidden="true"
              style={{
                background: "linear-gradient(180deg, var(--nec-gold) 0%, transparent 100%)",
              }}
            />
            <div
              className="rounded-2xl p-6 sm:p-8 text-center relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(192,38,211,0.08) 50%, rgba(212,160,23,0.06) 100%)",
                border: "1px solid rgba(124,58,237,0.30)",
                boxShadow: "0 0 60px rgba(124,58,237,0.10), 0 4px 30px rgba(0,0,0,0.3)",
              }}
            >
              {/* Ambient glow */}
              <div
                className="pointer-events-none absolute inset-0"
                aria-hidden="true"
                style={{
                  background: "radial-gradient(ellipse 50% 60% at 50% 50%, rgba(124,58,237,0.08) 0%, transparent 70%)",
                }}
              />

              <div className="relative z-10">
                <p
                  className="text-2xl sm:text-3xl md:text-4xl font-black mb-2"
                  style={{
                    background: "linear-gradient(90deg, var(--nec-purple) 0%, var(--nec-pink) 40%, var(--nec-gold) 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Welcome to YPAA.
                </p>
                <p
                  className="text-xl sm:text-2xl md:text-3xl font-black"
                  style={{
                    color: "white",
                    textShadow: "0 0 30px rgba(124,58,237,0.4)",
                  }}
                >
                  Welcome home.
                </p>

                {/* CTA */}
                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/register"
                    className="btn-primary text-center justify-center"
                  >
                    Register — $40
                  </Link>
                  <Link
                    href="/faq"
                    className="btn-ghost text-center justify-center"
                  >
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
