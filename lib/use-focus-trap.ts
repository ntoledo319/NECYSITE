"use client"

import { useEffect, useRef } from "react"

/**
 * Traps keyboard focus inside the referenced element while active.
 * Returns a ref to attach to the container element.
 *
 * - Focuses the first focusable element on mount (or the container itself).
 * - Tab / Shift+Tab cycle within the container.
 * - Restores focus to the previously-focused element on cleanup.
 */
export function useFocusTrap<T extends HTMLElement = HTMLElement>(active: boolean): React.RefObject<T> {
  const containerRef = useRef<T>(null) as React.RefObject<T>
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!active) return

    const container = containerRef.current
    if (!container) return

    // Remember where focus was before the trap activated
    previousFocusRef.current = document.activeElement as HTMLElement

    const FOCUSABLE =
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

    function getFocusableElements(): HTMLElement[] {
      if (!container) return []
      return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => !el.hasAttribute("disabled") && el.offsetParent !== null,
      )
    }

    // Focus the first focusable element (or the container)
    const focusable = getFocusableElements()
    if (focusable.length > 0) {
      focusable[0].focus()
    } else {
      container.setAttribute("tabindex", "-1")
      container.focus()
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== "Tab") return

      const elements = getFocusableElements()
      if (elements.length === 0) return

      const first = elements[0]
      const last = elements[elements.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      // Restore focus to previous element
      if (previousFocusRef.current && typeof previousFocusRef.current.focus === "function") {
        previousFocusRef.current.focus()
      }
    }
  }, [active])

  return containerRef
}
