"use client"

import { useEffect, useRef } from "react"

export default function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let raf = 0
    const tick = () => {
      const doc = document.documentElement
      const h = doc.scrollHeight - doc.clientHeight
      if (ref.current) ref.current.style.transform = `scaleX(${h > 0 ? doc.scrollTop / h : 0})`
      raf = 0
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(tick) }
    window.addEventListener("scroll", onScroll, { passive: true })
    tick()
    return () => { window.removeEventListener("scroll", onScroll); if (raf) cancelAnimationFrame(raf) }
  }, [])

  return (
    <div
      ref={ref}
      className="scroll-progress-bar fixed left-0 right-0 top-0 z-[60] h-[2px] origin-left"
      style={{
        background: "linear-gradient(90deg, var(--nec-purple) 0%, var(--nec-pink) 50%, var(--nec-gold) 100%)",
        boxShadow: "0 0 8px rgba(var(--nec-purple-rgb),0.20), 0 0 16px rgba(var(--nec-pink-rgb),0.10)",
      }}
      aria-hidden="true"
    />
  )
}
