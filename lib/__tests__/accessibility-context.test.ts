// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { createElement, type ReactNode } from "react"

// Must set up DOM environment mocks before importing the module
const mockMatchMedia = vi.fn((query: string) => ({
  matches: query === "(prefers-color-scheme: light)",
}))
Object.defineProperty(globalThis, "matchMedia", { value: mockMatchMedia, writable: true })

const mockLocalStorage = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, val: string) => { store[key] = val }),
    removeItem: vi.fn((key: string) => { delete store[key] }),
    clear: vi.fn(() => { store = {} }),
  }
})()
Object.defineProperty(globalThis, "localStorage", { value: mockLocalStorage, writable: true })

// Mock requestAnimationFrame
globalThis.requestAnimationFrame = vi.fn((cb) => { cb(0); return 0 })

const mod = await import("../accessibility-context")
const { A11yProvider, useA11y } = mod

function wrapper({ children }: { children: ReactNode }) {
  return createElement(A11yProvider, null, children)
}

describe("A11yProvider", () => {
  beforeEach(() => {
    mockLocalStorage.clear()
    vi.clearAllMocks()
    document.documentElement.removeAttribute("data-color-mode")
    document.documentElement.style.cssText = ""
    document.documentElement.className = ""
  })

  it("provides default settings", () => {
    const { result } = renderHook(() => useA11y(), { wrapper })

    expect(result.current.settings).toEqual({
      colorMode: "light",
      highContrast: false,
      fontSize: 1,
      dyslexiaFont: false,
      reduceMotion: false,
      grayscale: false,
    })
  })

  it("updates individual settings", () => {
    const { result } = renderHook(() => useA11y(), { wrapper })

    act(() => {
      result.current.updateSettings({ highContrast: true })
    })

    expect(result.current.settings.highContrast).toBe(true)
    // Other settings unchanged
    expect(result.current.settings.colorMode).toBe("light")
    expect(result.current.settings.fontSize).toBe(1)
  })

  it("resets settings to defaults", () => {
    const { result } = renderHook(() => useA11y(), { wrapper })

    act(() => {
      result.current.updateSettings({ fontSize: 1.5, highContrast: true })
    })

    expect(result.current.settings.fontSize).toBe(1.5)

    act(() => {
      result.current.resetSettings()
    })

    expect(result.current.settings).toEqual({
      colorMode: "light",
      highContrast: false,
      fontSize: 1,
      dyslexiaFont: false,
      reduceMotion: false,
      grayscale: false,
    })
  })

  it("throws when useA11y is used outside provider", () => {
    expect(() => {
      renderHook(() => useA11y())
    }).toThrow("useA11y must be used within A11yProvider")
  })
})
