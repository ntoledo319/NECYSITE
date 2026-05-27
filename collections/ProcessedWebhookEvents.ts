import type { CollectionConfig } from "payload"

/**
 * Event-level idempotency table. Stripe can (and does) deliver the same event
 * multiple times; this collection lets the webhook short-circuit duplicates
 * instead of replaying side effects. A scheduled cleanup can drop rows older
 * than 30 days — Stripe's retry window is much shorter.
 */
export const ProcessedWebhookEvents: CollectionConfig = {
  slug: "processed-webhook-events",
  admin: {
    useAsTitle: "eventId",
    defaultColumns: ["eventId", "eventType", "processedAt"],
    description: "Stripe events already handled — used to dedupe deliveries.",
  },
  access: {
    read: ({ req: { user } }) => Boolean(user?.role === "admin"),
    create: () => true,
    update: ({ req: { user } }) => Boolean(user?.role === "admin"),
    delete: ({ req: { user } }) => Boolean(user?.role === "admin"),
  },
  indexes: [{ fields: ["eventId"], unique: true }],
  fields: [
    { name: "eventId", type: "text", required: true, unique: true, index: true },
    { name: "eventType", type: "text", required: true, index: true },
    { name: "processedAt", type: "date", required: true, defaultValue: () => new Date().toISOString() },
    { name: "correlationId", type: "text" },
  ],
}
