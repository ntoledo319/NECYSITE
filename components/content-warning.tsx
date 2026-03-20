"use client"

import { useState, useId } from "react"
import { AlertTriangle, ChevronDown, ChevronUp } from "lucide-react"

interface ContentWarningProps {
  warning: string
  children: React.ReactNode
}

export default function ContentWarning({ warning, children }: ContentWarningProps) {
  const [revealed, setRevealed] = useState(false)
  const panelId = useId()

  return (
    <div
      className="content-warning rounded-xl overflow-hidden"
      style={{
        border: "1px solid var(--nec-border)",
        background: "var(--nec-bg-alt, #131b2e)",
      }}
    >
      <button
        onClick={() => setRevealed(!revealed)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/5"
        aria-expanded={revealed}
        aria-controls={panelId}
      >
        <AlertTriangle className="w-4 h-4 flex-shrink-0" style={{ color: "var(--nec-pink)" }} />
        <span className="text-xs font-medium flex-1" style={{ color: "var(--nec-muted)" }}>
          Content warning: {warning}
        </span>
        {revealed ? (
          <ChevronUp className="w-4 h-4 flex-shrink-0" style={{ color: "var(--nec-muted)" }} />
        ) : (
          <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: "var(--nec-muted)" }} />
        )}
      </button>
      {revealed && (
        <div id={panelId} className="px-4 pb-4 pt-1">
          {children}
        </div>
      )}
    </div>
  )
}
