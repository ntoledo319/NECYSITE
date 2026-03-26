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
          className="sticky-cta-bar fixed bottom-0 left-0 right-0 md:hidden flex gap-2 px-3 pt-3"
          style={{
            background: "rgba(15,10,30,0.98)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderTop: "1px solid rgba(45,31,78,0.6)",
            boxShadow: "0 -4px 24px rgba(0,0,0,0.4)",
            paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
          }}
          initial={shouldReduce ? false : { y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={shouldReduce ? { duration: 0 } : SPRING_SNAPPY}
        >
          <Link
            href="/register"
            className="btn-primary flex-1 !py-2.5 !text-sm"
          >
            Register — $40
          </Link>
          <a
            href={HOTEL_BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary flex-1 !py-2.5 !text-sm"
          >
            Book Hotel<span className="sr-only"> (opens in new tab)</span>
          </a>
        </motion.nav>
      )}
    </AnimatePresence>
  )
}
