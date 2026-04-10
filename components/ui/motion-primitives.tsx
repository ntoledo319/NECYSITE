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
  type ReactNode,
  type MouseEvent as ReactMouseEvent,
} from "react"

export const SPRING_GENTLE = { type: "spring" as const, stiffness: 120, damping: 14, mass: 0.8 }
export const SPRING_SNAPPY = { type: "spring" as const, stiffness: 260, damping: 20, mass: 0.6 }
export const SPRING_SLOW   = { type: "spring" as const, stiffness: 80, damping: 18, mass: 1.2 }

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
