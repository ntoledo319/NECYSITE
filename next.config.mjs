import { withPayload } from "@payloadcms/next/withPayload"
import createNextIntlPlugin from "next-intl/plugin"
import createBundleAnalyzer from "@next/bundle-analyzer"

const withNextIntl = createNextIntlPlugin("./i18n/request.ts")
const withBundleAnalyzer = createBundleAnalyzer({ enabled: process.env.ANALYZE === "true" })

function getIssuerOrigin() {
  try {
    return process.env.ISSUER_SERVICE_BASE_URL ? new URL(process.env.ISSUER_SERVICE_BASE_URL).origin : ""
  } catch {
    return ""
  }
}

const issuerOrigin = getIssuerOrigin()

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Keep native libsql/SQLite modules out of the webpack bundle so they resolve from
  // node_modules at runtime on Vercel. Without this, Next.js tries to bundle the
  // native binding and the deployed function throws "Cannot find module 'libsql'".
  serverExternalPackages: [
    "libsql",
    "@libsql/client",
    "@libsql/core",
    "@payloadcms/db-sqlite",
  ],
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "@radix-ui/react-accordion",
      "@radix-ui/react-checkbox",
      "@radix-ui/react-label",
      "@radix-ui/react-slot",
      "@radix-ui/react-switch",
    ],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
    deviceSizes: [360, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://va.vercel-scripts.com https://www.googletagmanager.com",
              "style-src 'self' 'unsafe-inline'",
              "font-src 'self'",
              "img-src 'self' data: blob: https://*.stripe.com",
              "frame-src 'self' https://js.stripe.com https://hooks.stripe.com",
              `connect-src 'self' https://api.stripe.com https://va.vercel-scripts.com https://vitals.vercel-insights.com https://www.google-analytics.com${issuerOrigin ? " " + issuerOrigin : ""}`,
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
            ].join("; "),
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
      {
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/fonts/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ]
  },
}

export default withBundleAnalyzer(withPayload(withNextIntl(nextConfig)))
