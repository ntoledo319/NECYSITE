"use client"

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  type Variants,
} from "framer-motion"
import {
  useRef,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
  type MouseEvent as ReactMouseEvent,
} from "react"

/* ─────────────────────────────────────────────────────
   Spring configs — organic, handcrafted feel
   Tuned to match the swirling calligraphic energy
   of the "Escaping the Mad Realm" logo
   ───────────────────────────────────────────────────── */
export const SPRING_GENTLE = { type: "spring" as const, stiffness: 120, damping: 14, mass: 0.8 }
export const SPRING_SNAPPY = { type: "spring" as const, stiffness: 260, damping: 20, mass: 0.6 }
export const SPRING_WOBBLY = { type: "spring" as const, stiffness: 180, damping: 12, mass: 1 }
export const SPRING_SLOW   = { type: "spring" as const, stiffness: 80, damping: 18, mass: 1.2 }

/* ─────────────────────────────────────────────────────
   Stagger container + child variants
   ───────────────────────────────────────────────────── */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: SPRING_GENTLE,
  },
}

/* ─────────────────────────────────────────────────────
   MotionReveal — replaces CSS-only ScrollReveal with
   spring-physics IntersectionObserver animation.
   Respects prefers-reduced-motion via Framer's hook.
   ───────────────────────────────────────────────────── */
interface MotionRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: "up" | "down" | "left" | "right"
  once?: boolean
  as?: "div" | "section" | "article"
}

export function MotionReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  once = true,
  as = "div",
}: MotionRevealProps) {
  const shouldReduce = useReducedMotion()
  const Tag = motion[as]

  const offsets = {
    up: { y: 32, x: 0 },
    down: { y: -32, x: 0 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 },
  }

  return (
    <Tag
      className={className}
      initial={shouldReduce ? false : { opacity: 0, ...offsets[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, margin: "-60px" }}
      transition={{ ...SPRING_GENTLE, delay }}
    >
      {children}
    </Tag>
  )
}

/* ─────────────────────────────────────────────────────
   SpotlightCard — cursor-following radial glow on cards.
   Inspired by Aceternity's Spotlight effect, tuned to
   the Mad Realm's vortex/portal aesthetic.
   ───────────────────────────────────────────────────── */
interface SpotlightCardProps {
  children: ReactNode
  className?: string
  spotlightColor?: string
  spotlightSize?: number
}

export function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(124,58,237,0.12)",
  spotlightSize = 350,
}: SpotlightCardProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const shouldReduce = useReducedMotion()

  const handleMouseMove = useCallback((e: ReactMouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || shouldReduce) return
    const rect = containerRef.current.getBoundingClientRect()
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }, [shouldReduce])

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Spotlight radial gradient overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
        style={{
          opacity: isHovered && !shouldReduce ? 1 : 0,
          background: `radial-gradient(${spotlightSize}px circle at ${mousePos.x}px ${mousePos.y}px, ${spotlightColor}, transparent 65%)`,
        }}
        aria-hidden="true"
      />
      {children}
    </div>
  )
}

/* ─────────────────────────────────────────────────────
   TiltCard — 3D perspective tilt on hover with spring
   physics. Mirrors the depth of the poster's vortex.
   ───────────────────────────────────────────────────── */
interface TiltCardProps {
  children: ReactNode
  className?: string
  tiltDegree?: number
  glareOpacity?: number
}

