"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { HOTEL_BOOKING_URL } from "@/lib/constants"

export default function MobileCtaBar() {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setHidden(document.body.style.overflow === "hidden")
    })
    observer.observe(document.body, { attributes: true, attributeFilter: ["style"] })
    return () => observer.disconnect()
  }, [])

  return (
    <nav
      aria-label="Quick actions"
      className={`sticky-cta-bar fixed bottom-0 left-0 right-0 md:hidden flex gap-2 px-3 pt-3 transition-transform duration-200 ${hidden ? "translate-y-full" : "translate-y-0"}`}
      style={{
        background: "rgba(15,10,30,0.98)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderTop: "1px solid rgba(45,31,78,0.6)",
        boxShadow: "0 -4px 24px rgba(0,0,0,0.4)",
        paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
      }}
    >
      <Link
        href="/register"
        className="btn-primary flex-1 !py-2.5 !text-sm"
      >
        Register — $40
      </Link>
      <a
        href={HOTEL_BOOKING_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-secondary flex-1 !py-2.5 !text-sm"
      >
        Book Hotel<span className="sr-only"> (opens in new tab)</span>
      </a>
    </nav>
  )
}
