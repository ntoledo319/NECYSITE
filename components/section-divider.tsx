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
      background: "linear-gradient(90deg, transparent 0%, var(--nec-pink) 20%, var(--nec-cyan) 50%, var(--nec-orange) 80%, transparent 100%)",
      boxShadow: "0 0 16px rgba(0,212,232,0.4), 0 0 32px rgba(232,0,110,0.2)",
    },
    subtle: {
      height: "1px",
      background: "linear-gradient(90deg, transparent 0%, var(--nec-border) 30%, var(--nec-border) 70%, transparent 100%)",
      boxShadow: "none",
    },
    accent: {
      height: "2px",
      background: "linear-gradient(90deg, transparent 0%, var(--nec-pink) 15%, var(--nec-cyan) 50%, var(--nec-orange) 85%, transparent 100%)",
      boxShadow: "0 0 10px rgba(0,212,232,0.25)",
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
