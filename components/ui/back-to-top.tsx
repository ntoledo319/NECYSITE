"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { ArrowUp } from "lucide-react"
import { SPRING_SNAPPY } from "@/components/ui/motion-primitives"

export default function BackToTop() {
  const [visible, setVisible] = useState(false)
  const shouldReduce = useReducedMotion()

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: shouldReduce ? "auto" : "smooth" })
  }, [shouldReduce])

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          aria-label="Back to top"
          onClick={scrollToTop}
          className="fixed bottom-20 right-4 md:bottom-8 md:right-6 z-40 w-10 h-10 rounded-xl flex items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nec-purple)]"
          style={{
            background: "rgba(26,16,48,0.9)",
            border: "1px solid rgba(124,58,237,0.3)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.4), 0 0 12px rgba(124,58,237,0.15)",
            color: "var(--nec-purple)",
          }}
          initial={shouldReduce ? false : { opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          transition={shouldReduce ? { duration: 0 } : SPRING_SNAPPY}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowUp className="w-5 h-5" aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
