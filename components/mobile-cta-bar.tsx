"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { HOTEL_BOOKING_URL } from "@/lib/constants"
import { SPRING_SNAPPY } from "@/components/ui/motion-primitives"

export default function MobileCtaBar() {
  const [hidden, setHidden] = useState(false)
  const shouldReduce = useReducedMotion()

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setHidden(document.body.style.overflow === "hidden")
    })
    observer.observe(document.body, { attributes: true, attributeFilter: ["style"] })
    return () => observer.disconnect()
  }, [])

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.nav
          aria-label="Quick actions"
          className="sticky-cta-bar fixed bottom-0 left-0 right-0 flex gap-3 px-3 pt-3 md:hidden"
          style={{
            background: "rgba(var(--nec-navy-rgb),0.96)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderTop: "1px solid var(--nec-border)",
            boxShadow: "0 -4px 24px rgba(0,0,0,0.06)",
            paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
          }}
          initial={shouldReduce ? false : { y: 80 }}
          animate={{ y: 0 }}
          exit={{ y: 80 }}
          transition={shouldReduce ? { duration: 0 } : SPRING_SNAPPY}
        >
          <Link
            href="/register"
            className="btn-primary flex-1 !py-3 !text-sm"
            style={{
              backgroundColor: "#6B3060",
              borderColor: "rgba(107,48,96,0.34)",
              color: "#fff",
            }}
          >
            Register
          </Link>
          <a
            href={HOTEL_BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary flex-1 !py-3 !text-sm"
            style={{
              backgroundColor: "#7A5B0D",
              borderColor: "rgba(122,91,13,0.34)",
              color: "#fdf8ee",
            }}
          >
            Book Hotel<span className="sr-only"> (opens in new tab)</span>
          </a>
        </motion.nav>
      )}
    </AnimatePresence>
  )
}
