"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { Share2, X, Check, Copy } from "lucide-react"
import { useFocusTrap } from "@/lib/use-focus-trap"

type SharePlatform = {
  name: string
  icon: React.ReactNode
  action: "link" | "clipboard"
  getUrl?: (url: string, text: string) => string
  toastLabel?: string
}

const PLATFORMS: SharePlatform[] = [
  {
    name: "WhatsApp",
    icon: <WhatsAppIcon />,
    action: "link",
    getUrl: (url, text) => `https://wa.me/?text=${encodeURIComponent(text + "\n" + url)}`,
  },
  {
    name: "iMessage / SMS",
    icon: <SmsIcon />,
    action: "link",
    getUrl: (url, text) => `sms:&body=${encodeURIComponent(text + " " + url)}`,
  },
  {
    name: "Email",
    icon: <EmailIcon />,
    action: "link",
    getUrl: (url, text) =>
      `mailto:?subject=${encodeURIComponent("Check this out — NECYPAA XXXVI")}&body=${encodeURIComponent(text + "\n\n" + url)}`,
  },
  {
    name: "Telegram",
    icon: <TelegramIcon />,
    action: "link",
    getUrl: (url, text) => `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
  },
  {
    name: "Messenger",
    icon: <MessengerIcon />,
    action: "link",
    getUrl: (url) => `fb-messenger://share/?link=${encodeURIComponent(url)}`,
  },
  {
    name: "Signal",
    icon: <SignalIcon />,
    action: "clipboard",
    toastLabel: "Copied — paste in Signal",
  },
  {
    name: "Discord",
    icon: <DiscordIcon />,
    action: "clipboard",
    toastLabel: "Copied — paste in Discord",
  },
  {
    name: "Snapchat",
    icon: <SnapchatIcon />,
    action: "clipboard",
    toastLabel: "Copied — paste in Snapchat",
  },
  {
    name: "GroupMe",
    icon: <GroupMeIcon />,
    action: "clipboard",
    toastLabel: "Copied — paste in GroupMe",
  },
  {
    name: "Kik",
    icon: <KikIcon />,
    action: "clipboard",
    toastLabel: "Copied — paste in Kik",
  },
]

