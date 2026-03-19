"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

export interface A11ySettings {
  /** "dark" = default NECYPAA theme, "light" = light background */
  colorMode: "dark" | "light"
  /** High-contrast mode — boosts contrast ratios */
  highContrast: boolean
  /** Font size multiplier: 1 = default, 1.25 = large, 1.5 = x-large, 1.75 = xx-large, 2 = maximum */
  fontSize: number
  /** Use OpenDyslexic or similar dyslexia-friendly font */
  dyslexiaFont: boolean
  /** Disable all animations and transitions */
  reduceMotion: boolean
  /** Grayscale mode — removes all color */
  grayscale: boolean
}

const DEFAULT_SETTINGS: A11ySettings = {
  colorMode: "dark",
  highContrast: false,
  fontSize: 1,
  dyslexiaFont: false,
  reduceMotion: false,
  grayscale: false,
}

const STORAGE_KEY = "necypaa-a11y-settings"

interface A11yContextValue {
  settings: A11ySettings
  updateSettings: (partial: Partial<A11ySettings>) => void
  resetSettings: () => void
}

const A11yContext = createContext<A11yContextValue | null>(null)

export function useA11y() {
  const ctx = useContext(A11yContext)
  if (!ctx) throw new Error("useA11y must be used within A11yProvider")
  return ctx
}

function detectOsColorMode(): "dark" | "light" {
  if (typeof window === "undefined") return "dark"
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"
}

function detectOsReduceMotion(): boolean {
  if (typeof window === "undefined") return false
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

function loadSettings(): A11ySettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) }
  } catch {
    // Corrupted storage — fall back to defaults
  }
  // No saved settings — respect OS preferences
  return {
    ...DEFAULT_SETTINGS,
    colorMode: detectOsColorMode(),
    reduceMotion: detectOsReduceMotion(),
  }
}

function announceChange(message: string) {
  let announcer = document.getElementById("a11y-announcer")
  if (!announcer) {
    announcer = document.createElement("div")
    announcer.id = "a11y-announcer"
    announcer.setAttribute("role", "status")
    announcer.setAttribute("aria-live", "polite")
    announcer.setAttribute("aria-atomic", "true")
    announcer.className = "sr-only"
    document.body.appendChild(announcer)
  }
  // Clear then set to trigger announcement
  announcer.textContent = ""
  requestAnimationFrame(() => {
    announcer!.textContent = message
  })
}

function applySettings(s: A11ySettings) {
  const root = document.documentElement

  // Font size
  root.style.fontSize = `${s.fontSize * 100}%`

  // Color mode
  root.setAttribute("data-color-mode", s.colorMode)

  // Sync color-scheme so browsers don't auto-darken/lighten the page
  root.style.colorScheme = s.colorMode === "light" ? "light" : "dark"
  const metaColorScheme = document.querySelector('meta[name="color-scheme"]')
  if (metaColorScheme) {
    metaColorScheme.setAttribute("content", s.colorMode === "light" ? "light dark" : "dark light")
  }

  // High contrast
  root.classList.toggle("a11y-high-contrast", s.highContrast)

  // Dyslexia font
  root.classList.toggle("a11y-dyslexia-font", s.dyslexiaFont)

  // Reduce motion
  root.classList.toggle("a11y-reduce-motion", s.reduceMotion)

  // Grayscale
  root.classList.toggle("a11y-grayscale", s.grayscale)
}

export function A11yProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<A11ySettings>(DEFAULT_SETTINGS)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const loaded = loadSettings()
    setSettings(loaded)
    applySettings(loaded)
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    applySettings(settings)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch {
      // Storage full or unavailable — silently ignore
    }
  }, [settings, mounted])

  const updateSettings = (partial: Partial<A11ySettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial }
      // Announce changes to screen readers
      const messages: string[] = []
      if (partial.colorMode !== undefined && partial.colorMode !== prev.colorMode)
        messages.push(`Color mode changed to ${partial.colorMode}`)
      if (partial.highContrast !== undefined && partial.highContrast !== prev.highContrast)
        messages.push(`High contrast ${partial.highContrast ? "enabled" : "disabled"}`)
      if (partial.fontSize !== undefined && partial.fontSize !== prev.fontSize)
        messages.push(`Text size changed to ${Math.round(partial.fontSize * 100)}%`)
      if (partial.dyslexiaFont !== undefined && partial.dyslexiaFont !== prev.dyslexiaFont)
        messages.push(`Dyslexia font ${partial.dyslexiaFont ? "enabled" : "disabled"}`)
      if (partial.reduceMotion !== undefined && partial.reduceMotion !== prev.reduceMotion)
        messages.push(`Reduce motion ${partial.reduceMotion ? "enabled" : "disabled"}`)
      if (partial.grayscale !== undefined && partial.grayscale !== prev.grayscale)
        messages.push(`Grayscale ${partial.grayscale ? "enabled" : "disabled"}`)
      if (messages.length > 0) announceChange(messages.join(". "))
      return next
    })
  }

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS)
    announceChange("All accessibility settings reset to defaults")
  }

  return (
    <A11yContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </A11yContext.Provider>
  )
}
