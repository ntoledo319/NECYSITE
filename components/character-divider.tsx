import Image from "next/image"

interface CharacterDividerProps {
  character: "mad-hatter" | "cheshire-cat" | "caterpillar"
  flip?: boolean
  className?: string
}

const CHARACTERS = {
  "mad-hatter": {
    src: "/images/mad-hatter-character.jpg",
    alt: "The Mad Hatter character in purple coat and orange vest with top hat",
    accentRgb: "124,58,237",
  },
  "cheshire-cat": {
    src: "/images/cheshire-cat-character.jpg",
    alt: "The Cheshire Cat character in pink and purple stripes with a wide grin",
    accentRgb: "192,38,211",
  },
  caterpillar: {
    src: "/images/caterpillar-character.jpg",
    alt: "The Caterpillar character in brown coat and fedora hat",
    accentRgb: "234,179,8",
  },
}

export default function CharacterDivider({
  character,
  flip = false,
  className = "",
}: CharacterDividerProps) {
  const char = CHARACTERS[character]

  return (
    <div
      className={`relative flex items-center gap-4 ${className}`}
      aria-hidden="true"
    >
      {/* Left gradient line */}
      <div
        className="flex-1 h-[2px] rounded-full"
        style={{
          background: flip
            ? `linear-gradient(90deg, rgba(${char.accentRgb},0.5) 0%, transparent 100%)`
            : `linear-gradient(90deg, transparent 0%, rgba(${char.accentRgb},0.5) 100%)`,
          boxShadow: `0 0 12px rgba(${char.accentRgb},0.15)`,
        }}
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
        <div
          className="relative w-16 h-16 sm:w-20 sm:h-20"
          style={{ transform: flip ? "scaleX(-1)" : undefined }}
        >
          <Image
            src={char.src}
            alt=""
            width={80}
            height={120}
            className="w-full h-full object-contain drop-shadow-[0_2px_12px_rgba(0,0,0,0.4)]"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Right gradient line */}
      <div
        className="flex-1 h-[2px] rounded-full"
        style={{
          background: flip
            ? `linear-gradient(90deg, transparent 0%, rgba(${char.accentRgb},0.5) 100%)`
            : `linear-gradient(90deg, rgba(${char.accentRgb},0.5) 0%, transparent 100%)`,
          boxShadow: `0 0 12px rgba(${char.accentRgb},0.15)`,
        }}
      />
    </div>
  )
}
