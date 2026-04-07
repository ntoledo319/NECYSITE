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
      className={`back-to-top-btn fixed bottom-20 right-4 md:bottom-8 md:right-6 z-40 w-10 h-10 rounded-xl flex items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nec-purple)] ${visible ? "back-to-top-visible" : ""}`}
      style={{
        background: "rgba(var(--nec-card-rgb),0.9)",
        border: "1px solid rgba(var(--nec-purple-rgb),0.2)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.4), 0 0 12px rgba(124,58,237,0.15)",
        color: "var(--nec-purple)",
      }}
    >
      <ArrowUp className="w-5 h-5" aria-hidden="true" />
    </button>
  )
}
