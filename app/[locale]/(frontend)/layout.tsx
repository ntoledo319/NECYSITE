import type React from "react"
import type { Metadata, Viewport } from "next"
import { Plus_Jakarta_Sans, Outfit, Bangers } from "next/font/google"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { notFound } from "next/navigation"
import { routing } from "@/i18n/routing"
import "./globals.css"
import SiteHeader from "@/components/site-header"
import { A11yProvider } from "@/lib/accessibility-context"
import AccessibilityPanel from "@/components/accessibility-panel"
import MadRealmArtLayer from "@/components/art/mad-realm-art-layer"
import GrainOverlayWrapper from "@/components/ui/grain-overlay-wrapper"
import { WebVitalsReporter } from "@/app/web-vitals-reporter"

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
})

const bangers = Bangers({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? "https://www.necypaact.com"),
  title: "NECYPAA XXXVI — Escaping the Mad Realm · Hartford, CT · Dec 31, 2026 – Jan 3, 2027",
  description:
    "NECYPAA XXXVI: Escaping the Mad Realm. The Northeast Convention of Young People in Alcoholics Anonymous. Hartford Marriott Downtown, Hartford, CT. New Year's Eve 2026 – Jan 3, 2027. Pre-register for $40.",
  openGraph: {
    title: "NECYPAA XXXVI — Escaping the Mad Realm · Hartford, CT",
    description:
      "Escaping the Mad Realm — Join us at the Northeast Convention of Young People in AA. 4 days of fellowship, speakers, and celebration. Hartford Marriott Downtown · Dec 31, 2026 – Jan 3, 2027 · Pre-reg $40.",
    url: "https://www.necypaact.com",
    siteName: "NECYPAA XXXVI CT Host",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/necypaa-xxxvi-badge.webp",
        width: 1200,
        height: 1200,
        alt: "NECYPAA XXXVI — Escaping the Mad Realm — Hartford, CT — Dec 31, 2026 – Jan 3, 2027",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NECYPAA XXXVI — Escaping the Mad Realm · Hartford, CT",
    description: "Escaping the Mad Realm — Northeast Convention of Young People in AA · New Year's Eve 2026 · Pre-reg $40",
    images: ["/images/necypaa-xxxvi-badge.webp"],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params

  if (!routing.locales.includes(locale as "en" | "es")) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html lang={locale}>
      <head>
        <meta name="color-scheme" content="dark light" />
        <link
          rel="preload"
          href="https://fonts.gstatic.com/s/plusjakartasans/v8/LDIbaomQNQcsA88c7O9yZ4KMCoOg4IA6-91aHEjcWuA_qU7NShXUEKi4Rw.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="https://fonts.gstatic.com/s/outfit/v11/QGYyz_MVcBeNP4NjuGObqx1XmO1I4TC0C4G-EiAou6Y.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${jakarta.variable} ${outfit.variable} ${bangers.variable} ${jakarta.className}`}>
        <WebVitalsReporter />
        <NextIntlClientProvider messages={messages}>
          <A11yProvider>
            <MadRealmArtLayer />
            {/* Skip-to-content link for keyboard/screen-reader users */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-bold focus:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[var(--nec-navy)]"
              style={{ backgroundColor: "var(--nec-pink)" }}
            >
              Skip to main content
            </a>
            <GrainOverlayWrapper />
            <SiteHeader />
            <main id="main-content" className="pt-16">
              {children}
            </main>
            <AccessibilityPanel />
          </A11yProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
