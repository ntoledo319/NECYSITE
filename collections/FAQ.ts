import type { CollectionConfig } from "payload"

export const FAQ: CollectionConfig = {
  slug: "faq",
  admin: {
    useAsTitle: "question",
    defaultColumns: ["question", "category", "sortOrder"],
    description:
      "Frequently Asked Questions for NECYPAA XXXVI. Grouped by category. Keep language warm and welcoming per accessibility guidelines.",
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user?.role === "admin" || user?.role === "editor"),
    update: ({ req: { user } }) => Boolean(user?.role === "admin" || user?.role === "editor"),
    delete: ({ req: { user } }) => Boolean(user?.role === "admin" || user?.role === "editor"),
  },
  fields: [
    {
      name: "question",
      type: "text",
      required: true,
      label: "Question",
    },
    {
      name: "answer",
      type: "richText",
      required: true,
      label: "Answer",
      admin: {
        description:
          "Use plain, clear language. No jargon without explanation. Person-first language only.",
      },
    },
    {
      name: "category",
      type: "select",
      required: true,
      label: "Category",
      options: [
        { label: "General", value: "general" },
        { label: "Registration", value: "registration" },
        { label: "Hotel & Travel", value: "hotel-travel" },
        { label: "Accessibility", value: "accessibility" },
        { label: "Convention", value: "convention" },
        { label: "Getting Involved", value: "getting-involved" },
      ],
    },
    {
      name: "sortOrder",
      type: "number",
      label: "Sort Order",
      defaultValue: 0,
      admin: {
        description: "Lower numbers appear first within a category.",
      },
    },
    {
      name: "spanishQuestion",
      type: "text",
      label: "Question (Spanish)",
      admin: {
        description: "Human-translated. Leave blank until translator provides it.",
      },
    },
    {
      name: "spanishAnswer",
      type: "richText",
      label: "Answer (Spanish)",
    },
  ],
}
