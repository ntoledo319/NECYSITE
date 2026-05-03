'use client'

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'
import { pageview, GA_TRACKING_ID } from '@/lib/gtag'

function AnalyticsContent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!GA_TRACKING_ID) return

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')
    pageview(url)
  }, [pathname, searchParams])

  return null
}

export function GoogleAnalytics() {
  if (!GA_TRACKING_ID) {
    return null
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
              send_page_view: true,
              transport_type: 'beacon',
              cookie_flags: 'SameSite=None;Secure',
              custom_map: {
                'dimension1': 'user_type',
                'dimension2': 'page_category',
                'dimension3': 'content_language'
              }
            });
            
            // Enhanced Ecommerce (for future ticket sales)
            gtag('config', '${GA_TRACKING_ID}', {
              'cookie_expires': 63072000,
              'cookie_update': true,
              'anonymize_ip': false,
              'allow_google_signals': true,
              'allow_ad_personalization_signals': false,
              'transport_type': 'beacon'
            });
          `,
        }}
      />
      <Suspense fallback={null}>
        <AnalyticsContent />
      </Suspense>
    </>
  )
}
