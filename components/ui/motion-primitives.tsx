"use client"

import { useRef, useCallback, type ReactNode, type MouseEvent as ReactMouseEvent } from "react"

// Spring constant shapes preserved for callers still referencing them
export const SPRING_GENTLE = { duration: 0.4 }
export const SPRING_SNAPPY = { duration: 0.2 }
export const SPRING_SLOW = { duration: 0.6 }

interface SpotlightCardProps {
  children: ReactNode
  className?: string
  spotlightColor?: string
  spotlightSize?: number
}

export function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(var(--nec-purple-rgb),0.08)",
  spotlightSize = 350,
}: SpotlightCardProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: ReactMouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    containerRef.current.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`)
    containerRef.current.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`)
  }, [])

  return (
    <div
      ref={containerRef}
      className={`group relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      style={
        {
          "--mouse-x": "0px",
          "--mouse-y": "0px",
          "--spotlight-color": spotlightColor,
          "--spotlight-size": `${spotlightSize}px`,
        } as React.CSSProperties
      }
    >
      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(var(--spotlight-size) circle at var(--mouse-x) var(--mouse-y), var(--spotlight-color), transparent 65%)`,
        }}
        aria-hidden="true"
      />
      {children}
    </div>
  )
}

export function TiltCard({
  children,
  className = "",
  tiltDegree: _tiltDegree,
  glareOpacity: _glareOpacity,
}: {
  children: ReactNode
  className?: string
  tiltDegree?: number
  glareOpacity?: number
}) {
  return <div className={className}>{children}</div>
}

interface FloatingElementProps {
  children: ReactNode
  className?: string
  yOffset?: number
  xOffset?: number
  duration?: number
  delay?: number
}

export function FloatingElement({ children, className = "", duration = 4, delay = 0 }: FloatingElementProps) {
  return (
    <div
      className={className}
      style={{ animation: `characterFloat ${duration}s ease-in-out ${delay}s infinite` }}
    >
      {children}
    </div>
  )
}

interface MagneticButtonProps {
  children: ReactNode
  className?: string
  strength?: number
}

export function MagneticButton({ children, className = "" }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const rafRef = useRef(0)

  const handleMouseMove = useCallback((e: ReactMouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const dx = (e.clientX - rect.left - rect.width / 2) * 0.3
    const dy = (e.clientY - rect.top - rect.height / 2) * 0.3
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(() => {
        if (ref.current) ref.current.style.transform = `translate3d(${dx}px,${dy}px,0)`
        rafRef.current = 0
      })
    }
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = 0 }
    if (ref.current) ref.current.style.transform = ""
  }, [])

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transition: "transform 0.2s ease" }}
    >
      {children}
    </div>
  )
}
