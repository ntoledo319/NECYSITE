"use client"

import { useEffect, useRef, type ReactNode } from "react"

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  delay?: 0 | 1 | 2 | 3
  as?: "div" | "section"
}

/**
 * Lightweight scroll-triggered reveal — CSS transitions + IntersectionObserver.
 * Zero animation library dependency. Respects prefers-reduced-motion.
 * Replaces the framer-motion version with identical visual behavior.
 */
export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("sr-revealed")
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("sr-revealed")
          observer.disconnect()
        }
      },
      { rootMargin: "-60px", threshold: 0 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const delayClass = delay > 0 ? ` sr-delay-${delay}` : ""

  return (
    <Tag ref={ref as React.RefObject<never>} className={`sr-reveal${delayClass} ${className}`}>
      {children}
    </Tag>
  )
}