export default function ShareMenu({
  url,
  text = "Check out NECYPAA XXXVI — Escaping the Mad Realm!",
  triggerClassName = "",
  triggerLabel = "Share",
}: {
  url?: string
  text?: string
  triggerClassName?: string
  triggerLabel?: string
}) {
  const [open, setOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const toastTimeout = useRef<ReturnType<typeof setTimeout>>()
  const dialogRef = useFocusTrap<HTMLDivElement>(open)

  const resolvedUrl = url ?? (typeof window !== "undefined" ? window.location.href : "https://www.necypaact.com")

  useEffect(() => {
    if (!open) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", handleEscape)
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = ""
    }
  }, [open])

  useEffect(() => {
    return () => {
      if (toastTimeout.current) clearTimeout(toastTimeout.current)
    }
  }, [])

  const showToast = useCallback((message: string) => {
    if (toastTimeout.current) clearTimeout(toastTimeout.current)
    setToast(message)
    toastTimeout.current = setTimeout(() => setToast(null), 3000)
  }, [])

  const handlePlatformClick = useCallback(
    (platform: SharePlatform) => {
      if (platform.action === "link" && platform.getUrl) {
        window.open(platform.getUrl(resolvedUrl, text), "_blank", "noopener,noreferrer")
        setOpen(false)
      } else if (platform.action === "clipboard") {
        navigator.clipboard
          .writeText(`${text}\n${resolvedUrl}`)
          .then(() => {
            showToast(platform.toastLabel ?? "Copied to clipboard")
          })
          .catch(() => {
            showToast("Could not copy — try copying the URL manually")
          })
      }
    },
    [resolvedUrl, text, showToast]
  )

  const handleCopyLink = useCallback(() => {
    navigator.clipboard
      .writeText(resolvedUrl)
      .then(() => showToast("Link copied to clipboard"))
      .catch(() => showToast("Could not copy"))
  }, [resolvedUrl, showToast])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-1.5 ${triggerClassName}`}
        aria-label={`Share: ${triggerLabel}`}
      >
        <Share2 className="w-4 h-4" aria-hidden="true" />
        {triggerLabel}
      </button>

      {/* Backdrop */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- backdrop dismiss supplements Escape key */}
      <div
        className={`fixed inset-0 z-[60] transition-opacity duration-200 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
        onClick={() => setOpen(false)}
      />

      {/* Share sheet */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Share this page"
        className={`fixed bottom-0 left-0 right-0 z-[61] transition-transform duration-200 md:bottom-auto md:top-1/2 md:left-1/2 md:right-auto md:max-w-md md:w-full md:-translate-x-1/2 md:-translate-y-1/2 ${
          open ? "translate-y-0 md:translate-y-[-50%]" : "translate-y-full md:translate-y-[calc(-50%+2rem)] md:opacity-0"
        } ${open ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        <div
          className="nec-share-sheet rounded-t-2xl md:rounded-2xl p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] md:pb-5"
          style={{
            background: "var(--nec-card)",
            border: "1px solid var(--nec-border)",
            boxShadow: "0 -8px 40px rgba(0,0,0,0.08), 0 2px 12px rgba(0,0,0,0.04)",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-[var(--nec-text)]">Share</h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-lg text-[var(--nec-muted)] hover:text-[var(--nec-text)] nec-nav-hover transition-colors"
              aria-label="Close share menu"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {/* Platform grid */}
          <div className="grid grid-cols-5 gap-3 mb-4" role="group" aria-label="Sharing platforms">
            {PLATFORMS.map((platform) => (
              <button
                key={platform.name}
                type="button"
                onClick={() => handlePlatformClick(platform)}
                className="flex flex-col items-center gap-1.5 p-2 rounded-xl transition-colors hover:bg-white/5 focus-visible:bg-white/5 group"
                aria-label={`Share via ${platform.name}${platform.action === "clipboard" ? " (copies to clipboard)" : ""}`}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-105"
                  style={{
                    background: "rgba(124,58,237,0.10)",
                    border: "1px solid rgba(124,58,237,0.25)",
                  }}
                >
                  {platform.icon}
                </div>
                <span className="text-[10px] text-[var(--nec-muted)] leading-tight text-center font-medium">
                  {platform.name}
                </span>
              </button>
            ))}
          </div>

          {/* Copy link row */}
          <button
            type="button"
            onClick={handleCopyLink}
            className="w-full flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-white/5"
            style={{ border: "1px solid var(--nec-border)" }}
          >
            <div
              className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "rgba(124,58,237,0.10)" }}
            >
              <Copy className="w-4 h-4 text-[var(--nec-muted)]" aria-hidden="true" />
            </div>
            <span className="text-sm text-[var(--nec-muted)] font-medium truncate flex-1 text-left">
              {resolvedUrl}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--nec-cyan)" }}>
              Copy
            </span>
          </button>
        </div>
      </div>

      {/* Toast notification */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-[70] transition-all duration-200 ${
          toast ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
        }`}
      >
        {toast && (
          <div
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-[var(--nec-text)]"
            style={{
              background: "var(--nec-card)",
              border: "1px solid rgba(var(--nec-purple-rgb),0.20)",
              boxShadow: "var(--shadow-card)",
              backdropFilter: "blur(12px)",
            }}
          >
            <Check className="w-4 h-4 flex-shrink-0" style={{ color: "var(--nec-cyan)" }} aria-hidden="true" />
            {toast}
          </div>
        )}
      </div>
    </>
  )
}

/* ── Platform SVG Icons (16×16) ──────────────────────── */

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"
        fill="#e8e0f0"
      />
      <path
        d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.963 7.963 0 01-4.104-1.136l-.296-.178-2.868.852.852-2.868-.178-.296A7.963 7.963 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"
        fill="#e8e0f0"
      />
    </svg>
  )
}

function SmsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"
        fill="#e8e0f0"
      />
      <path d="M7 9h2v2H7V9zm4 0h2v2h-2V9zm4 0h2v2h-2V9z" fill="#e8e0f0" />
    </svg>
  )
}

function EmailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
        fill="#e8e0f0"
      />
    </svg>
  )
}

function TelegramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"
        fill="#e8e0f0"
      />
    </svg>
  )
}

function MessengerIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.2 5.42 3.15 7.18V22l3.04-1.67c.81.23 1.67.35 2.56.37h.25c5.64 0 10-4.13 10-9.7S17.64 2 12 2zm1.05 13.06l-2.55-2.73L5.63 15.2l4.87-5.17 2.55 2.73 4.87-5.17-4.87 5.47z"
        fill="#e8e0f0"
      />
    </svg>
  )
}

function SignalIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-4-4 1.41-1.41L11 14.17l6.59-6.59L19 9l-8 8z"
        fill="#e8e0f0"
      />
    </svg>
  )
}

function DiscordIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.009c.12.099.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.947 2.418-2.157 2.418z"
        fill="#e8e0f0"
      />
    </svg>
  )
}

function SnapchatIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12.206 1c.266.005.986.026 1.755.318.865.328 1.563.881 2.07 1.645.44.664.657 1.45.657 2.374 0 .348-.028.693-.058.995l-.016.173c-.017.193-.03.339-.03.445 0 .144.041.211.095.261.08.073.199.12.385.12.21 0 .48-.066.79-.154.12-.034.23-.052.34-.052.305 0 .564.127.73.357.189.263.208.602.049.882-.201.355-.578.535-.934.636-.178.05-.37.096-.554.14l-.118.028c-.392.097-.698.213-.926.357-.37.233-.512.526-.512.907l.002.058c.066.696.416 1.322.992 1.78.446.355.992.612 1.574.765.145.038.275.088.388.152.29.163.457.413.457.686 0 .306-.194.578-.563.787-.455.259-1.104.418-1.816.517-.07.01-.118.06-.133.13-.05.233-.109.483-.233.674-.139.214-.329.331-.598.34h-.013c-.114 0-.247-.024-.407-.06-.254-.056-.544-.12-.924-.12-.158 0-.322.013-.487.04-.502.084-.934.32-1.383.565-.621.338-1.263.688-2.178.688-.031 0-.062 0-.094-.003-.032.002-.066.003-.098.003-.915 0-1.557-.35-2.178-.688-.45-.245-.881-.481-1.383-.565a3.504 3.504 0 00-.487-.04c-.39 0-.685.067-.94.124-.147.033-.275.056-.39.056h-.014c-.268-.009-.458-.126-.597-.34-.124-.19-.183-.44-.233-.673-.015-.07-.063-.121-.133-.13-.712-.099-1.361-.258-1.816-.517-.369-.21-.563-.481-.563-.787 0-.273.168-.523.457-.686.113-.064.243-.114.389-.152.58-.153 1.127-.41 1.573-.765.576-.458.926-1.084.992-1.78l.002-.058c0-.381-.141-.674-.512-.907a3.865 3.865 0 00-.926-.357l-.118-.028a7.9 7.9 0 01-.554-.14c-.356-.101-.733-.281-.934-.636-.159-.28-.14-.619.049-.882.166-.23.425-.357.73-.357.11 0 .22.018.34.052.31.088.58.154.79.154.186 0 .305-.047.385-.12.054-.05.095-.117.095-.26 0-.107-.013-.253-.03-.446l-.016-.173a7.85 7.85 0 01-.058-.995c0-.925.218-1.71.657-2.374.507-.764 1.205-1.317 2.07-1.645C11.02 1.026 11.74 1.005 12.006 1h.2z"
        fill="#e8e0f0"
      />
    </svg>
  )
}

function GroupMeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2C6.48 2 2 5.58 2 10c0 2.24 1.12 4.27 2.96 5.72-.14 1.58-.86 2.96-.87 2.98-.04.08-.01.18.07.23.03.02.07.03.1.03.12 0 1.96-.52 3.48-1.36.71.22 1.47.36 2.26.4h.01c.34 0 .67-.02 1-.06C11.01 21.11 14.16 22 16 22c.84 0 1.64-.13 2.4-.36 1.05.58 2.33.93 2.43.96.03.01.06.01.09.01.09 0 .17-.07.19-.16.01-.04-.01-.08-.04-.12-.01-.02-.51-.98-.64-2.08C21.44 19.04 22 17.58 22 16c0-3.31-2.69-6-6-6-.34 0-.67.02-1 .06C14.99 6.1 13.67 3.5 12 2z"
        fill="#e8e0f0"
      />
    </svg>
  )
}

function KikIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14H8V8h2v8zm6-3.5L13.5 15 16 17.5h-2.5L11 15l2.5-2.5L11 10h2.5l2.5 2.5V8h2v8h-2v-5.5z"
        fill="#e8e0f0"
      />
    </svg>
  )
}
