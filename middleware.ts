import createMiddleware from "next-intl/middleware"
import { type NextRequest } from "next/server"
import { routing } from "./i18n/routing"

const handleI18nRouting = createMiddleware(routing)

function getIssuerOrigin(): string {
  try {
    return process.env.ISSUER_SERVICE_BASE_URL
      ? new URL(process.env.ISSUER_SERVICE_BASE_URL).origin
      : ""
  } catch {
    return ""
  }
}

function buildCsp(nonce: string): string {
  const issuerOrigin = getIssuerOrigin()
  // Next.js dev mode uses eval() for React Fast Refresh / HMR. We allow
  // 'unsafe-eval' ONLY when NODE_ENV is "development"; production builds
  // never include it. Same with the dev-server WebSocket connection
  // (`ws:`) that's needed for HMR.
  const isDev = process.env.NODE_ENV === "development"
  const scriptSrc = [
    "script-src",
    "'self'",
    `'nonce-${nonce}'`,
    "'strict-dynamic'",
    ...(isDev ? ["'unsafe-eval'"] : []),
    "https://js.stripe.com",
    "https://va.vercel-scripts.com",
    "https://www.googletagmanager.com",
  ].join(" ")
  const connectSrc = [
    "connect-src",
    "'self'",
    "https://api.stripe.com",
    "https://va.vercel-scripts.com",
    "https://vitals.vercel-insights.com",
    "https://www.google-analytics.com",
    ...(isDev ? ["ws:", "wss:"] : []),
    ...(issuerOrigin ? [issuerOrigin] : []),
  ].join(" ")
  return [
    "default-src 'self'",
    scriptSrc,
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self'",
    "img-src 'self' data: blob: https://*.stripe.com",
    "frame-src 'self' https://js.stripe.com https://hooks.stripe.com",
    connectSrc,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join("; ")
}

export default function middleware(request: NextRequest) {
  const nonceBytes = new Uint8Array(16)
  crypto.getRandomValues(nonceBytes)
  const nonce = Buffer.from(nonceBytes).toString("base64")
  const csp = buildCsp(nonce)

  request.headers.set("x-nonce", nonce)

  const response = handleI18nRouting(request)

  response.headers.set("Content-Security-Policy", csp)
  response.headers.set("x-nonce", nonce)

  return response
}

export const config = {
  matcher: ["/((?!api|admin|_next|_vercel|images|fonts|media|.*\\..*).*)"],
}
