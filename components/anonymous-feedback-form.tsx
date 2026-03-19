"use client"

import { useState } from "react"
import { Send, CheckCircle } from "lucide-react"

type FeedbackCategory = "accessibility" | "language" | "navigation" | "content" | "other"

const CATEGORIES: { value: FeedbackCategory; label: string }[] = [
  { value: "accessibility", label: "Accessibility barrier" },
  { value: "navigation", label: "Navigation issue" },
  { value: "language", label: "Language or tone concern" },
  { value: "content", label: "Content issue" },
  { value: "other", label: "Something else" },
]

export default function AnonymousFeedbackForm() {
  const [category, setCategory] = useState<FeedbackCategory>("accessibility")
  const [message, setMessage] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!message.trim()) return

    setSending(true)

    // Build a mailto link with the feedback content
    // This approach requires no backend while still delivering the feedback
    const subject = encodeURIComponent(`Anonymous Feedback: ${CATEGORIES.find((c) => c.value === category)?.label}`)
    const body = encodeURIComponent(
      `Category: ${CATEGORIES.find((c) => c.value === category)?.label}\n\n${message.trim()}\n\n---\nSubmitted anonymously via the NECYPAA XXXVI accessibility page.`
    )

    window.location.href = `mailto:info@necypaa.org?subject=${subject}&body=${body}`

    // Show success state after a brief delay (user's mail client will open)
    setTimeout(() => {
      setSending(false)
      setSubmitted(true)
    }, 500)
  }

  if (submitted) {
    return (
      <div
        className="rounded-lg p-6 text-center"
        role="status"
        aria-live="polite"
        style={{
          background: "rgba(124,58,237,0.08)",
          border: "1px solid rgba(124,58,237,0.20)",
        }}
      >
        <CheckCircle className="w-8 h-8 mx-auto mb-3" style={{ color: "var(--nec-cyan)" }} />
        <p className="text-sm font-medium text-white mb-1">Your mail client should have opened.</p>
        <p className="text-xs" style={{ color: "var(--nec-muted)" }}>
          If it didn&apos;t, you can email us directly at{" "}
          <a href="mailto:info@necypaa.org" className="underline" style={{ color: "var(--nec-cyan)" }}>
            info@necypaa.org
          </a>
          . You do not need to include your name.
        </p>
        <button
          onClick={() => {
            setSubmitted(false)
            setMessage("")
          }}
          className="mt-4 text-xs underline"
          style={{ color: "var(--nec-muted)" }}
        >
          Submit another
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="feedback-category" className="block text-xs font-medium text-white mb-1.5">
          What kind of feedback?
        </label>
        <select
          id="feedback-category"
          value={category}
          onChange={(e) => setCategory(e.target.value as FeedbackCategory)}
          className="w-full rounded-lg px-3 py-2 text-sm text-white"
          style={{
            background: "var(--nec-bg-alt, #131b2e)",
            border: "1px solid var(--nec-border)",
          }}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="feedback-message" className="block text-xs font-medium text-white mb-1.5">
          Your feedback
        </label>
        <textarea
          id="feedback-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          required
          placeholder="Describe what you experienced or what could be improved..."
          className="w-full rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 resize-y"
          style={{
            background: "var(--nec-bg-alt, #131b2e)",
            border: "1px solid var(--nec-border)",
          }}
        />
      </div>

      <p className="text-xs leading-relaxed" style={{ color: "var(--nec-muted)" }}>
        This form opens your default email client with your message pre-filled. Your email
        address will be visible to us. To stay fully anonymous, use a throwaway email address
        or send from an account that doesn&apos;t identify you.
      </p>

      <button
        type="submit"
        disabled={!message.trim() || sending}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          background: "var(--nec-cyan)",
          color: "var(--nec-navy)",
        }}
      >
        <Send className="w-4 h-4" aria-hidden="true" />
        {sending ? "Opening mail client..." : "Send Feedback"}
      </button>
    </form>
  )
}
