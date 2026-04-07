"use client"

import { useState, useEffect, useCallback } from "react"

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  const onScroll = useCallback(() => {
    const scrollTop = document.documentElement.scrollTop
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
    setProgress(scrollHeight > 0 ? scrollTop / scrollHeight : 0)
  }, [])

  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(() => {
          onScroll()
          ticking = false
        })
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [onScroll])

  return (
    <div
      className="scroll-progress-bar fixed top-0 left-0 right-0 h-[2px] z-[60] origin-left"
      style={{
        transform: `scaleX(${progress})`,
        background:
          "linear-gradient(90deg, var(--nec-purple) 0%, var(--nec-pink) 50%, var(--nec-gold) 100%)",
        boxShadow: "0 0 8px rgba(var(--nec-purple-rgb),0.20), 0 0 16px rgba(var(--nec-pink-rgb),0.10)",
      }}
      aria-hidden="true"
    />
  )
}
