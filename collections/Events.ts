import type { CollectionConfig } from "payload"

export const Events: CollectionConfig = {
  slug: "events",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "date", "location"],
    description: "Fundraisers, pre-convention events, and activities hosted by the NECYPAA XXXVI CT Host Committee.",
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user?.role === "admin" || user?.role === "editor"),
    update: ({ req: { user } }) => Boolean(user?.role === "admin" || user?.role === "editor"),
    delete: ({ req: { user } }) => Boolean(user?.role === "admin" || user?.role === "editor"),
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      label: "Event Title",
    },
    {
      name: "startsAt",
      type: "date",
      required: true,
      label: "Starts At (ISO timestamp)",
      admin: {
        date: {
          pickerAppearance: "dayAndTime",
          timeFormat: "h:mm a",
        },
        description:
          "Canonical start datetime. Drives upcoming-vs-past partitioning, sorting, and structured-data feeds.",
      },
    },
    {
      name: "endsAt",
      type: "date",
      label: "Ends At (optional)",
      admin: {
        date: {
          pickerAppearance: "dayAndTime",
          timeFormat: "h:mm a",
        },
        description:
          "Optional end datetime. Used by calendar exports and Event JSON-LD when set; otherwise we default to a 3-hour window.",
      },
    },
    {
      name: "date",
      type: "text",
      required: true,
      label: "Display Date",
      admin: {
        description:
          'Human-readable date string shown in the UI, e.g. "Friday, February 13th, 2026". Chronology is driven by Starts At, not this field.',
      },
    },
    {
      name: "location",
      type: "text",
      required: true,
      label: "Full Location",
      admin: {
        description: "Venue name and full address",
      },
    },
    {
      name: "description",
      type: "textarea",
      required: true,
      label: "Description",
      admin: {
        description: "A brief summary of the event. Keep it informational per Tradition 11.",
      },
    },
    {
      name: "schedule",
      type: "array",
      label: "Schedule",
      admin: {
        description: "Time slots for the event",
      },
      fields: [
        {
          name: "label",
          type: "text",
          required: true,
          label: "Activity",
          admin: {
            description: 'e.g. "Meeting", "Dance", "Doors open"',
          },
        },
        {
          name: "time",
          type: "text",
          required: true,
          label: "Time",
          admin: {
            description: 'e.g. "7:00 – 8:00 PM"',
          },
        },
      ],
    },
    {
      name: "details",
      type: "array",
      label: "Details",
      admin: {
        description: "Additional key-value details about the event",
      },
      fields: [
        {
          name: "label",
          type: "text",
          required: true,
          label: "Label",
          admin: {
            description: 'e.g. "Suggested Contribution", "Hosted by"',
          },
        },
        {
          name: "value",
          type: "text",
          required: true,
          label: "Value",
        },
      ],
    },
    {
      name: "flyerImage",
      type: "upload",
      relationTo: "media",
      label: "Event Flyer",
      admin: {
        description: "Upload a flyer image for this event",
      },
    },
    {
      name: "flyerAlt",
      type: "text",
      required: true,
      label: "Flyer Alt Text",
      admin: {
        description: "Descriptive alt text for the flyer image (required for accessibility)",
      },
    },
  ],
}
