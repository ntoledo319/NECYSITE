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
})

function parseEnv() {
  const raw = {
    PAYLOAD_SECRET: process.env.PAYLOAD_SECRET,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    ISSUER_SERVICE_BASE_URL: process.env.ISSUER_SERVICE_BASE_URL,
    ISSUER_SERVICE_API_KEY: process.env.ISSUER_SERVICE_API_KEY,
    DATABASE_URI: process.env.DATABASE_URI,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  }

  const parsed = envSchema.safeParse(raw)

  if (!parsed.success) {
    const messages = parsed.error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`).join("\n")
    // Warn instead of throwing so builds don't fail in contexts where some optional vars are missing.
    // Call validateEnv() at app startup in production to enforce strictly.
    if (typeof console !== "undefined" && process.env.NODE_ENV !== "test") {
      console.warn(`[env] Environment validation warnings:\n${messages}`)
    }
  }

  return parsed.success ? parsed.data : (raw as z.infer<typeof envSchema>)
}

export const env = parseEnv()

export function validateEnv(): void {
  const parsed = envSchema.safeParse({
    PAYLOAD_SECRET: process.env.PAYLOAD_SECRET,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    ISSUER_SERVICE_BASE_URL: process.env.ISSUER_SERVICE_BASE_URL,
    ISSUER_SERVICE_API_KEY: process.env.ISSUER_SERVICE_API_KEY,
    DATABASE_URI: process.env.DATABASE_URI,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  })

  if (!parsed.success) {
    const messages = parsed.error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`).join("\n")
    throw new Error(`Invalid environment variables:\n${messages}`)
  }
}
