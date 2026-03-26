"use client"

import { motion, useReducedMotion } from "framer-motion"
import type { ReactNode } from "react"
import { SPRING_GENTLE } from "@/components/ui/motion-primitives"

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  delay?: 0 | 1 | 2 | 3
  as?: "div" | "section"
}

const delayMap = { 0: 0, 1: 0.1, 2: 0.2, 3: 0.3 }

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  as = "div",
}: ScrollRevealProps) {
  const shouldReduce = useReducedMotion()
  const Tag = motion[as]

  return (
    <Tag
      className={className}
      initial={shouldReduce ? false : { opacity: 0, y: 28, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ ...SPRING_GENTLE, delay: delayMap[delay] }}
    >
      {children}
    </Tag>
  )
}
