import type { CollectionConfig } from "payload"

export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    useAsTitle: "email",
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: ({ req: { user } }) => Boolean(user?.role === "admin"),
    update: ({ req: { user }, id }) => Boolean(user?.role === "admin" || user?.id === id),
    delete: ({ req: { user } }) => Boolean(user?.role === "admin"),
  },
  fields: [
    {
      name: "name",
      type: "text",
      label: "Display Name",
    },
    {
      name: "role",
      type: "select",
      options: [
        { label: "Admin", value: "admin" },
        { label: "Editor", value: "editor" },
        { label: "Registration", value: "registration" },
        { label: "Viewer", value: "viewer" },
      ],
      defaultValue: "editor",
      required: true,
    },
  ],
}
