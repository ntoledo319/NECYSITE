interface SectionDividerProps {
  variant?: "glow" | "subtle" | "accent"
  className?: string
}

export default function SectionDivider({
  variant = "subtle",
  className = "",
}: SectionDividerProps) {
  const variantStyles = {
    glow: {
      height: "2px",
      background: "linear-gradient(90deg, transparent 0%, var(--nec-purple) 20%, var(--nec-pink) 50%, var(--nec-gold) 80%, transparent 100%)",
      boxShadow: "0 0 16px rgba(124,58,237,0.4), 0 0 32px rgba(192,38,211,0.2)",
    },
    subtle: {
      height: "1px",
      background: "linear-gradient(90deg, transparent 0%, var(--nec-border) 30%, var(--nec-border) 70%, transparent 100%)",
      boxShadow: "none",
    },
    accent: {
      height: "2px",
      background: "linear-gradient(90deg, transparent 0%, var(--nec-purple) 15%, var(--nec-pink) 50%, var(--nec-gold) 85%, transparent 100%)",
      boxShadow: "0 0 10px rgba(124,58,237,0.25)",
    },
  }

  const style = variantStyles[variant]

  return (
    <div
      className={`w-full rounded-full ${className}`}
      style={style}
      aria-hidden="true"
    />
  )
}
