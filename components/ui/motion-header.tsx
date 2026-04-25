"use client"

import { motion, useReducedMotion } from "framer-motion"
import { SPRING_GENTLE } from "@/components/ui/motion-primitives"

export default function MotionHeader({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const shouldReduce = useReducedMotion()

  return (
    <motion.header
      className={className}
      initial={shouldReduce ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={shouldReduce ? { duration: 0 } : SPRING_GENTLE}
    >
      {children}
    </motion.header>
  )
}
