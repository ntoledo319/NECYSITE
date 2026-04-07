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
          className="nec-error-icon w-16 h-16 mx-auto rounded-full flex items-center justify-center"
          aria-hidden="true"
        >
          <span className="text-2xl">⚙</span>
        </div>
        <h1 className="text-2xl font-black text-[var(--nec-text)]">
          Something went wrong
        </h1>
        <p className="text-[var(--nec-muted)]">
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
          <p className="text-xs text-[var(--nec-muted)]">
            Error reference: {error.digest}
          </p>
        )}
      </div>
    </div>
  )
}
