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
      className="content-warning overflow-hidden rounded-[1.25rem] border border-[rgba(var(--nec-purple-rgb),0.12)] bg-[rgba(var(--nec-card-rgb),0.88)] shadow-[0_16px_34px_rgba(44,24,16,0.06)]"
      style={{
        background: "rgba(var(--nec-card-rgb),0.88)",
      }}
    >
      <button
        type="button"
        onClick={() => setRevealed(!revealed)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[rgba(var(--nec-purple-rgb),0.04)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nec-purple)]"
        aria-expanded={revealed}
        aria-controls={panelId}
      >
        <AlertTriangle className="h-4 w-4 flex-shrink-0" style={{ color: "var(--nec-pink)" }} />
        <span className="flex-1 text-sm font-medium" style={{ color: "var(--nec-muted)" }}>
          Content warning: {warning}
        </span>
        {revealed ? (
          <ChevronUp className="h-4 w-4 flex-shrink-0" style={{ color: "var(--nec-muted)" }} />
        ) : (
          <ChevronDown className="h-4 w-4 flex-shrink-0" style={{ color: "var(--nec-muted)" }} />
        )}
      </button>
      {revealed && (
        <div id={panelId} className="border-t border-[rgba(var(--nec-purple-rgb),0.08)] px-4 pb-4 pt-3">
          {children}
        </div>
      )}
    </div>
  )
}
