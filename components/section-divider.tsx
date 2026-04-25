interface SectionDividerProps {
  variant?: "glow" | "subtle" | "accent"
  className?: string
}

export default function SectionDivider({ variant = "subtle", className = "" }: SectionDividerProps) {
  const variantStyles = {
    glow: {
      height: "2px",
      background:
        "linear-gradient(90deg, transparent 0%, var(--nec-purple) 20%, var(--nec-pink) 50%, var(--nec-gold) 80%, transparent 100%)",
      boxShadow: "0 0 16px rgba(var(--nec-purple-rgb),0.20), 0 0 32px rgba(var(--nec-pink-rgb),0.10)",
    },
    subtle: {
      height: "1px",
      background:
        "linear-gradient(90deg, transparent 0%, var(--nec-border) 30%, var(--nec-border) 70%, transparent 100%)",
      boxShadow: "none",
    },
    accent: {
      height: "2px",
      background:
        "linear-gradient(90deg, transparent 0%, var(--nec-purple) 15%, var(--nec-pink) 50%, var(--nec-gold) 85%, transparent 100%)",
      boxShadow: "0 0 10px rgba(var(--nec-purple-rgb),0.12)",
    },
  }

  const style = variantStyles[variant]

  return <div className={`w-full rounded-full ${className}`} style={style} aria-hidden="true" />
}
