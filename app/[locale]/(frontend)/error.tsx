"use client"

import { useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import PageArtAccents from "@/components/art/page-art-accents"

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
      className="min-h-screen min-h-screen-safe flex flex-col justify-center px-4 py-16 relative overflow-hidden"
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
                src="/images/mad-hatter-portal.jpg"
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
                className="nec-error-icon w-16 h-16 rounded-full flex items-center justify-center mb-6"
                aria-hidden="true"
              >
                <span className="text-2xl">⚙</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-[var(--nec-text)] mb-3">
                Something went wrong
              </h1>
              <p className="text-[var(--nec-muted)] leading-7">
                We hit an unexpected snag. You can try again, or head back to the
                homepage.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={reset}
                  className="btn-primary w-full sm:w-auto"
                >
                  Try Again
                </button>
                <Link href="/" className="btn-ghost w-full sm:w-auto">
                  Go Home
                </Link>
              </div>

              {error.digest && (
                <p className="text-xs text-[var(--nec-muted)] mt-6">
                  Error reference: {error.digest}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
