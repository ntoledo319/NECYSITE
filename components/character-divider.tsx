"use client"

import Image from "next/image"
import { motion, useReducedMotion } from "framer-motion"
import { FloatingElement, SPRING_GENTLE } from "@/components/ui/motion-primitives"

interface CharacterDividerProps {
  character: "mad-hatter" | "cheshire-cat" | "caterpillar"
  flip?: boolean
  className?: string
}

const CHARACTERS = {
  "mad-hatter": {
    src: "/images/mad-hatter-character.webp",
    alt: "The Mad Hatter character in purple coat and orange vest with top hat",
    accentRgb: "124,58,237",
  },
  "cheshire-cat": {
    src: "/images/cheshire-cat-character.webp",
    alt: "The Cheshire Cat character in pink and purple stripes with a wide grin",
    accentRgb: "192,38,211",
  },
  caterpillar: {
    src: "/images/caterpillar-character.webp",
    alt: "The Caterpillar character in brown coat and fedora hat",
    accentRgb: "234,179,8",
  },
}

export default function CharacterDivider({ character, flip = false, className = "" }: CharacterDividerProps) {
  const char = CHARACTERS[character]

  const shouldReduce = useReducedMotion()

  return (
    <div className={`relative flex items-center gap-4 ${className}`} aria-hidden="true">
      {/* Left gradient line */}
      <motion.div
        className="h-[2px] flex-1 rounded-full"
        style={{
          background: flip
            ? `linear-gradient(90deg, rgba(${char.accentRgb},0.5) 0%, transparent 100%)`
            : `linear-gradient(90deg, transparent 0%, rgba(${char.accentRgb},0.5) 100%)`,
          boxShadow: `0 0 12px rgba(${char.accentRgb},0.15)`,
          transformOrigin: flip ? "right center" : "left center",
        }}
        initial={shouldReduce ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={shouldReduce ? { duration: 0 } : SPRING_GENTLE}
      />

      {/* Character */}
      <div className="relative flex-shrink-0">
        <div
          className="absolute inset-0 scale-[2] rounded-full"
          style={{
            background: `radial-gradient(circle, rgba(${char.accentRgb},0.15) 0%, transparent 60%)`,
            filter: "blur(16px)",
          }}
        />
        <FloatingElement yOffset={6} duration={4}>
          <div className="relative h-20 w-20 sm:h-24 sm:w-24" style={{ transform: flip ? "scaleX(-1)" : undefined }}>
            <Image
              src={char.src}
              alt=""
              width={96}
              height={96}
              sizes="(min-width: 640px) 96px, 80px"
              className="h-full w-full object-contain"
              style={{
                filter: `drop-shadow(0 2px 12px rgba(${char.accentRgb},0.35)) drop-shadow(0 1px 4px rgba(0,0,0,0.4))`,
              }}
              aria-hidden="true"
            />
          </div>
        </FloatingElement>
      </div>

      {/* Right gradient line */}
      <motion.div
        className="h-[2px] flex-1 rounded-full"
        style={{
          background: flip
            ? `linear-gradient(90deg, transparent 0%, rgba(${char.accentRgb},0.5) 100%)`
            : `linear-gradient(90deg, rgba(${char.accentRgb},0.5) 0%, transparent 100%)`,
          boxShadow: `0 0 12px rgba(${char.accentRgb},0.15)`,
          transformOrigin: flip ? "left center" : "right center",
        }}
        initial={shouldReduce ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={shouldReduce ? { duration: 0 } : SPRING_GENTLE}
      />
    </div>
  )
}