export function TiltCard({
  children,
  className = "",
  tiltDegree = 6,
  glareOpacity = 0.08,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const shouldReduce = useReducedMotion()

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rawRotateX = useTransform(y, [-0.5, 0.5], [tiltDegree, -tiltDegree])
  const rawRotateY = useTransform(x, [-0.5, 0.5], [-tiltDegree, tiltDegree])
  const rotateX = useSpring(rawRotateX, SPRING_SNAPPY)
  const rotateY = useSpring(rawRotateY, SPRING_SNAPPY)
  const glareX = useTransform(x, [-0.5, 0.5], [0, 100])
  const glareY = useTransform(y, [-0.5, 0.5], [0, 100])
  const glareBackground = useTransform(
    [glareX, glareY],
    ([gx, gy]) =>
      `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,${glareOpacity}), transparent 60%)`
  )
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = useCallback((e: ReactMouseEvent<HTMLDivElement>) => {
    if (!ref.current || shouldReduce) return
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }, [x, y, shouldReduce])

  const handleMouseLeave = useCallback(() => {
    x.set(0)
    y.set(0)
    setIsHovered(false)
  }, [x, y])

  if (shouldReduce) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {/* Glare overlay */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-[inherit] z-20"
        style={{
          background: glareBackground,
          opacity: isHovered ? 1 : 0,
        }}
        aria-hidden="true"
      />
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────
   AuroraBackground — slow-moving ambient gradient blobs.
   Evokes the swirling purple/pink vortex from the poster.
   ───────────────────────────────────────────────────── */
interface AuroraBackgroundProps {
  className?: string
  intensity?: number
}

export function AuroraBackground({ className = "", intensity = 1 }: AuroraBackgroundProps) {
  const shouldReduce = useReducedMotion()

  if (shouldReduce) return null

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      <motion.div
        className="absolute w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full"
        style={{
          background: `radial-gradient(circle, rgba(var(--nec-purple-rgb), ${0.08 * intensity}) 0%, transparent 70%)`,
          filter: "blur(80px)",
          top: "-20%",
          left: "-10%",
        }}
        animate={{
          x: [0, 60, -30, 0],
          y: [0, -40, 20, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] rounded-full"
        style={{
          background: `radial-gradient(circle, rgba(var(--nec-pink-rgb), ${0.06 * intensity}) 0%, transparent 70%)`,
          filter: "blur(80px)",
          top: "10%",
          right: "-15%",
        }}
        animate={{
          x: [0, -50, 30, 0],
          y: [0, 30, -50, 0],
          scale: [1, 0.9, 1.08, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
      />
      <motion.div
        className="absolute w-[45vw] h-[45vw] max-w-[600px] max-h-[600px] rounded-full"
        style={{
          background: `radial-gradient(circle, rgba(var(--nec-gold-rgb), ${0.05 * intensity}) 0%, transparent 70%)`,
          filter: "blur(80px)",
          bottom: "-10%",
          left: "20%",
        }}
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -30, 40, 0],
          scale: [1, 1.05, 0.92, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 6,
        }}
      />
    </div>
  )
}

/* ─────────────────────────────────────────────────────
   FloatingElement — gentle floating animation with
   configurable axis and spring feel. Used for
   decorative elements (characters, icons, accents).
   ───────────────────────────────────────────────────── */
interface FloatingElementProps {
  children: ReactNode
  className?: string
  yOffset?: number
  xOffset?: number
  duration?: number
  delay?: number
}

export function FloatingElement({
  children,
  className = "",
  yOffset = 8,
  xOffset = 0,
  duration = 4,
  delay = 0,
}: FloatingElementProps) {
  const shouldReduce = useReducedMotion()

  if (shouldReduce) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      animate={{
        y: [-yOffset / 2, yOffset / 2, -yOffset / 2],
        x: [-xOffset / 2, xOffset / 2, -xOffset / 2],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    >
      {children}
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────
   MagneticButton — subtle magnetic pull toward cursor.
   Gives buttons the "alive" feel of the swirling logo.
   ───────────────────────────────────────────────────── */
interface MagneticButtonProps {
  children: ReactNode
  className?: string
  strength?: number
}

export function MagneticButton({
  children,
  className = "",
  strength = 0.3,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const shouldReduce = useReducedMotion()

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, SPRING_SNAPPY)
  const springY = useSpring(y, SPRING_SNAPPY)

  const handleMouseMove = useCallback((e: ReactMouseEvent<HTMLDivElement>) => {
    if (!ref.current || shouldReduce) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) * strength)
    y.set((e.clientY - centerY) * strength)
  }, [x, y, strength, shouldReduce])

  const handleMouseLeave = useCallback(() => {
    x.set(0)
    y.set(0)
  }, [x, y])

  if (shouldReduce) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────
   GrainOverlay — subtle film grain texture for that
   lived-in, hand-printed feel. Pure SVG noise filter.
   ───────────────────────────────────────────────────── */
export function GrainOverlay({ opacity = 0.03 }: { opacity?: number }) {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ opacity, mixBlendMode: "overlay" }}
      aria-hidden="true"
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <filter id="mad-realm-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#mad-realm-grain)" />
      </svg>
    </div>
  )
}

/* ─────────────────────────────────────────────────────
   useScrollProgress — hook for parallax/scroll-linked
   animations on individual sections.
   ───────────────────────────────────────────────────── */
export function useScrollProgress() {
  const ref = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const ratio = entry.intersectionRatio
            setProgress(ratio)
          }
        })
      },
      { threshold: Array.from({ length: 20 }, (_, i) => i / 19) }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return { ref, progress }
}
