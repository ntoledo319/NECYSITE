"use client"

import { useEffect, useRef } from "react"

/**
 * Lightweight scroll-reveal hook using IntersectionObserver.
 * Adds the `.revealed` class when the element enters the viewport.
 * Respects reduced-motion by applying `.revealed` immediately.
 *
 * @param threshold - visibility ratio to trigger (0-1), default 0.15
 * @param rootMargin - observer root margin, default "0px 0px -40px 0px"
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.15,
  rootMargin = "0px 0px -40px 0px",
) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // If user prefers reduced motion, reveal immediately
    const prefersReducedMotion =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      document.documentElement.classList.contains("a11y-reduce-motion")

    if (prefersReducedMotion) {
      el.classList.add("revealed")
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("revealed")
          observer.unobserve(el)
        }
      },
      { threshold, rootMargin },
    )

    observer.observe(el)

    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return ref
}
