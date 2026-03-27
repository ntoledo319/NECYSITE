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

    el.style.opacity = "0"
    el.style.transform = "translateY(8px)"
    requestAnimationFrame(() => {
      el.style.transition = "opacity 0.25s ease, transform 0.25s ease"
      el.style.opacity = "1"
      el.style.transform = "translateY(0)"
    })
  }, [pathname])

  return (
    <div ref={ref} className="page-transition">
      {children}
    </div>
  )
}
