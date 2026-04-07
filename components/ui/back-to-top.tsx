"use client"

import { useState, useEffect, useCallback } from "react"
import { ArrowUp } from "lucide-react"

export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(() => {
          setVisible(window.scrollY > 600)
          ticking = false
        })
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={scrollToTop}
      className={`back-to-top-btn fixed bottom-20 right-4 z-40 inline-flex h-11 min-w-11 items-center justify-center gap-2 rounded-full px-3.5 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nec-purple)] md:bottom-8 md:right-6 ${visible ? "back-to-top-visible" : ""}`}
      style={{
        background: "rgba(var(--nec-card-rgb),0.95)",
        border: "1px solid rgba(var(--nec-purple-rgb),0.16)",
        boxShadow: "0 18px 40px rgba(44, 24, 16, 0.12), 0 2px 6px rgba(0, 0, 0, 0.03)",
        color: "var(--nec-text)",
      }}
    >
      <ArrowUp className="h-4 w-4 text-[var(--nec-purple)]" aria-hidden="true" />
      <span className="hidden sm:inline">Back to top</span>
    </button>
  )
}
