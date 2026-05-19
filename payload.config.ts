import { buildConfig } from "payload"
import { sqliteAdapter } from "@payloadcms/db-sqlite"
import { lexicalEditor } from "@payloadcms/richtext-lexical"
import sharp from "sharp"
import path from "path"
import { fileURLToPath } from "url"
import { Users } from "./collections/Users"
import { Events } from "./collections/Events"
import { Media } from "./collections/Media"
import { BlogPosts } from "./collections/BlogPosts"
import { FAQ } from "./collections/FAQ"
import { Registrations } from "./collections/Registrations"
import { RegistrationFailures } from "./collections/RegistrationFailures"
import { WebhookFailures } from "./collections/WebhookFailures"
import { ProcessedWebhookEvents } from "./collections/ProcessedWebhookEvents"
import { GiftCodes } from "./collections/GiftCodes"
import { Donations } from "./collections/Donations"
import { PricingSettings } from "./globals/PricingSettings"

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: " — NECYPAA XXXVI CMS",
    },
  },
  collections: [
    Users,
    Events,
    BlogPosts,
    FAQ,
    Media,
    Registrations,
    GiftCodes,
    Donations,
    RegistrationFailures,
    WebhookFailures,
    ProcessedWebhookEvents,
  ],
  globals: [PricingSettings],
  secret:
    process.env.PAYLOAD_SECRET ??
    (() => {
      throw new Error("PAYLOAD_SECRET environment variable is required")
    })(),
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || "file:./payload.db",
    },
  }),
  editor: lexicalEditor(),
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  sharp,
})
