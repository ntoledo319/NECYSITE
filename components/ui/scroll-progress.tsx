"use client"

import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion"

export default function ScrollProgress() {
  const shouldReduce = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })

  if (shouldReduce) return null

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-[60] origin-left"
      style={{
        scaleX,
        background:
          "linear-gradient(90deg, var(--nec-purple) 0%, var(--nec-pink) 50%, var(--nec-gold) 100%)",
        boxShadow: "0 0 8px rgba(124,58,237,0.4), 0 0 16px rgba(192,38,211,0.2)",
      }}
      aria-hidden="true"
    />
  )
}
