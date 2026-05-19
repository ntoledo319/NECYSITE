import type { CollectionConfig } from "payload"

/**
 * Unclaimed gift registrations purchased by a sponsor. Each row is one
 * redemption-pending scholarship paid for at the standard registration price.
 *
 * Lifecycle:
 *   1. Sponsor pays N × $40 for N recipients. Webhook mints N rows here.
 *   2. Email goes to recipient (if email provided) or sponsor (to forward).
 *   3. Recipient visits /claim/<token>, fills the claim form (including
 *      the policy agreement — they're the attendee), and a `comped` row is
 *      written to `registrations`. This row flips to `claimed`.
 *
 * The token is the only secret — anyone with it can claim. Treat like a
 * one-time-use coupon. Sponsors can re-request a forwarding email if a code
 * was sent to the wrong place; admins can void/re-issue from the Payload UI.
 *
 * Public writes to this collection happen via the server action and webhook
 * using the system Payload context, which bypasses these access rules. The
 * rules below govern the admin UI only.
 */
export const GiftCodes: CollectionConfig = {
  slug: "gift-codes",
  admin: {
    useAsTitle: "token",
    defaultColumns: ["recipientName", "status", "emailDeliveredTo", "paidAt", "claimedAt"],
    description: "Sponsor-purchased gift registrations awaiting redemption.",
  },
  access: {
    read: ({ req: { user } }) => Boolean(user?.role === "admin" || user?.role === "registration"),
    create: () => true,
    update: ({ req: { user } }) => Boolean(user?.role === "admin" || user?.role === "registration"),
    delete: ({ req: { user } }) => Boolean(user?.role === "admin"),
  },
  indexes: [{ fields: ["token"], unique: true }],
  fields: [
    { name: "token", type: "text", required: true, unique: true, index: true, admin: { description: "URL-safe random token used in /claim/<token>" } },
    { name: "correlationId", type: "text", index: true },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "unclaimed",
      index: true,
      options: [
        { label: "Unclaimed", value: "unclaimed" },
        { label: "Claimed", value: "claimed" },
        { label: "Void (refunded / manually canceled)", value: "void" },
      ],
    },
    { name: "recipientName", type: "text", required: true },
    { name: "recipientEmail", type: "email", admin: { description: "Optional. If present we email the recipient directly; otherwise the sponsor receives the link to forward." } },
    { name: "sponsorName", type: "text", required: true },
    { name: "sponsorEmail", type: "email", required: true, index: true },
    { name: "sponsorState", type: "text" },
    {
      name: "emailDeliveredTo",
      type: "select",
      defaultValue: "pending",
      options: [
        { label: "Pending dispatch", value: "pending" },
        { label: "Sent to recipient", value: "recipient" },
        { label: "Sent to sponsor (recipient email unknown)", value: "sponsor" },
        { label: "Send failed — manual follow-up required", value: "failed" },
        { label: "Skipped (Resend not configured)", value: "skipped" },
      ],
    },
    { name: "paidAt", type: "date" },
    { name: "stripeSessionId", type: "text", index: true },
    { name: "stripePaymentIntentId", type: "text", index: true },
    { name: "amountPaidCents", type: "number", admin: { description: "Portion of the parent Stripe session attributed to this gift (typically the registration price)." } },
    { name: "claimedAt", type: "date" },
    { name: "claimedByEmail", type: "email", admin: { description: "Email entered by the recipient at claim time; may differ from recipientEmail if a forwarded link was used." } },
    { name: "claimedRegistrationId", type: "text", admin: { description: "ID of the resulting `registrations` row." } },
    { name: "voidReason", type: "textarea" },
    {
      name: "lastEmailRetryAt",
      type: "date",
      admin: { description: "Used by the retry cron to back off failed email dispatches." },
    },
    { name: "emailRetryCount", type: "number", defaultValue: 0 },
  ],
}
