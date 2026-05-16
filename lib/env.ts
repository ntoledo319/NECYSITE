import { z } from "zod"

const envSchema = z.object({
  PAYLOAD_SECRET: z.string().min(1, "PAYLOAD_SECRET is required"),
  STRIPE_SECRET_KEY: z.string().min(1, "STRIPE_SECRET_KEY is required"),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1, "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is required"),
  NEXT_PUBLIC_BASE_URL: z.string().url().default("https://www.necypaact.com"),
  ISSUER_SERVICE_BASE_URL: z.string().url().optional(),
  ISSUER_SERVICE_API_KEY: z.string().optional(),
  DATABASE_URI: z.string().optional(),
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  GOOGLE_CALENDAR_API_KEY: z.string().optional(),
  NEXT_PUBLIC_GA_ID: z.string().optional(),
  SKIP_PAYLOAD_AT_BUILD: z.string().optional(),
  REGISTRATION_PAUSED: z.string().optional(),
  REGISTRATION_PAUSED_REASON: z.string().optional(),
  NEXT_PUBLIC_REGISTRATION_PAUSED: z.string().optional(),
  CRON_SECRET: z.string().optional(),
  SUCCESS_URL_HMAC_SECRET: z.string().optional(),
  ALERT_SLACK_WEBHOOK_URL: z.string().url().optional(),
  ALERT_EMAIL_TO: z.string().email().optional(),
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM: z.string().optional(),
  SENTRY_DSN: z.string().url().optional(),
  BOTID_ENABLED: z.string().optional(),
})

const ENV_KEYS = [
  "PAYLOAD_SECRET",
  "STRIPE_SECRET_KEY",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  "NEXT_PUBLIC_BASE_URL",
  "ISSUER_SERVICE_BASE_URL",
  "ISSUER_SERVICE_API_KEY",
  "DATABASE_URI",
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN",
  "STRIPE_WEBHOOK_SECRET",
  "GOOGLE_CALENDAR_API_KEY",
  "NEXT_PUBLIC_GA_ID",
  "SKIP_PAYLOAD_AT_BUILD",
  "REGISTRATION_PAUSED",
  "REGISTRATION_PAUSED_REASON",
  "NEXT_PUBLIC_REGISTRATION_PAUSED",
  "CRON_SECRET",
  "SUCCESS_URL_HMAC_SECRET",
  "ALERT_SLACK_WEBHOOK_URL",
  "ALERT_EMAIL_TO",
  "RESEND_API_KEY",
  "RESEND_FROM",
  "SENTRY_DSN",
  "BOTID_ENABLED",
] as const

function readEnv(): Record<(typeof ENV_KEYS)[number], string | undefined> {
  const out = {} as Record<(typeof ENV_KEYS)[number], string | undefined>
  for (const key of ENV_KEYS) {
    out[key] = process.env[key]
  }
  return out
}

function parseEnv() {
  const raw = readEnv()
  const parsed = envSchema.safeParse(raw)

  if (!parsed.success) {
    const messages = parsed.error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`).join("\n")
    if (process.env.NODE_ENV === "production") {
      throw new Error(`Invalid environment variables:\n${messages}`)
    }
    if (typeof console !== "undefined" && process.env.NODE_ENV !== "test") {
      console.warn(`[env] Environment validation warnings:\n${messages}`)
    }
  }

  return parsed.success ? parsed.data : (raw as z.infer<typeof envSchema>)
}

export const env = parseEnv()

export function validateEnv(): void {
  const parsed = envSchema.safeParse(readEnv())
  if (!parsed.success) {
    const messages = parsed.error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`).join("\n")
    throw new Error(`Invalid environment variables:\n${messages}`)
  }
}

if (process.env.NODE_ENV === "production") {
  validateEnv()
}
