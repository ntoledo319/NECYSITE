"use client"

import { useEffect } from "react"
import Link from "next/link"
import { RotateCcw, Home, Wrench } from "lucide-react"

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
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-16" style={{ backgroundColor: "var(--nec-navy)" }}>
      <div className="w-full max-w-2xl rounded-[2rem] border border-[rgba(var(--nec-purple-rgb),0.12)] bg-[rgba(var(--nec-card-rgb),0.9)] px-6 py-8 text-center shadow-[0_24px_60px_rgba(44,24,16,0.10)] md:px-8 md:py-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[rgba(var(--nec-purple-rgb),0.14)] bg-[rgba(var(--nec-purple-rgb),0.06)]">
          <Wrench className="h-7 w-7 text-[var(--nec-purple)]" aria-hidden="true" />
        </div>

        <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--nec-purple)]">
          Route Error
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-[var(--nec-text)]">
          Something slipped sideways.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-[var(--nec-muted)]">
          This page hit an unexpected snag. Try loading it once more, or head back to the homepage and take another route in.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button type="button" onClick={reset} className="btn-primary inline-flex items-center justify-center gap-2">
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Try Again
          </button>
          <Link href="/" className="btn-ghost inline-flex items-center justify-center gap-2">
            <Home className="h-4 w-4" aria-hidden="true" />
            Go Home
          </Link>
        </div>

        {error.digest && (
          <p className="mt-6 text-xs text-[var(--nec-muted)]">
            Error reference: {error.digest}
          </p>
        )}
      </div>
    </div>
  )
}
