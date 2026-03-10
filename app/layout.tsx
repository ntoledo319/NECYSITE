import type React from "react"
import type { Metadata } from "next"
import { Inter, Bangers, Pacifico } from "next/font/google"
import "./globals.css"
import SiteHeader from "@/components/site-header"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const bangers = Bangers({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
})

const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-script",
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? "https://www.necypaact.com"),
  title: "NECYPAA XXXVI — Hartford, CT · Dec 31, 2026 – Jan 3, 2027",
  description:
    "NECYPAA XXXVI: The Northeast Convention of Young People in Alcoholics Anonymous. Hartford Marriott Downtown, Hartford, CT. New Year's Eve 2026 – Jan 3, 2027. Pre-register for $40.",
  openGraph: {
    title: "NECYPAA XXXVI — Hartford, CT · New Year's Eve 2026",
    description:
      "Join us at the Northeast Convention of Young People in AA. 4 days of fellowship, speakers, and celebration. Hartford Marriott Downtown · Dec 31, 2026 – Jan 3, 2027 · Pre-reg $40.",
    url: "https://www.necypaact.com",
    siteName: "NECYPAA XXXVI CT Host",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/necypaa-xxxvi-flyer.png",
        width: 1200,
        height: 630,
        alt: "NECYPAA XXXVI — Hartford, CT — Dec 31, 2026 – Jan 3, 2027",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NECYPAA XXXVI — Hartford, CT",
    description: "Northeast Convention of Young People in AA · New Year's Eve 2026 · Pre-reg $40",
    images: ["/images/necypaa-xxxvi-flyer.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${bangers.variable} ${pacifico.variable} ${inter.className}`}>
        <SiteHeader />
        {children}
      </body>
    </html>
  )
}
