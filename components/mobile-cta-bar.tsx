"use client"

import { useEffect, useRef } from "react"
import { Link } from "@/i18n/navigation"
import { HOTEL_BOOKING_URL } from "@/lib/constants"

export default function MobileCtaBar() {
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (!navRef.current) return
      navRef.current.style.transform = document.body.style.overflow === "hidden" ? "translateY(100%)" : ""
    })
    observer.observe(document.body, { attributes: true, attributeFilter: ["style"] })
    return () => observer.disconnect()
  }, [])

  return (
    <nav
      ref={navRef}
      aria-label="Quick actions"
      className="sticky-cta-bar fixed bottom-0 left-0 right-0 flex gap-3 px-3 pt-3 md:hidden"
      style={{
        background: "rgba(var(--nec-navy-rgb),0.96)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderTop: "1px solid var(--nec-border)",
        boxShadow: "0 -4px 24px rgba(0,0,0,0.06)",
        paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
        transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <Link
        href="/register"
        className="btn-primary flex-1 !py-3 !text-sm"
        style={{
          backgroundColor: "#6B3060",
          borderColor: "rgba(107,48,96,0.34)",
          color: "#fff",
        }}
      >
        Register
      </Link>
      <a
        href={HOTEL_BOOKING_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-secondary flex-1 !py-3 !text-sm"
        style={{
          backgroundColor: "#7A5B0D",
          borderColor: "rgba(122,91,13,0.34)",
          color: "#fdf8ee",
        }}
      >
        Book Hotel<span className="sr-only"> (opens in new tab)</span>
      </a>
    </nav>
  )
}
