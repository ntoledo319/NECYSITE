import type { CollectionConfig } from "payload"

/**
 * Dead-letter for any registration write that fails irrecoverably. Anything
 * that lands here means a human needs to act — a sponsor's payment succeeded
 * but the row didn't persist, an access code burned without a local record,
 * a confirmation email failed five times, etc.
 *
 * Public registration writes use `payload.create` under a system context, so
 * these access rules only govern who can read the dead-letter in the admin UI.
 */
export const RegistrationFailures: CollectionConfig = {
  slug: "registration-failures",
  admin: {
    useAsTitle: "stage",
    defaultColumns: ["stage", "severity", "recovered", "occurredAt", "correlationId"],
    description: "Failed registration writes that need manual recovery.",
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
    {
      name: "stage",
      type: "select",
      required: true,
      index: true,
      options: [
        { label: "Stripe — session.create", value: "stripe.session.create" },
        { label: "Stripe — session.retrieve", value: "stripe.session.retrieve" },
        { label: "Stripe — customer.upsert", value: "stripe.customer.upsert" },
        { label: "Stripe — paymentIntent.update", value: "stripe.payment_intent.update" },
        { label: "Payload — registration.create", value: "payload.create" },
        { label: "Payload — registration.update", value: "payload.update" },
        { label: "Payload — registration.delete", value: "payload.delete" },
        { label: "Issuer — redeem", value: "issuer.redeem" },
        { label: "Email — scholarship recipient", value: "email.scholarship_recipient" },
        { label: "Reconciliation — pending sweep", value: "reconciliation.sweep" },
        { label: "Unknown", value: "unknown" },
      ],
    },
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
    { name: "errorMessage", type: "text", required: true },
    { name: "errorName", type: "text" },
    { name: "errorCode", type: "text", index: true },
    { name: "errorStack", type: "textarea" },
    { name: "stripeSessionId", type: "text", index: true },
    { name: "stripePaymentIntentId", type: "text", index: true },
    { name: "registrationId", type: "text", index: true },
    { name: "hashedEmail", type: "text", index: true, admin: { description: "SHA-256 of lowercased email; 12 chars" } },
    { name: "requestPayload", type: "json", admin: { description: "Sanitized snapshot of the input that failed" } },
    { name: "attempts", type: "number", defaultValue: 1 },
    {
      name: "recovered",
      type: "checkbox",
      defaultValue: false,
      index: true,
      admin: { description: "Tick when a human (or recovery job) has resolved this failure" },
    },
    { name: "recoveryNote", type: "textarea" },
  ],
}
