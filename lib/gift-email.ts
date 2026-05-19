import "server-only"
import type { Payload } from "payload"
import { sendTransactionalEmail } from "./email"
import { withTimeout } from "./resilience"
import { log, summarizeError } from "./logger"
import { dlqRegistrationFailure } from "./dlq"
import { env } from "./env"
import { CONVENTION_DATES, CONVENTION_VENUE, CONTACT_EMAIL, SITE_URL } from "./constants"
import type { CorrelationId } from "./correlation"

const PAYLOAD_TIMEOUT_MS = 4_000

/**
 * Sends the claim link to whoever's best positioned to use it:
 *  - recipientEmail present → email the recipient directly
 *  - recipientEmail absent  → email the sponsor a forwardable note
 *
 * Updates the gift-code row's `emailDeliveredTo` field so admins can see at a
 * glance which gifts were auto-delivered vs. which the sponsor needs to forward
 * by hand. Failures land in the DLQ; a separate retry path can re-fire.
 */
export async function sendGiftClaimEmail(args: {
  payload: Payload
  giftId: string | number
  token: string
  recipientName: string
  recipientEmail: string | null
  sponsorName: string
  sponsorEmail: string
  correlationId: CorrelationId
}): Promise<void> {
  const { payload, giftId, token, recipientName, recipientEmail, sponsorName, sponsorEmail, correlationId } = args

  const claimUrl = `${env.NEXT_PUBLIC_BASE_URL.replace(/\/$/, "")}/claim/${encodeURIComponent(token)}`

  if (recipientEmail) {
    const { text, html } = renderRecipientEmail({ recipientName, sponsorName, claimUrl })
    const result = await sendTransactionalEmail({
      to: recipientEmail,
      subject: `${sponsorName} bought you a NECYPAA XXXVI registration`,
      text,
      html,
      correlationId,
    })
    await recordDelivery(payload, giftId, correlationId, result, "recipient", { sponsorEmail, recipientEmail })
    return
  }

  if (sponsorEmail) {
    const { text, html } = renderSponsorForwardEmail({ sponsorName, recipientName, claimUrl })
    const result = await sendTransactionalEmail({
      to: sponsorEmail,
      subject: `Forward this to ${recipientName} — their NECYPAA gift link`,
      text,
      html,
      correlationId,
    })
    await recordDelivery(payload, giftId, correlationId, result, "sponsor", { sponsorEmail })
    return
  }

  // Neither recipient nor sponsor email — shouldn't happen, but log & DLQ.
  log.warn({ event: "gift.email_no_address", correlationId, giftId })
  await dlqRegistrationFailure({
    correlationId,
    stage: "email.scholarship_recipient",
    severity: "warn",
    error: new Error("Gift has neither recipient nor sponsor email"),
    registrationId: giftId,
  })
  await updateGiftEmailStatus(payload, giftId, "failed", correlationId)
}

async function recordDelivery(
  payload: Payload,
  giftId: string | number,
  correlationId: CorrelationId,
  result: Awaited<ReturnType<typeof sendTransactionalEmail>>,
  intended: "recipient" | "sponsor",
  context: { sponsorEmail?: string; recipientEmail?: string },
): Promise<void> {
  if (result.ok) {
    await updateGiftEmailStatus(payload, giftId, intended, correlationId)
    log.info({ event: "gift.email_sent", correlationId, giftId, intended })
    return
  }
  if (result.reason === "not_configured") {
    await updateGiftEmailStatus(payload, giftId, "skipped", correlationId)
    log.info({ event: "gift.email_skipped_not_configured", correlationId, giftId, intended })
    return
  }
  log.warn({ event: "gift.email_send_failed", correlationId, giftId, intended, message: result.message })
  await updateGiftEmailStatus(payload, giftId, "failed", correlationId)
  await dlqRegistrationFailure({
    correlationId,
    stage: "email.scholarship_recipient",
    severity: "warn",
    error: new Error(result.message ?? "send_failed"),
    registrationId: giftId,
    email: context.recipientEmail ?? context.sponsorEmail,
  })
}

async function updateGiftEmailStatus(
  payload: Payload,
  giftId: string | number,
  status: "pending" | "recipient" | "sponsor" | "failed" | "skipped",
  correlationId: CorrelationId,
): Promise<void> {
  try {
    await withTimeout(
      payload.update({ collection: "gift-codes", id: giftId, data: { emailDeliveredTo: status } }),
      PAYLOAD_TIMEOUT_MS,
      "gift.update_email_status",
    )
  } catch (err) {
    log.warn({ event: "gift.update_email_status_failed", correlationId, giftId, status, ...summarizeError(err) })
  }
}

