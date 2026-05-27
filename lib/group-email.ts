import "server-only"
import type { Payload } from "payload"
import type Stripe from "stripe"
import { sendTransactionalEmail } from "./email"
import { withTimeout, safeAsync } from "./resilience"
import { log } from "./logger"
import { dlqRegistrationFailure } from "./dlq"
import { CONVENTION_DATES, CONVENTION_VENUE, CONTACT_EMAIL, SITE_URL } from "./constants"
import type { CorrelationId } from "./correlation"

const PAYLOAD_TIMEOUT_MS = 4_000

/**
 * Sends the "your seats are booked — send us names by X" email to the group
 * contact when a group purchase is confirmed paid. Updates the
 * group-registrations row's deadlineEmailSentAt so admins can see at a
 * glance who's been notified. Failures land in the DLQ; the registration
 * itself remains valid.
 */
export async function sendGroupConfirmationEmail(args: {
  payload: Payload
  session: Stripe.Checkout.Session
  groupRegistrationId: string | number
  organizationName: string
  contactName: string
  contactEmail: string
  quantity: number
  submissionDeadline: string
  correlationId: CorrelationId
}): Promise<void> {
  const {
    payload,
    session,
    groupRegistrationId,
    organizationName,
    contactName,
    contactEmail,
    quantity,
    submissionDeadline,
    correlationId,
  } = args

  if (!contactEmail) {
    log.warn({ event: "group_email.no_contact_email", correlationId, groupRegistrationId })
    return
  }

  const deadlineDate = new Date(submissionDeadline)
  const deadlineDisplay = Number.isFinite(deadlineDate.getTime())
    ? deadlineDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
    : submissionDeadline

  const { text, html } = renderGroupEmail({
    contactName,
    organizationName,
    quantity,
    deadlineDisplay,
  })

  const result = await sendTransactionalEmail({
    to: contactEmail,
    subject: `NECYPAA XXXVI — ${quantity} seats reserved for ${organizationName}`,
    text,
    html,
    correlationId,
  })

  if (!result.ok && result.reason !== "not_configured") {
    log.warn({ event: "group_email.send_failed", correlationId, groupRegistrationId, message: result.message })
    await dlqRegistrationFailure({
      correlationId,
      stage: "email.scholarship_recipient",
      severity: "warn",
      error: new Error(result.message ?? "group email send failed"),
      email: contactEmail,
      stripeSessionId: session.id,
      registrationId: groupRegistrationId,
    })
    return
  }

  if (result.ok) {
    await safeAsync(
      async () => {
        await withTimeout(
          payload.update({
            collection: "group-registrations",
            id: groupRegistrationId,
            data: { deadlineEmailSentAt: new Date().toISOString() },
          }),
          PAYLOAD_TIMEOUT_MS,
          "group_email.mark_sent",
        )
      },
      undefined,
      { correlationId, label: "group_email.mark_sent", severity: "warn" },
    )
    log.info({ event: "group_email.sent", correlationId, groupRegistrationId })
  } else {
    log.info({ event: "group_email.skipped_not_configured", correlationId, groupRegistrationId })
  }
}

interface GroupEmailVars {
  contactName: string
  organizationName: string
  quantity: number
  deadlineDisplay: string
}

function renderGroupEmail(vars: GroupEmailVars): { text: string; html: string } {
  const firstName = vars.contactName.split(" ")[0] || vars.contactName
  const text = [
    `Hi ${firstName},`,
    "",
    `Your group purchase for ${vars.organizationName} is confirmed: ${vars.quantity} seats at NECYPAA XXXVI — Escaping the Mad Realm.`,
    "",
    `Event: ${CONVENTION_DATES} — ${CONVENTION_VENUE}, Hartford, CT.`,
    "",
    "WHAT WE NEED FROM YOU",
    "",
    `Reply to this email with the names of the ${vars.quantity} attendees by ${vars.deadlineDisplay} (the day the convention starts).`,
    "",
    "For each person, send:",
    "  • Full name",
    "  • Email address (if you have it)",
    "",
    "WHAT HAPPENS NEXT",
    "",
    "As each name reaches us, we'll email that attendee directly with the convention policy to review and sign. Every attendee signs the policy in their own name — you don't sign on their behalf.",
    "",
    "Names that don't arrive by the deadline aren't lost — you can still use those seats for walk-in attendees onsite, or reach out and we'll release them to the scholarship pool for the broader community.",
    "",
    "ANY QUESTIONS",
    "",
    `Hit reply, or write us at ${CONTACT_EMAIL}.`,
    "",
    `More about the weekend: ${SITE_URL}`,
    "",
    "Thank you for bringing your folks to NECYPAA XXXVI.",
    "",
    "— NECYPAA XXXVI Host Committee",
  ].join("\n")

  const html = `
<p>Hi ${escape(firstName)},</p>
<p>Your group purchase for <strong>${escape(vars.organizationName)}</strong> is confirmed: <strong>${vars.quantity} seats</strong> at NECYPAA XXXVI &mdash; Escaping the Mad Realm.</p>
<p>Event: <strong>${CONVENTION_DATES}</strong> &mdash; ${CONVENTION_VENUE}, Hartford, CT.</p>

<h3 style="margin-top:24px;margin-bottom:8px;font-size:14px;letter-spacing:0.08em;text-transform:uppercase;color:#7c3aed">What we need from you</h3>
<p>Reply to this email with the names of the ${vars.quantity} attendees by <strong style="color:#b45309">${escape(vars.deadlineDisplay)}</strong> (the day the convention starts).</p>
<p>For each person, send:</p>
<ul>
  <li>Full name</li>
  <li>Email address (if you have it)</li>
</ul>

<h3 style="margin-top:24px;margin-bottom:8px;font-size:14px;letter-spacing:0.08em;text-transform:uppercase;color:#7c3aed">What happens next</h3>
<p>As each name reaches us, we'll email that attendee directly with the convention policy to review and sign. <strong>Every attendee signs the policy in their own name</strong> &mdash; you don't sign on their behalf.</p>
<p style="color:#666;font-size:14px">Names that don't arrive by the deadline aren't lost &mdash; you can still use those seats for walk-in attendees onsite, or reach out and we'll release them to the scholarship pool for the broader community.</p>

<h3 style="margin-top:24px;margin-bottom:8px;font-size:14px;letter-spacing:0.08em;text-transform:uppercase;color:#7c3aed">Questions</h3>
<p>Hit reply, or write us at <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>.</p>
<p>More about the weekend: <a href="${SITE_URL}">${SITE_URL}</a></p>

<p>Thank you for bringing your folks to NECYPAA XXXVI.</p>
<p>&mdash; NECYPAA XXXVI Host Committee</p>
`.trim()

  return { text, html }
}

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}
