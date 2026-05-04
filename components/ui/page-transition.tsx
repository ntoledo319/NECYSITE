"use client"

import { usePathname } from "next/navigation"
import { useEffect, useRef, type ReactNode } from "react"

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const ref = useRef<HTMLDivElement>(null)
  const prevPathname = useRef(pathname)

  useEffect(() => {
    if (pathname === prevPathname.current) return
    prevPathname.current = pathname

    const el = ref.current
    if (!el) return

    // Exit: fade out + slight scale down + lift
    el.style.opacity = "0"
    el.style.transform = "translateY(6px) scale(0.995)"
    el.style.transition = "none"

    // Next frame: enter with smooth spring-like easing
    requestAnimationFrame(() => {
      el.style.transition = "opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)"
      el.style.opacity = "1"
      el.style.transform = "translateY(0) scale(1)"
    })
  }, [pathname])

  return (
    <div ref={ref} className="page-transition">
      {children}
    </div>
  )
}
