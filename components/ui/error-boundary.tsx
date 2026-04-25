"use client"

import { Component, type ReactNode } from "react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="rounded-[1.5rem] border border-[rgba(var(--nec-pink-rgb),0.20)] bg-[rgba(var(--nec-card-rgb),0.90)] p-6 text-center">
            <p className="text-[var(--nec-text)] font-semibold mb-2">
              Something went wrong loading this section.
            </p>
            <p className="text-sm text-[var(--nec-muted)]">
              Please refresh the page or try again in a moment.
            </p>
          </div>
        )
      )
    }

    return this.props.children
  }
}
