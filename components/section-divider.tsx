interface SectionDividerProps {
  variant?: "glow" | "subtle" | "accent"
  className?: string
}

export default function SectionDivider({ 
  variant = "subtle",
  className = ""
}: SectionDividerProps) {
  const baseClasses = "w-full rounded-full"
  
  const variantStyles = {
    glow: {
      height: "3px",
      background: "linear-gradient(90deg, var(--nec-pink) 0%, var(--nec-cyan) 50%, var(--nec-orange) 100%)",
      boxShadow: "0 0 20px rgba(0,212,232,0.5), 0 0 40px rgba(232,0,110,0.3)",
    },
    subtle: {
      height: "2px",
      background: "linear-gradient(90deg, var(--nec-pink) 0%, var(--nec-cyan) 50%, var(--nec-orange) 100%)",
      boxShadow: "none",
    },
    accent: {
      height: "4px",
      background: "linear-gradient(90deg, var(--nec-pink) 0%, var(--nec-cyan) 50%, var(--nec-orange) 100%)",
      boxShadow: "0 0 12px rgba(0,212,232,0.3)",
    },
  }

  const style = variantStyles[variant]

  return (
    <div 
      className={`${baseClasses} ${className}`}
      style={{
        height: style.height,
        background: style.background,
        boxShadow: style.boxShadow,
      }}
      aria-hidden="true"
    >
      {/* CSS-only paint splatter dots for accent variant */}
      {variant === "accent" && (
        <div className="relative w-full h-full overflow-hidden">
          <div 
            className="absolute w-2 h-2 rounded-full bg-cyan-400 opacity-60"
            style={{ top: "-2px", left: "20%" }}
          />
          <div 
            className="absolute w-1.5 h-1.5 rounded-full bg-pink-500 opacity-50"
            style={{ top: "-2px", left: "50%" }}
          />
          <div 
            className="absolute w-2 h-2 rounded-full bg-orange-400 opacity-60"
            style={{ top: "-2px", left: "80%" }}
          />
          <div 
            className="absolute w-1 h-1 rounded-full bg-cyan-400 opacity-40"
            style={{ top: "1px", left: "35%" }}
          />
          <div 
            className="absolute w-1.5 h-1.5 rounded-full bg-pink-500 opacity-50"
            style={{ top: "1px", left: "65%" }}
          />
        </div>
      )}
    </div>
  )
}
