"use client"

import { useState, useEffect } from "react"
import { Settings, X, RotateCcw, Sun, Moon, Eye, Type, Minus, Plus } from "lucide-react"
import { useA11y } from "@/lib/accessibility-context"
import { useFocusTrap } from "@/lib/use-focus-trap"
import { Switch } from "@/components/ui/switch"

export default function AccessibilityPanel() {
  const [open, setOpen] = useState(false)
  const { settings, updateSettings, resetSettings } = useA11y()
  const panelRef = useFocusTrap<HTMLDivElement>(open)

  const fontSizeLabel =
    settings.fontSize <= 1
      ? "Default"
      : settings.fontSize <= 1.25
        ? "Large"
        : settings.fontSize <= 1.5
          ? "Extra Large"
          : settings.fontSize <= 1.75
            ? "XX-Large"
            : "Maximum"

  useEffect(() => {
    if (open) {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") setOpen(false)
      }
      window.addEventListener("keydown", handleEscape)
      return () => window.removeEventListener("keydown", handleEscape)
    }
  }, [open])

  return (
    <>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-20 left-4 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(var(--nec-purple-rgb),0.14)] bg-[rgba(var(--nec-card-rgb),0.94)] text-[var(--nec-purple)] shadow-[0_18px_40px_rgba(44,24,16,0.12)] transition-[transform,border-color,background] duration-200 hover:-translate-y-0.5 hover:border-[rgba(var(--nec-purple-rgb),0.22)] hover:bg-[rgba(var(--nec-purple-rgb),0.05)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nec-purple)] focus-visible:ring-offset-2 md:bottom-6 md:left-6"
        style={{
          background: "rgba(var(--nec-card-rgb),0.94)",
        }}
        aria-label="Open accessibility settings"
      >
        <Settings className="h-5 w-5" aria-hidden="true" />
      </button>

      {/* Panel overlay */}
      {open && (
        <div className="fixed inset-0 z-[200]" role="dialog" aria-modal="true" aria-label="Accessibility settings">
          {/* Backdrop */}
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- backdrop dismiss is supplementary to Escape key and close button */}
          <div className="absolute inset-0 bg-[rgba(28,21,17,0.48)] backdrop-blur-sm" onClick={() => setOpen(false)} />

          {/* Panel */}
          <div
            ref={panelRef}
            className="absolute bottom-0 right-0 top-0 w-full max-w-sm overflow-y-auto"
            style={{
              background: "rgba(var(--nec-card-rgb),0.98)",
              borderLeft: "1px solid rgba(var(--nec-purple-rgb),0.12)",
              boxShadow: "-24px 0 60px rgba(20,14,10,0.14)",
            }}
          >
            {/* Header */}
            <div
              className="sticky top-0 z-10 flex items-center justify-between border-b p-4"
              style={{ borderColor: "rgba(var(--nec-purple-rgb),0.10)", background: "rgba(var(--nec-card-rgb),0.98)" }}
            >
              <h2 className="text-base font-bold text-[var(--nec-text)]">Accessibility Settings</h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={resetSettings}
                  className="rounded-full p-2 transition-colors hover:bg-[rgba(var(--nec-purple-rgb),0.05)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nec-purple)]"
                  style={{ color: "var(--nec-muted)" }}
                  aria-label="Reset all settings to defaults"
                  title="Reset to defaults"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-full p-2 transition-colors hover:bg-[rgba(var(--nec-purple-rgb),0.05)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nec-purple)]"
                  style={{ color: "var(--nec-muted)" }}
                  aria-label="Close accessibility settings"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Settings */}
            <div className="space-y-5 p-4">
              {/* Color Mode */}
              <SettingRow
                icon={settings.colorMode === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                label="Color Mode"
                description={settings.colorMode === "dark" ? "Dark (default)" : "Light"}
              >
                <div
                  className="flex overflow-hidden rounded-lg"
                  role="radiogroup"
                  aria-label="Color mode"
                  style={{ border: "1px solid var(--nec-border)" }}
                >
                  <button
                    type="button"
                    onClick={() => updateSettings({ colorMode: "dark" })}
                    className="px-3 py-1.5 text-xs font-medium transition-colors"
                    style={{
                      background: settings.colorMode === "dark" ? "var(--nec-cyan)" : "transparent",
                      color: settings.colorMode === "dark" ? "var(--nec-navy)" : "var(--nec-muted)",
                    }}
                    role="radio"
                    aria-checked={settings.colorMode === "dark"}
                  >
                    Dark
                  </button>
                  <button
                    type="button"
                    onClick={() => updateSettings({ colorMode: "light" })}
                    className="px-3 py-1.5 text-xs font-medium transition-colors"
                    style={{
                      background: settings.colorMode === "light" ? "var(--nec-cyan)" : "transparent",
                      color: settings.colorMode === "light" ? "var(--nec-navy)" : "var(--nec-muted)",
                    }}
                    role="radio"
                    aria-checked={settings.colorMode === "light"}
                  >
                    Light
                  </button>
                </div>
              </SettingRow>

              {/* High Contrast */}
              <SettingRow
                icon={<Eye className="h-4 w-4" />}
                label="High Contrast"
                description="Increases contrast ratios for better readability"
              >
                <Switch
                  checked={settings.highContrast}
                  onCheckedChange={(v) => updateSettings({ highContrast: v })}
                  aria-label="High contrast mode"
                />
              </SettingRow>

              {/* Font Size */}
              <SettingRow icon={<Type className="h-4 w-4" />} label="Text Size" description={fontSizeLabel}>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateSettings({ fontSize: Math.max(1, settings.fontSize - 0.25) })}
                    disabled={settings.fontSize <= 1}
                    className="rounded-full p-2 transition-colors hover:bg-[rgba(var(--nec-purple-rgb),0.05)] disabled:opacity-30"
                    style={{ color: "var(--nec-muted)" }}
                    aria-label="Decrease font size"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-10 text-center font-mono text-xs" style={{ color: "var(--nec-text)" }}>
                    {Math.round(settings.fontSize * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={() => updateSettings({ fontSize: Math.min(2, settings.fontSize + 0.25) })}
                    disabled={settings.fontSize >= 2}
                    className="rounded-full p-2 transition-colors hover:bg-[rgba(var(--nec-purple-rgb),0.05)] disabled:opacity-30"
                    style={{ color: "var(--nec-muted)" }}
                    aria-label="Increase font size"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </SettingRow>

              {/* Dyslexia Font */}
              <SettingRow
                icon={
                  <span className="text-sm font-bold" style={{ color: "var(--nec-cyan)" }}>
                    Aa
                  </span>
                }
                label="Dyslexia-Friendly Font"
                description="Uses a font designed for easier reading with dyslexia"
              >
                <Switch
                  checked={settings.dyslexiaFont}
                  onCheckedChange={(v) => updateSettings({ dyslexiaFont: v })}
                  aria-label="Dyslexia-friendly font"
                />
              </SettingRow>

              {/* Reduce Motion */}
              <SettingRow
                icon={
                  <span className="text-sm" style={{ color: "var(--nec-cyan)" }}>
                    ⏸
                  </span>
                }
                label="Reduce Motion"
                description="Turns off all animations and transitions"
              >
                <Switch
                  checked={settings.reduceMotion}
                  onCheckedChange={(v) => updateSettings({ reduceMotion: v })}
                  aria-label="Reduce motion"
                />
              </SettingRow>

              {/* Grayscale */}
              <SettingRow
                icon={
                  <span className="text-sm" style={{ color: "var(--nec-cyan)" }}>
                    ◐
                  </span>
                }
                label="Grayscale"
                description="Removes all color from the page"
              >
                <Switch
                  checked={settings.grayscale}
                  onCheckedChange={(v) => updateSettings({ grayscale: v })}
                  aria-label="Grayscale mode"
                />
              </SettingRow>
            </div>

            {/* Footer */}
            <div
              className="mt-4 border-t p-4 text-xs"
              style={{ borderColor: "rgba(var(--nec-purple-rgb),0.10)", color: "var(--nec-muted)" }}
            >
              <p>
                Your settings are saved locally on this device. If you need additional accommodations, please email{" "}
                <a href="mailto:info@necypaa.org" className="underline" style={{ color: "var(--nec-cyan)" }}>
                  info@necypaa.org
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/* ── Sub-components ─────────────────────────── */

function SettingRow({
  icon,
  label,
  description,
  children,
}: {
  icon: React.ReactNode
  label: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div
      className="flex items-center justify-between gap-4 rounded-[1.1rem] border p-3.5"
      style={{ background: "rgba(var(--nec-card-rgb),0.78)", border: "1px solid rgba(var(--nec-purple-rgb),0.10)" }}
    >
      <div className="flex min-w-0 items-start gap-3">
        <span className="mt-0.5 flex-shrink-0" style={{ color: "var(--nec-cyan)" }}>
          {icon}
        </span>
        <div className="min-w-0">
          <span className="block text-sm font-semibold text-[var(--nec-text)]">{label}</span>
          <span className="mt-0.5 block text-xs" style={{ color: "var(--nec-muted)" }}>
            {description}
          </span>
        </div>
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  )
}
