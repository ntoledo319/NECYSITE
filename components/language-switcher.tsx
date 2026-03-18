"use client"

import { useState, useEffect, useRef } from "react"
import { Globe } from "lucide-react"

const locales = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "es", label: "Español", flag: "🇪🇸" },
] as const

/**
 * Language switcher component (unstyled, ready to theme).
 *
 * Currently a visual placeholder — locale routing (/en/..., /es/...)
 * is not yet active. When the app migrates to [locale] route segments,
 * this component will navigate to the equivalent page in the selected locale.
 *
 * For now, it demonstrates the UI pattern and can be dropped into the
 * header or footer.
 */
export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState<"en" | "es">("en")
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    window.addEventListener("keydown", handleEscape)
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      window.removeEventListener("keydown", handleEscape)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open])

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
        style={{
          color: "var(--nec-muted)",
          border: "1px solid var(--nec-border)",
          background: "transparent",
        }}
        aria-label="Change language"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <Globe className="w-3.5 h-3.5" />
        {locales.find((l) => l.code === current)?.flag}
        <span className="hidden sm:inline">
          {locales.find((l) => l.code === current)?.label}
        </span>
      </button>

      {open && (
        <div
          className="absolute right-0 mt-1 rounded-lg overflow-hidden shadow-lg z-50"
          style={{
            background: "rgba(26,16,48,0.98)",
            border: "1px solid var(--nec-border)",
            minWidth: "140px",
          }}
          role="listbox"
          aria-label="Select language"
        >
          {locales.map((locale) => (
            <button
              key={locale.code}
              role="option"
              aria-selected={current === locale.code}
              onClick={() => {
                setCurrent(locale.code)
                setOpen(false)
                // TODO: When locale routing is active, navigate to /{locale}/current-path
              }}
              className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-xs font-medium transition-colors text-left"
              style={{
                color: current === locale.code ? "var(--nec-purple)" : "var(--nec-muted)",
                background: current === locale.code ? "rgba(124,58,237,0.08)" : "transparent",
              }}
            >
              <span className="text-base">{locale.flag}</span>
              {locale.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
