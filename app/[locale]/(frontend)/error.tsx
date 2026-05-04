"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { Mail } from "lucide-react"
import { CONTACT_EMAIL } from "@/lib/constants"
import PageArtAccents from "@/components/art/page-art-accents"

const AUTO_RETRY_SECONDS = 10

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const [countdown, setCountdown] = useState(AUTO_RETRY_SECONDS)
  const [autoRetryActive, setAutoRetryActive] = useState(true)

  const cancelAutoRetry = useCallback(() => {
    setAutoRetryActive(false)
  }, [])

  useEffect(() => {
    console.error("Page error:", error)
  }, [error])

  useEffect(() => {
    if (!autoRetryActive) return
    if (countdown <= 0) {
      reset()
      return
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown, autoRetryActive, reset])

  return (
    <div
      className="min-h-screen-safe relative flex min-h-screen flex-col justify-center overflow-hidden px-4 py-16"
      style={{ backgroundColor: "var(--nec-navy)" }}
    >
      <PageArtAccents character="mad-hatter" accentColor="var(--nec-purple)" variant="subtle" dividerVariant="gear" />

      <div className="relative z-10 mx-auto w-full max-w-5xl">
        <div className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
          <div className="relative overflow-hidden rounded-[2rem] border border-[rgba(var(--nec-purple-rgb),0.16)] bg-[linear-gradient(145deg,rgba(var(--nec-purple-rgb),0.08),rgba(var(--nec-card-rgb),0.92))] p-5 shadow-[0_22px_54px_rgba(44,24,16,0.08)]">
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
              <div className="absolute left-6 top-6 h-16 w-16 rounded-full border border-[rgba(var(--nec-purple-rgb),0.16)]" />
              <div className="absolute right-8 top-8 h-12 w-20 rounded-[1rem] border border-[rgba(var(--nec-cyan-rgb),0.14)]" />
            </div>
            <div className="relative overflow-hidden rounded-[1.4rem] border border-[rgba(var(--nec-purple-rgb),0.14)] bg-[rgba(var(--nec-card-rgb),0.88)] p-2">
              <Image
                src="/images/mad-hatter-portal.webp"
                alt=""
                width={900}
                height={1200}
                sizes="(min-width: 1024px) 36vw, 100vw"
                className="h-full w-full rounded-[1rem] object-cover"
                aria-hidden="true"
              />
            </div>
          </div>

          <div className="max-w-xl">
            <div className="nec-reg-card p-8 md:p-10">
              <div
                className="nec-error-icon mb-6 flex h-16 w-16 items-center justify-center rounded-full"
                aria-hidden="true"
              >
                <span className="text-2xl">⚙</span>
              </div>
              <h1 className="mb-3 text-3xl font-black text-[var(--nec-text)] md:text-4xl">Something went wrong</h1>
              <p className="leading-7 text-[var(--nec-muted)]">
                We hit an unexpected snag. You can try again, or head back to the homepage.
              </p>

              {autoRetryActive && (
                <p className="mt-5 text-sm text-[var(--nec-muted)]" aria-live="polite" aria-atomic="true">
                  Retrying in {countdown}…{" "}
                  <button
                    type="button"
                    onClick={cancelAutoRetry}
                    className="underline transition-colors hover:text-[var(--nec-text)]"
                  >
                    Cancel
                  </button>
                </p>
              )}

              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
                <button onClick={reset} className="btn-primary w-full sm:w-auto">
                  Try Again
                </button>
                <Link href="/" className="btn-ghost w-full sm:w-auto">
                  Go Home
                </Link>
              </div>

              <div className="mt-6 border-t border-[var(--nec-border)] pt-4">
                <a
                  href={`mailto:${CONTACT_EMAIL}?subject=Site%20Error${error.digest ? `%20(${error.digest})` : ""}`}
                  className="inline-flex items-center gap-1.5 text-xs text-[var(--nec-muted)] transition-colors hover:text-[var(--nec-text)]"
                >
                  <Mail className="h-3 w-3" aria-hidden="true" />
                  Still having trouble? Let us know — {CONTACT_EMAIL}
                </a>
              </div>

              {error.digest && <p className="mt-3 text-xs text-[var(--nec-muted)]">Error reference: {error.digest}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
