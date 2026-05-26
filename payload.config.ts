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
import { GroupRegistrations } from "./collections/GroupRegistrations"
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
    GroupRegistrations,
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
    // Auto-sync schema on app boot via Drizzle's `db push`. The project has
    // no migration files (`/migrations` doesn't exist and no `payload
    // migrate` script in package.json), so without this, every schema
    // addition lands in code but never reaches the production Turso DB
    // and the app errors out on the new columns. All schema changes in
    // this branch are additive (new tables, new optional columns, new
    // unique indexes on empty collections), so push is safe — but if a
    // destructive change is ever introduced (renames, type changes,
    // dropped columns), pair the change with a proper migration first.
    push: true,
  }),
  editor: lexicalEditor(),
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  sharp,
})
