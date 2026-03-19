"use client"

import { useEffect } from "react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Page error:", error)
  }, [error])

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ backgroundColor: "var(--nec-navy)" }}
    >
      <div className="max-w-md w-full text-center space-y-6">
        <div
          className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
          style={{
            background: "rgba(124,58,237,0.15)",
            border: "2px solid rgba(124,58,237,0.4)",
          }}
          aria-hidden="true"
        >
          <span className="text-2xl">⚙</span>
        </div>
        <h1
          className="text-2xl font-black"
          style={{ color: "var(--nec-text)" }}
        >
          Something went wrong
        </h1>
        <p style={{ color: "var(--nec-muted)" }}>
          We hit an unexpected snag. You can try again, or head back to the
          homepage.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={reset}
            className="btn-primary"
          >
            Try Again
          </button>
          <Link href="/" className="btn-ghost">
            Go Home
          </Link>
        </div>
        {error.digest && (
          <p
            className="text-xs"
            style={{ color: "var(--nec-muted)" }}
          >
            Error reference: {error.digest}
          </p>
        )}
      </div>
    </div>
  )
}