interface RecipientEmailVars {
  recipientName: string
  sponsorName: string
  claimUrl: string
}

function renderRecipientEmail(vars: RecipientEmailVars): { text: string; html: string } {
  const firstName = vars.recipientName.split(" ")[0]
  const text = [
    `Hi ${firstName},`,
    "",
    `${vars.sponsorName} bought you a registration for NECYPAA XXXVI — Escaping the Mad Realm.`,
    "",
    `It's ${CONVENTION_DATES} at the ${CONVENTION_VENUE} in Hartford, CT.`,
    "",
    "To claim your spot, click the link below and fill out the short form. You'll review the convention policy as part of that — every attendee signs it directly.",
    "",
    vars.claimUrl,
    "",
    "If you can't make it, just reply to this email and we'll redirect the scholarship to someone else.",
    "",
    `More about the weekend: ${SITE_URL}`,
    `Questions: ${CONTACT_EMAIL}`,
    "",
    "— NECYPAA XXXVI Host Committee",
  ].join("\n")
  const html = `
<p>Hi ${escape(firstName)},</p>
<p><strong>${escape(vars.sponsorName)}</strong> bought you a registration for NECYPAA XXXVI &mdash; Escaping the Mad Realm.</p>
<p>It's <strong>${CONVENTION_DATES}</strong> at the <strong>${CONVENTION_VENUE}</strong> in Hartford, CT.</p>
<p>To claim your spot, click below and fill out the short form. You'll review the convention policy as part of that &mdash; every attendee signs it directly.</p>
<p><a href="${vars.claimUrl}" style="background:#7c3aed;color:#fff;padding:14px 28px;border-radius:9999px;text-decoration:none;font-weight:600;display:inline-block">Claim your registration</a></p>
<p style="color:#888;font-size:13px">Or paste this URL into your browser:<br><span style="word-break:break-all">${vars.claimUrl}</span></p>
<p>If you can't make it, just reply to this email and we'll redirect the scholarship to someone else.</p>
<p>More about the weekend: <a href="${SITE_URL}">${SITE_URL}</a><br>Questions: <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a></p>
<p>&mdash; NECYPAA XXXVI Host Committee</p>
`.trim()
  return { text, html }
}

interface SponsorEmailVars {
  sponsorName: string
  recipientName: string
  claimUrl: string
}

function renderSponsorForwardEmail(vars: SponsorEmailVars): { text: string; html: string } {
  const firstName = vars.sponsorName.split(" ")[0]
  const text = [
    `Hi ${firstName},`,
    "",
    `Thank you for sponsoring ${vars.recipientName}. Here's the claim link to send them:`,
    "",
    vars.claimUrl,
    "",
    `Forward this whole email if it's easier — or copy/paste the link into a text. They'll fill out a short form (including the convention policy, which only attendees sign) and they're registered.`,
    "",
    `Event: NECYPAA XXXVI — ${CONVENTION_DATES} — ${CONVENTION_VENUE}, Hartford CT`,
    `Questions: ${CONTACT_EMAIL}`,
    "",
    "— NECYPAA XXXVI Host Committee",
  ].join("\n")
  const html = `
<p>Hi ${escape(firstName)},</p>
<p>Thank you for sponsoring <strong>${escape(vars.recipientName)}</strong>. Here's the claim link to send them:</p>
<p><a href="${vars.claimUrl}" style="background:#7c3aed;color:#fff;padding:14px 28px;border-radius:9999px;text-decoration:none;font-weight:600;display:inline-block">${vars.claimUrl}</a></p>
<p style="color:#888;font-size:13px">Forward this whole email if it's easier &mdash; or copy/paste the link into a text. They'll fill out a short form (including the convention policy, which only attendees sign) and they're registered.</p>
<p>Event: <strong>NECYPAA XXXVI</strong> &mdash; ${CONVENTION_DATES} &mdash; ${CONVENTION_VENUE}, Hartford CT<br>Questions: <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a></p>
<p>&mdash; NECYPAA XXXVI Host Committee</p>
`.trim()
  return { text, html }
}

function escape(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;")
}
