import type { CollectionConfig } from "payload"

/**
 * Dead-letter for Stripe webhook events the system could not process. Every
 * row here is a missed status update — the payment may have succeeded, failed,
 * been refunded, or been disputed, and the registration row is now out of sync.
 *
 * The webhook endpoint should write here whenever it sees a malformed event,
 * a database timeout, an unhandled event type the system later decides matters,
 * or a thrown error from a handler.
 */
export const WebhookFailures: CollectionConfig = {
  slug: "webhook-failures",
  admin: {
    useAsTitle: "eventType",
    defaultColumns: ["eventType", "severity", "recovered", "occurredAt", "eventId"],
    description: "Stripe webhook events that did not process cleanly.",
  },
  access: {
    read: ({ req: { user } }) => Boolean(user?.role === "admin" || user?.role === "registration"),
    create: () => true,
    update: ({ req: { user } }) => Boolean(user?.role === "admin" || user?.role === "registration"),
    delete: ({ req: { user } }) => Boolean(user?.role === "admin"),
  },
  fields: [
    { name: "correlationId", type: "text", required: true, index: true },
    { name: "occurredAt", type: "date", required: true, defaultValue: () => new Date().toISOString() },
    { name: "eventId", type: "text", required: true, index: true, admin: { description: "Stripe evt_..." } },
    { name: "eventType", type: "text", required: true, index: true },
    {
      name: "severity",
      type: "select",
      required: true,
      defaultValue: "error",
      index: true,
      options: [
        { label: "Info", value: "info" },
        { label: "Warn", value: "warn" },
        { label: "Error", value: "error" },
        { label: "Critical", value: "critical" },
      ],
    },
    { name: "reason", type: "text", required: true, admin: { description: "Short description of why it failed" } },
    { name: "errorMessage", type: "text" },
    { name: "errorStack", type: "textarea" },
    { name: "stripeSessionId", type: "text", index: true },
    { name: "stripePaymentIntentId", type: "text", index: true },
    { name: "stripeChargeId", type: "text", index: true },
    { name: "rawEvent", type: "json", admin: { description: "Sanitized Stripe event payload" } },
    {
      name: "recovered",
      type: "checkbox",
      defaultValue: false,
      index: true,
    },
    { name: "recoveryNote", type: "textarea" },
  ],
}
