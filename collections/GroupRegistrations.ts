import type { CollectionConfig } from "payload"

/**
 * Bulk registrations purchased by a group or institution — recovery houses,
 * treatment centers, service committees, sober living, etc. — without naming
 * attendees up front. The buyer pays for N seats; the group then submits
 * attendee names by the deadline (convention start day). The host committee
 * emails each named attendee individually with the convention policy when
 * names arrive; the buyer never signs a policy because they aren't attending.
 *
 * Lifecycle:
 *   1. Buyer pays N × current registration price. A pending row lands here.
 *   2. Webhook flips status to "paid" and sends the deadline-confirmation
 *      email to `contactEmail` with submission instructions.
 *   3. Admin enters attendee names into `submittedAttendees` as they come in.
 *   4. For each submitted name, admin sends the convention policy email and
 *      creates a `registrations` row (type=comp) linked back via metadata.
 *
 * Public writes happen via the server action under the system Payload
 * context, bypassing these access rules. The rules below govern admin UI
 * access only.
 */
export const GroupRegistrations: CollectionConfig = {
  slug: "group-registrations",
  admin: {
    useAsTitle: "organizationName",
    defaultColumns: [
      "organizationName",
      "contactEmail",
      "quantity",
      "namesSubmittedCount",
      "submissionDeadline",
      "status",
    ],
    description: "Bulk registrations purchased without attendee names — names due by the convention start date.",
  },
  access: {
    read: ({ req: { user } }) => Boolean(user?.role === "admin" || user?.role === "registration"),
    create: () => true,
    update: ({ req: { user } }) => Boolean(user?.role === "admin" || user?.role === "registration"),
    delete: ({ req: { user } }) => Boolean(user?.role === "admin"),
  },
  fields: [
    { name: "organizationName", type: "text", required: true, index: true },
    { name: "contactName", type: "text", required: true },
    { name: "contactEmail", type: "email", required: true, index: true },
    { name: "contactPhone", type: "text" },
    { name: "correlationId", type: "text", index: true },
    {
      name: "quantity",
      type: "number",
      required: true,
      min: 2,
      max: 100,
      admin: { description: "Number of registrations purchased (2–100)." },
    },
    {
      name: "unitPriceCents",
      type: "number",
      required: true,
      admin: { description: "Per-seat price at purchase time. Captured so later admin actions know the original rate." },
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "pending",
      index: true,
      options: [
        { label: "Pending payment", value: "pending" },
        { label: "Paid — awaiting names", value: "paid" },
        { label: "Names complete", value: "complete" },
        { label: "Failed", value: "failed" },
        { label: "Refunded", value: "refunded" },
        { label: "Partially refunded", value: "partially_refunded" },
        { label: "Canceled", value: "canceled" },
        { label: "Disputed", value: "disputed" },
      ],
    },
    {
      name: "submissionDeadline",
      type: "date",
      required: true,
      admin: {
        description: "Last day for the group to submit attendee names. Defaults to convention start day.",
        date: { pickerAppearance: "dayOnly" },
      },
    },
    {
      name: "submittedAttendees",
      type: "array",
      admin: {
        description: "Each row is one named attendee submitted by the group. Add rows as names come in.",
      },
      fields: [
        { name: "name", type: "text", required: true },
        { name: "email", type: "email" },
        { name: "state", type: "text" },
        { name: "homegroup", type: "text" },
        { name: "policyEmailedAt", type: "date", admin: { description: "Timestamp the policy was emailed to this attendee." } },
        {
          name: "registrationId",
          type: "text",
          admin: { description: "ID of the registrations row created from this name (after policy is signed)." },
        },
        { name: "notes", type: "textarea" },
      ],
    },
    {
      name: "namesSubmittedCount",
      type: "number",
      defaultValue: 0,
      admin: { description: "Cached count of names received — kept in sync with submittedAttendees length by hooks." },
    },
    { name: "amountTotalCents", type: "number", admin: { position: "sidebar" } },
    { name: "stripeSessionId", type: "text", index: true, admin: { position: "sidebar" } },
    { name: "stripePaymentIntentId", type: "text", index: true, admin: { position: "sidebar" } },
    { name: "stripeCustomerId", type: "text", index: true, admin: { position: "sidebar" } },
    { name: "paidAt", type: "date", admin: { position: "sidebar" } },
    { name: "metadata", type: "json", admin: { description: "Raw metadata snapshot from checkout." } },
    {
      name: "deadlineEmailSentAt",
      type: "date",
      admin: { position: "sidebar", description: "When the deadline-confirmation email was sent to the contact." },
    },
    {
      name: "remindersSentCount",
      type: "number",
      defaultValue: 0,
      admin: { position: "sidebar" },
    },
    { name: "refundedAt", type: "date", admin: { position: "sidebar" } },
    { name: "refundAmountCents", type: "number", admin: { position: "sidebar" } },
    { name: "refundedFully", type: "checkbox", defaultValue: false, admin: { position: "sidebar" } },
    { name: "disputedAt", type: "date", admin: { position: "sidebar" } },
    { name: "disputeId", type: "text", index: true, admin: { position: "sidebar" } },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (Array.isArray((data as { submittedAttendees?: unknown }).submittedAttendees)) {
          ;(data as { namesSubmittedCount?: number }).namesSubmittedCount = (
            data as { submittedAttendees: unknown[] }
          ).submittedAttendees.length
        }
        return data
      },
    ],
  },
}
