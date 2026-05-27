import "server-only"
import type Stripe from "stripe"
import { sendTransactionalEmail } from "./email"
import { safeAsync } from "./resilience"
import { log } from "./logger"
import { dlqRegistrationFailure } from "./dlq"
import type { CorrelationId } from "./correlation"
import { CONVENTION_DATES, CONVENTION_VENUE, CONTACT_EMAIL, SITE_URL } from "./constants"

/**
 * Sends a "someone bought you a scholarship" email to the recipient when a
 * scholarship purchase completes payment. Best-effort — the registration is
 * valid even if this fails; the DLQ row gives admins a way to follow up
 * manually.
 */

interface NotifyInput {
  session: Stripe.Checkout.Session
  correlationId: CorrelationId
}

export async function maybeNotifyScholarshipRecipient(input: NotifyInput): Promise<void> {
  const md = (input.session.metadata ?? {}) as Record<string, unknown>
  const asString = (v: unknown): string => (typeof v === "string" ? v : "")
  const purchaseType = asString(md.purchase_type)
  if (purchaseType !== "scholarship" && purchaseType !== "self_plus_scholarship") return

  const recipientEmail = asString(md.scholarship_recipient_email).trim()
  const recipientName = asString(md.scholarship_recipient_name).trim()
  const sponsorName = asString(md.attendee_name).trim()
  const sponsorEntity = asString(md.attribution_aa_entity).trim()

  if (!recipientEmail || recipientEmail.toLowerCase() === "none" || !looksLikeEmail(recipientEmail)) {
    log.info({
      event: "scholarship_email.skipped_no_recipient",
      correlationId: input.correlationId,
      sessionId: input.session.id,
    })
    return
  }
  if (recipientName.toLowerCase() === "general fund") {
    // The "general fund" placeholder has no real recipient — skip silently.
    return
  }

  const greeting = recipientName ? `Hi ${recipientName.split(" ")[0]},` : "Hi,"
  const sponsorLine = sponsorEntity
    ? `${sponsorName || "Someone"} (${sponsorEntity}) bought you a registration for NECYPAA XXXVI.`
    : `${sponsorName || "Someone"} bought you a registration for NECYPAA XXXVI.`

  const text = [
    greeting,
    "",
    sponsorLine,
    "",
    `It's happening ${CONVENTION_DATES} at the ${CONVENTION_VENUE} in Hartford, CT.`,
    "",
    `To claim your spot, reply to this email or write to ${CONTACT_EMAIL} with your full name and homegroup. We'll add you to the attendee list and answer any questions about getting there, the schedule, or what to expect.`,
    "",
    `More about the weekend: ${SITE_URL}`,
    "",
    "If you can't make it, let us know and we'll put the scholarship toward someone else who can.",
    "",
    "— NECYPAA XXXVI Host Committee",
  ].join("\n")

  await safeAsync(
    async () => {
      const result = await sendTransactionalEmail({
        to: recipientEmail,
        subject: "Someone bought you a NECYPAA XXXVI registration",
        text,
        correlationId: input.correlationId,
      })
      if (!result.ok && result.reason !== "not_configured") {
        await dlqRegistrationFailure({
          correlationId: input.correlationId,
          stage: "email.scholarship_recipient",
          severity: "warn",
          error: new Error(result.message ?? "send failed"),
          stripeSessionId: input.session.id,
          email: recipientEmail,
        })
      }
    },
    undefined,
    {
      correlationId: input.correlationId,
      label: "scholarship_email.send",
      severity: "warn",
    },
  )
}

function looksLikeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}
