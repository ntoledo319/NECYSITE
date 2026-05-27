/**
 * One-off schema push to the production Turso database.
 *
 * Boots Payload with the current config (push: true enabled), which makes
 * Drizzle compare the code schema to the database and run additive ALTER /
 * CREATE statements. Pure additions only — old code keeps working.
 *
 * Loads .env.local manually (no dotenv dependency) so it can run as a
 * standalone script.
 *
 * Usage:
 *   pnpm tsx scripts/push-schema.mts
 */

import fs from "node:fs"
import path from "node:path"

function loadEnvFile(filename: string): void {
  const filepath = path.resolve(process.cwd(), filename)
  if (!fs.existsSync(filepath)) return
  const content = fs.readFileSync(filepath, "utf8")
  for (const line of content.split("\n")) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const eq = trimmed.indexOf("=")
    if (eq < 0) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1)
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1)
    if (!process.env[key]) process.env[key] = value
  }
}

loadEnvFile(".env.local")
loadEnvFile(".env")

if (!process.env.PAYLOAD_SECRET) {
  console.error("PAYLOAD_SECRET is required (set in .env.local or pass directly)")
  process.exit(1)
}
if (!process.env.DATABASE_URI) {
  console.error("DATABASE_URI is required")
  process.exit(1)
}

console.log("Booting Payload with push: true to sync schema…")
console.log(`  DB host: ${process.env.DATABASE_URI.split("?")[0].replace(/libsql:\/\//, "")}`)

const start = Date.now()
const { getPayload } = await import("payload")
const { default: payloadConfig } = await import("../payload.config.ts")
const payload = await getPayload({ config: payloadConfig })
console.log(`✓ Payload initialized in ${Date.now() - start}ms`)

console.log("\nVerifying — selecting from each collection…")
const collections = [
  "registrations",
  "gift-codes",
  "donations",
  "group-registrations",
  "registration-failures",
  "webhook-failures",
  "processed-webhook-events",
] as const

let failures = 0
for (const collection of collections) {
  try {
    const result = await payload.find({ collection, limit: 1 })
    console.log(`  ✓ ${collection.padEnd(30)} (${result.totalDocs} rows)`)
  } catch (err) {
    console.error(`  ✗ ${collection.padEnd(30)} FAILED:`, err instanceof Error ? err.message.slice(0, 200) : err)
    failures += 1
  }
}

if (failures > 0) {
  console.error(`\n${failures} collection(s) still failing.`)
  process.exit(1)
}
console.log("\nAll collections verified. Schema push complete.")
process.exit(0)
