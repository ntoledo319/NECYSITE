import type { CollectionConfig } from "payload"

export const Registrations: CollectionConfig = {
  slug: "registrations",
  admin: {
    useAsTitle: "email",
    defaultColumns: ["name", "email", "status", "type", "createdAt"],
    description: "Attendee registrations and scholarship purchases.",
  },
  access: {
    read: ({ req: { user } }) => Boolean(user?.role === "admin" || user?.role === "registration"),
    create: () => true, // Allows server actions to create using local API if needed, though local API bypasses access control anyway
    update: ({ req: { user } }) => Boolean(user?.role === "admin" || user?.role === "registration"),
    delete: ({ req: { user } }) => Boolean(user?.role === "admin"),
  },
  fields: [
    {
      name: "email",
      type: "email",
      required: true,
      index: true,
      label: "Email Address",
    },
    {
      name: "name",
      type: "text",
      required: true,
      label: "Full Name",
    },
    {
      name: "state",
      type: "text",
      label: "State/Province",
    },
    {
      name: "status",
      type: "select",
      options: [
        { label: "Pending", value: "pending" },
        { label: "Paid", value: "paid" },
        { label: "Failed", value: "failed" },
        { label: "Refunded", value: "refunded" },
        { label: "Comped", value: "comped" },
        { label: "Cash", value: "cash" },
        { label: "Canceled", value: "canceled" },
      ],
      defaultValue: "pending",
      required: true,
      index: true,
    },
    {
      name: "type",
      type: "select",
      options: [
        { label: "Self", value: "self" },
        { label: "Scholarship", value: "scholarship" },
        { label: "Self + Scholarship", value: "self_plus_scholarship" },
        { label: "Free/Comp", value: "comp" },
        { label: "Breakfast Only", value: "breakfast_only" },
      ],
      required: true,
    },
    {
      name: "stripeSessionId",
      type: "text",
      index: true,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "stripePaymentIntentId",
      type: "text",
      index: true,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "stripeCustomerId",
      type: "text",
      index: true,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "amountTotalCents",
      type: "number",
      label: "Total Amount (Cents)",
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "metadata",
      type: "json",
      label: "Full Metadata",
      admin: {
        description: "Raw metadata from checkout",
      },
    },
    {
      name: "accommodations",
      type: "textarea",
      label: "Accessibility/Dietary Needs",
    },
    {
      name: "interpretationNeeded",
      type: "checkbox",
      label: "Interpretation Needed",
      defaultValue: false,
    },
    {
      name: "mobilityAccessibility",
      type: "checkbox",
      label: "Mobility Accessibility Needed",
      defaultValue: false,
    },
    {
      name: "willingToServe",
      type: "checkbox",
      label: "Willing to Serve",
      defaultValue: false,
    },
    {
      name: "homegroup",
      type: "text",
      label: "Homegroup/Committee",
    },
  ],
}
