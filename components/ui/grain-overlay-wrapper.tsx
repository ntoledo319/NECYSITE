"use client"

import { GrainOverlay } from "@/components/ui/motion-primitives"
import { useReducedMotion } from "framer-motion"

export default function GrainOverlayWrapper() {
  const shouldReduce = useReducedMotion()

  if (shouldReduce) return null

  return <GrainOverlay opacity={0.025} />
}
