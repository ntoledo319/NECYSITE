import type { CollectionConfig } from "payload"

export const BlogPosts: CollectionConfig = {
  slug: "blog-posts",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "publishedAt", "status"],
    description:
      "NECYBLOG — articles, updates, and stories from the road to Hartford. Per Tradition 12: first names only, no identifiable photos.",
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      label: "Title",
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      label: "URL Slug",
      admin: {
        description: 'URL-safe identifier, e.g. "road-to-hartford". No spaces, lowercase.',
      },
    },
    {
      name: "category",
      type: "select",
      required: true,
      label: "Category",
      options: [
        { label: "Update", value: "update" },
        { label: "Story", value: "story" },
        { label: "Recap", value: "recap" },
        { label: "Announcement", value: "announcement" },
      ],
    },
    {
      name: "excerpt",
      type: "textarea",
      required: true,
      label: "Excerpt",
      admin: {
        description: "Short summary for cards and social sharing (1–2 sentences).",
      },
    },
    {
      name: "body",
      type: "richText",
      required: true,
      label: "Body",
    },
    {
      name: "featuredImage",
      type: "upload",
      relationTo: "media",
      label: "Featured Image",
      admin: {
        description: "Image for the blog card and header. Per Tradition 12: no identifiable faces of AA members.",
      },
    },
    {
      name: "author",
      type: "text",
      label: "Author (First Name Only)",
      admin: {
        description: "First name only per Tradition 12. Leave blank for committee-authored posts.",
      },
    },
    {
      name: "publishedAt",
      type: "date",
      required: true,
      label: "Publish Date",
      admin: {
        date: {
          pickerAppearance: "dayOnly",
        },
      },
    },
    {
      name: "spanishTitle",
      type: "text",
      label: "Title (Spanish)",
      admin: {
        description: "Human-translated Spanish title. Leave blank until translator provides it.",
      },
    },
    {
      name: "spanishExcerpt",
      type: "textarea",
      label: "Excerpt (Spanish)",
    },
    {
      name: "spanishBody",
      type: "richText",
      label: "Body (Spanish)",
    },
  ],
}
