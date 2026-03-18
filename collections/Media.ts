import type { CollectionConfig } from "payload"

export const Media: CollectionConfig = {
  slug: "media",
  upload: {
    mimeTypes: ["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml"],
    staticDir: "public/media",
  },
  admin: {
    useAsTitle: "alt",
    description: "Uploaded images and media files for the NECYPAA XXXVI site.",
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      label: "Alt Text",
      admin: {
        description: "Descriptive alt text for accessibility (WCAG AAA). Use meaningful descriptions, not filenames.",
      },
    },
  ],
}
