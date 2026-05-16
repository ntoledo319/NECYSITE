"use client"

import { Component, type ReactNode } from "react"
import { CONTACT_EMAIL } from "@/lib/constants"

interface Props {
  section: "form" | "policy" | "payment" | "summary" | "page"
  correlationId: string
  children: ReactNode
  /** Render a custom fallback. Receives the error and a reset callback. */
  renderFallback?: (args: { error: Error; reset: () => void; correlationId: string }) => ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  reportedAt?: number
}

/**
 * Registration-flow error boundary. Wraps each step independently so a
 * crash in one section doesn't take down the whole page. POSTs the error to
 * `/api/registration/client-error` with the correlation ID so we hear about
 * client crashes before users email us.
 */
export default class RegistrationErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    const body = JSON.stringify({
      section: this.props.section,
      correlationId: this.props.correlationId,
      message: error.message,
      stack: error.stack?.slice(0, 4000),
      componentStack: info.componentStack?.slice(0, 4000),
      url: typeof window !== "undefined" ? window.location.pathname : "",
    })
    try {
      const blob = new Blob([body], { type: "application/json" })
      const sent = typeof navigator !== "undefined" && navigator.sendBeacon
        ? navigator.sendBeacon("/api/registration/client-error", blob)
        : false
      if (!sent && typeof fetch !== "undefined") {
        void fetch("/api/registration/client-error", {
          method: "POST",
          body,
          headers: { "Content-Type": "application/json" },
          keepalive: true,
        })
      }
    } catch {
      // Reporting must never throw inside an error boundary.
    }
    this.setState({ reportedAt: Date.now() })
    if (process.env.NODE_ENV !== "production") {
      console.error(`[RegistrationErrorBoundary:${this.props.section}]`, error, info)
    }
  }

  reset = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (!this.state.hasError) return this.props.children

    const error = this.state.error ?? new Error("Unknown error")
    if (this.props.renderFallback) {
      return this.props.renderFallback({ error, reset: this.reset, correlationId: this.props.correlationId })
    }

    return (
      <div
        role="alert"
        aria-live="assertive"
        className="rounded-[1.5rem] border border-[rgba(var(--nec-pink-rgb),0.24)] bg-[rgba(var(--nec-card-rgb),0.92)] p-6"
      >
        <p className="form-section-label">This Section Hit A Snag</p>
        <h3 className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-[var(--nec-text)]">
          Your info is still saved — we just need to reload this part.
        </h3>
        <p className="mt-3 text-sm leading-7 text-[var(--nec-muted)]">
          We logged what happened. If retrying doesn't work, email{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=Registration%20error%20${encodeURIComponent(this.props.correlationId)}`}
            className="font-semibold text-[var(--nec-text)] underline underline-offset-4"
          >
            {CONTACT_EMAIL}
          </a>{" "}
          with this reference: <code className="rounded bg-black/20 px-1.5 py-0.5 text-xs">{this.props.correlationId}</code>
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button type="button" onClick={this.reset} className="btn-primary">
            Retry this step
          </button>
          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined") window.location.reload()
            }}
            className="btn-ghost"
          >
            Reload the page
          </button>
        </div>
      </div>
    )
  }
}
