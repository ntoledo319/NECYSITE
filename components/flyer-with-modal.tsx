"use client"

import { Search, X } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useFocusTrap } from "@/lib/use-focus-trap"

interface FlyerWithModalProps {
  src: string
  alt: string
  title?: string
  className?: string
  sizes?: string
}

export default function FlyerWithModal({ src, alt, title, className = "", sizes }: FlyerWithModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const modalRef = useFocusTrap<HTMLDivElement>(isOpen)

  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false)
    }
    window.addEventListener("keydown", handleEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen])

  return (
    <>
      <button
        type="button"
        className={`group relative isolate cursor-pointer overflow-hidden rounded-[1.1rem] border border-[rgba(var(--nec-purple-rgb),0.10)] bg-[rgba(var(--nec-card-rgb),0.88)] p-0 shadow-[0_18px_38px_rgba(44,24,16,0.08)] transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-[rgba(var(--nec-purple-rgb),0.18)] hover:shadow-[0_22px_44px_rgba(44,24,16,0.12)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nec-purple)] ${className}`}
        onClick={() => setIsOpen(true)}
        aria-label={`Enlarge flyer: ${alt}`}
      >
        <Image
          src={src || "/placeholder.svg"}
          alt={alt}
          width={400}
          height={600}
          sizes={sizes || "(min-width: 768px) 400px, 100vw"}
          loading="lazy"
          className="h-full w-full object-contain rounded-[1.1rem]"
        />
        <span
          className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-[rgba(31,22,18,0.82)] via-[rgba(31,22,18,0.24)] to-transparent px-3 py-3 text-left text-[var(--nec-text)] opacity-95 transition-opacity duration-200 group-hover:opacity-100"
          aria-hidden="true"
        >
          <span className="max-w-[70%]">
            <span className="block text-[11px] uppercase tracking-[0.18em] text-[rgba(255,255,255,0.72)]">
              Tap To Expand
            </span>
            <span className="mt-1 block text-sm font-semibold leading-5 text-white">
              {title ?? alt}
            </span>
          </span>
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(255,255,255,0.18)] bg-[rgba(var(--nec-card-rgb),0.18)] shadow-[0_8px_24px_rgba(0,0,0,0.18)]">
            <Search className="h-4 w-4 text-white" />
          </span>
        </span>
      </button>

      {isOpen && (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions -- backdrop dismiss is supplementary to Escape key and close button
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(30,22,18,0.72)] px-4 py-6 backdrop-blur-md md:px-8"
          role="dialog"
          aria-modal="true"
          aria-label="Enlarged flyer image"
          onClick={() => setIsOpen(false)}
        >
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- stopPropagation prevents accidental close when interacting with the dialog surface */}
          <div
            ref={modalRef}
            className="relative w-full max-w-5xl rounded-[1.75rem] border border-[rgba(var(--nec-purple-rgb),0.12)] bg-[rgba(var(--nec-card-rgb),0.97)] p-3 shadow-[0_30px_90px_rgba(20,14,10,0.28)] md:p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-start justify-between gap-4 px-1 md:mb-4 md:px-2">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--nec-purple)]">
                  Event Flyer
                </p>
                <h2 className="mt-2 text-lg font-semibold leading-tight text-[var(--nec-text)] md:text-xl">
                  {title ?? alt}
                </h2>
                <p className="mt-1 text-sm text-[var(--nec-muted)]">
                  Tap outside or press Escape to close.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-[rgba(var(--nec-purple-rgb),0.14)] bg-[rgba(var(--nec-card-rgb),0.92)] text-[var(--nec-muted)] transition-[border-color,background,color] duration-200 hover:border-[rgba(var(--nec-purple-rgb),0.22)] hover:bg-[rgba(var(--nec-purple-rgb),0.05)] hover:text-[var(--nec-text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nec-purple)]"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="rounded-[1.35rem] border border-[rgba(var(--nec-purple-rgb),0.10)] bg-[linear-gradient(180deg,rgba(var(--nec-purple-rgb),0.03),rgba(var(--nec-card-rgb),0.9))] p-2 md:p-3">
              <Image
                src={src || "/placeholder.svg"}
                alt={alt}
                width={1200}
                height={1600}
                sizes="90vw"
                className="h-auto max-h-[calc(100dvh-11rem)] w-full rounded-[1.1rem] object-contain md:max-h-[calc(100dvh-12rem)]"
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
