"use client"

import Link from "next/link"
import Image from "next/image"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowRight, MapPin, Ticket } from "lucide-react"
import { SPRING_GENTLE } from "@/components/ui/motion-primitives"

const recoveryRoutes = [
  {
    href: "/",
    label: "Back to the homepage",
    description: "Start from the main portal and reorient yourself from there.",
    icon: MapPin,
  },
  {
    href: "/register",
    label: "Go to registration",
    description: "If you came here trying to plan the weekend, this is still the highest-value move.",
    icon: Ticket,
  },
  {
    href: "/events",
    label: "See the road to Hartford",
    description: "The live parts of the site are all on the events side right now.",
    icon: ArrowRight,
  },
]

export default function NotFound() {
  const shouldReduce = useReducedMotion()

  return (
    <div className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-4 py-16 text-center" style={{ backgroundColor: "var(--nec-navy)" }}>
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse at top, rgba(var(--nec-purple-rgb),0.08) 0%, transparent 55%), radial-gradient(ellipse at bottom right, rgba(var(--nec-gold-rgb),0.06) 0%, transparent 60%)",
        }}
      />

      <motion.div
        className="relative z-10 w-full max-w-3xl"
        initial={shouldReduce ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={shouldReduce ? { duration: 0 } : SPRING_GENTLE}
      >
        <div className="rounded-[2rem] border border-[rgba(var(--nec-purple-rgb),0.12)] bg-[rgba(var(--nec-card-rgb),0.9)] px-6 py-8 shadow-[0_24px_60px_rgba(44,24,16,0.10)] md:px-8 md:py-10">
          <span className="section-badge inline-flex">404</span>

          <div className="mx-auto mt-6 w-full max-w-[220px] overflow-hidden rounded-[1.5rem] border border-[rgba(var(--nec-purple-rgb),0.10)] bg-[rgba(var(--nec-purple-rgb),0.04)] p-2">
            <Image
              src="/images/cheshire-cat-portal.jpg"
              alt=""
              width={600}
              height={800}
              sizes="220px"
              className="h-auto w-full rounded-[1.15rem] object-cover"
              aria-hidden="true"
            />
          </div>

          <h1 className="mt-6 text-4xl font-semibold tracking-[-0.04em] text-[var(--nec-text)]">
            Lost in the Mad Realm.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-[var(--nec-muted)]">
            This route is gone, wrong, or never existed in the first place. Instead of dumping you into a dead end,
            here are the three places most likely to get you back on track.
          </p>

          <div className="mt-8 grid gap-3 text-left md:grid-cols-3">
            {recoveryRoutes.map((route) => {
              const Icon = route.icon
              return (
                <Link
                  key={route.href}
                  href={route.href}
                  className="rounded-[1.35rem] border border-[rgba(var(--nec-purple-rgb),0.10)] bg-[rgba(var(--nec-card-rgb),0.86)] px-4 py-4 transition-[transform,border-color,background-color] duration-200 hover:-translate-y-0.5 hover:border-[rgba(var(--nec-purple-rgb),0.18)] hover:bg-[rgba(var(--nec-purple-rgb),0.04)]"
                >
                  <p className="flex items-center gap-2 text-sm font-semibold text-[var(--nec-text)]">
                    <Icon className="h-4 w-4 text-[var(--nec-purple)]" aria-hidden="true" />
                    {route.label}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[var(--nec-muted)]">{route.description}</p>
                </Link>
              )
            })}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
