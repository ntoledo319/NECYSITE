import type { CollectionConfig } from "payload"

/**
 * General Fund donations. Distinct from `registrations` because donors do
 * not attend and do not need a policy signature. A donor may also be an
 * attendee — in that case they will have a row here AND a separate row in
 * `registrations`.
 *
 * Public writes happen via the server action under the system Payload
 * context, bypassing these access rules. The rules below govern admin UI
 * access.
 */
export const Donations: CollectionConfig = {
  slug: "donations",
  admin: {
    useAsTitle: "donorEmail",
    defaultColumns: ["donorName", "donorEmail", "amountCents", "paidAt", "status"],
    description: "General Fund donations. Not part of the attendee list.",
  },
  access: {
    read: ({ req: { user } }) => Boolean(user?.role === "admin" || user?.role === "registration"),
    create: () => true,
    update: ({ req: { user } }) => Boolean(user?.role === "admin" || user?.role === "registration"),
    delete: ({ req: { user } }) => Boolean(user?.role === "admin"),
  },
  fields: [
    { name: "donorName", type: "text", required: true },
    { name: "donorEmail", type: "email", required: true, index: true },
    { name: "correlationId", type: "text", index: true },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "pending",
      index: true,
      options: [
        { label: "Pending", value: "pending" },
        { label: "Paid", value: "paid" },
        { label: "Failed", value: "failed" },
        { label: "Refunded", value: "refunded" },
        { label: "Partially refunded", value: "partially_refunded" },
        { label: "Canceled", value: "canceled" },
        { label: "Disputed", value: "disputed" },
      ],
    },
    { name: "amountCents", type: "number", required: true, admin: { description: "Donor's contribution in cents, excluding processing fee." } },
    { name: "amountTotalCents", type: "number", admin: { description: "Total charged to the donor including processing fee." } },
    { name: "stripeSessionId", type: "text", index: true, admin: { position: "sidebar" } },
    { name: "stripePaymentIntentId", type: "text", index: true, admin: { position: "sidebar" } },
    { name: "stripeCustomerId", type: "text", index: true, admin: { position: "sidebar" } },
    { name: "paidAt", type: "date" },
    { name: "metadata", type: "json", admin: { description: "Raw metadata snapshot from checkout." } },
    { name: "attributionAaEntity", type: "text", admin: { description: "Optional: which committee / district / area the donation is from." } },
    { name: "anonymous", type: "checkbox", defaultValue: false, admin: { description: "Donor requested no public attribution." } },
  ],
}
