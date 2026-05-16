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
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://js.stripe.com https://va.vercel-scripts.com https://www.googletagmanager.com`,
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self'",
    "img-src 'self' data: blob: https://*.stripe.com",
    "frame-src 'self' https://js.stripe.com https://hooks.stripe.com",
    `connect-src 'self' https://api.stripe.com https://va.vercel-scripts.com https://vitals.vercel-insights.com https://www.google-analytics.com${issuerOrigin ? " " + issuerOrigin : ""}`,
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
