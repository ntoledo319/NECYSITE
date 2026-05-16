"use client"

import { ExternalLink as ExternalLinkIcon, X } from "lucide-react"
import { useCallback, useEffect, useId, useMemo, useState, type CSSProperties, type ReactNode } from "react"
import { SITE_URL } from "@/lib/constants"
import { useFocusTrap } from "@/lib/use-focus-trap"

type Kind = "aa-resource" | "logistics" | "third-party"

interface ExternalLinkProps {
  href: string
  kind: Kind
  className?: string
  style?: CSSProperties
  children: ReactNode
  showIcon?: boolean
  /** Label announced to screen readers in addition to children */
  srSuffix?: string
}

const KIND_COPY: Record<Kind, { headline: string; body: string }> = {
  "aa-resource": {
    headline: "Heading to an A.A. resource",
    body: "This link goes to another A.A. site we trust, but it's outside necypaact.com — they don't speak for NECYPAA XXXVI.",
  },
  logistics: {
    headline: "Leaving necypaact.com",
    body: "This is a hotel, calendar, or event service we use to handle logistics. They have their own privacy and terms.",
  },
  "third-party": {
    headline: "Leaving necypaact.com",
    body: "This link goes to a site outside A.A. We're sharing it for convenience — we don't endorse anything they say or sell.",
  },
}

function isOffSite(href: string): boolean {
  if (!href) return false
  if (href.startsWith("/") || href.startsWith("#")) return false
  if (href.startsWith("mailto:") || href.startsWith("tel:")) return false
  try {
    const url = new URL(href, SITE_URL)
    const siteHost = new URL(SITE_URL).host
    return url.host !== siteHost
  } catch {
    return false
  }
}

/**
 * Wrap an off-site link. Renders a discreet external-icon indicator and, on
 * activation, an accessible interstitial confirming the destination before
 * navigation. Internal hrefs render as plain anchors.
 *
 * Usage: <ExternalLink href={HOTEL_BOOKING_URL} kind="logistics">Book Hotel</ExternalLink>
 */
export default function ExternalLink({
  href,
  kind,
  className,
  style,
  children,
  showIcon = true,
  srSuffix,
}: ExternalLinkProps) {
  const [open, setOpen] = useState(false)
  const titleId = useId()
  const descId = useId()
  const trapRef = useFocusTrap<HTMLDivElement>(open)

  const offSite = useMemo(() => isOffSite(href), [href])

  const close = useCallback(() => setOpen(false), [])

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (!offSite) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.button === 1) return
      event.preventDefault()
      setOpen(true)
    },
    [offSite],
  )

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
    }
    window.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [open, close])

  if (!offSite) {
    return (
      <a href={href} className={className} style={style}>
        {children}
      </a>
    )
  }

  const copy = KIND_COPY[kind]
  let displayHost = href
  try {
    displayHost = new URL(href).host
  } catch {
    /* leave raw */
  }

  return (
    <>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className={className}
        style={style}
        data-external-kind={kind}
      >
        {children}
        {showIcon ? (
          <ExternalLinkIcon className="ml-1 inline-block h-3 w-3 align-[-0.05em] opacity-80" aria-hidden="true" />
        ) : null}
        <span className="sr-only">
          {" "}
          (opens in new tab{srSuffix ? `, ${srSuffix}` : ""})
        </span>
      </a>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descId}
          className="fixed inset-0 z-[100] flex items-end justify-center p-3 sm:items-center sm:p-6"
        >
          <button
            type="button"
            aria-label="Cancel and stay on this site"
            className="absolute inset-0 cursor-default"
            onClick={close}
            style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(2px)" }}
          />
          <div
            ref={trapRef}
            className="relative z-10 w-full max-w-md rounded-2xl border bg-[var(--nec-card)] p-5 shadow-[0_30px_60px_rgba(0,0,0,0.25)] sm:p-6"
            style={{ borderColor: "var(--nec-border)" }}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-3 top-3 rounded-md p-1 text-[var(--nec-muted)] transition-colors hover:text-[var(--nec-text)]"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.16em]"
              style={{ color: "var(--nec-cyan)" }}
            >
              {copy.headline}
            </p>
            <h2 id={titleId} className="mt-2 text-lg font-semibold text-[var(--nec-text)]">
              You&apos;re about to leave necypaact.com
            </h2>
            <p id={descId} className="mt-2 text-sm leading-6 text-[var(--nec-muted)]">
              {copy.body}
            </p>
            <div className="mt-3 break-all rounded-lg border border-dashed border-[var(--nec-border)] bg-[rgba(var(--nec-card-rgb),0.6)] px-3 py-2 font-mono text-xs text-[var(--nec-text)]">
              {displayHost}
            </div>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row-reverse">
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={close}
                className="btn-primary !min-h-[2.85rem] flex-1 justify-center text-sm sm:flex-none"
              >
                Continue to {displayHost}
              </a>
              <button
                type="button"
                onClick={close}
                className="btn-ghost !min-h-[2.85rem] flex-1 justify-center text-sm sm:flex-none"
              >
                Stay here
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
