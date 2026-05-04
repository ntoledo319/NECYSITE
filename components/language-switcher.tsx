"use client"

import { useState, useEffect, useRef } from "react"
import { Check, ChevronDown, Globe } from "lucide-react"
import { useRouter, usePathname } from "@/i18n/navigation"
import { useLocale } from "next-intl"

const locales = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "es", label: "Español", flag: "🇪🇸" },
] as const

/**
 * Language switcher dropdown for toggling between English and Spanish.
 *
 * Uses next-intl's locale-aware router to navigate to the equivalent
 * page in the selected locale (e.g. /en/register → /es/register).
 */
export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const currentLocale = useLocale()
  const [current, setCurrent] = useState<"en" | "es">(currentLocale as "en" | "es")
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setCurrent(currentLocale as "en" | "es")
  }, [currentLocale])

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
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 rounded-full border border-[rgba(var(--nec-purple-rgb),0.14)] bg-[rgba(var(--nec-card-rgb),0.78)] px-3 py-2 text-sm font-medium text-[var(--nec-muted)] shadow-[0_12px_28px_rgba(44,24,16,0.06)] transition-[border-color,background,color,box-shadow] duration-200 hover:border-[rgba(var(--nec-purple-rgb),0.22)] hover:bg-[rgba(var(--nec-card-rgb),0.94)] hover:text-[var(--nec-text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nec-purple)]"
        aria-label="Change language"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <Globe className="h-4 w-4" />
        <span className="text-base leading-none">{locales.find((l) => l.code === current)?.flag}</span>
        <span className="hidden sm:inline">{locales.find((l) => l.code === current)?.label}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          className="absolute right-0 z-50 mt-2 min-w-[190px] rounded-2xl border border-[rgba(var(--nec-purple-rgb),0.12)] bg-[rgba(var(--nec-card-rgb),0.98)] p-1.5 shadow-[0_24px_54px_rgba(44,24,16,0.12)]"
          role="listbox"
          aria-label="Select language"
        >
          {locales.map((locale) => (
            <button
              key={locale.code}
              type="button"
              role="option"
              aria-selected={current === locale.code}
              onClick={() => {
                setCurrent(locale.code)
                setOpen(false)
                router.replace(pathname, { locale: locale.code })
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-[background-color,color,border-color] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nec-purple)] ${
                current === locale.code
                  ? "bg-[rgba(var(--nec-purple-rgb),0.06)] text-[var(--nec-text)]"
                  : "text-[var(--nec-muted)] hover:bg-[rgba(var(--nec-purple-rgb),0.03)] hover:text-[var(--nec-text)]"
              }`}
            >
              <span className="text-base leading-none">{locale.flag}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold">{locale.label}</span>
                <span className="block text-[11px] uppercase tracking-[0.18em] text-[var(--nec-muted)]">
                  {locale.code}
                </span>
              </span>
              {current === locale.code && <Check className="h-4 w-4 text-[var(--nec-purple)]" aria-hidden="true" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
