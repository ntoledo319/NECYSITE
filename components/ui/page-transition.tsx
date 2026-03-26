"use client"

import { motion, useReducedMotion } from "framer-motion"
import { usePathname } from "next/navigation"
import { SPRING_GENTLE } from "@/components/ui/motion-primitives"

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const shouldReduce = useReducedMotion()

  return (
    <motion.div
      key={pathname}
      initial={shouldReduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={shouldReduce ? { duration: 0 } : { ...SPRING_GENTLE, duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}
