declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'consent' | 'set',
      targetId: string,
      config?: GtagConfig | GtagEventParams | GtagConsentParams | GtagUserProperties
    ) => void
    dataLayer: unknown[]
  }
}

interface GtagConfig {
  page_path?: string
  page_title?: string
  page_location?: string
  send_page_view?: boolean
  transport_type?: string
  cookie_flags?: string
  [key: string]: unknown
}

interface GtagEventParams {
  event_category?: string
  event_label?: string
  value?: number
  [key: string]: unknown
}

interface GtagConsentParams {
  analytics_storage?: 'granted' | 'denied'
  ad_storage?: 'granted' | 'denied'
  functionality_storage?: 'granted' | 'denied'
  personalization_storage?: 'granted' | 'denied'
  security_storage?: 'granted' | 'denied'
  wait_for_update?: number
}

interface GtagUserProperties {
  [key: string]: string | number | boolean
}

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID ?? ''

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export function pageview(url: string, title?: string) {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('event', 'page_view', {
    page_path: url,
    page_title: title ?? document.title,
    page_location: window.location.href,
  })
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export function event(
  action: string,
  params?: GtagEventParams
) {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('event', action, params)
}

// Set user properties for enhanced demographics
export function setUserProperties(properties: Record<string, string | number | boolean>) {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('set', GA_TRACKING_ID, properties)
}

// Track custom events for NECYPAA
export function trackRegistrationStarted(location: string) {
  event('registration_started', {
    event_category: 'conversion',
    event_label: location,
  })
}

export function trackRegistrationCompleted(ticketType: string) {
  event('registration_completed', {
    event_category: 'conversion',
    event_label: ticketType,
  })
}

export function trackDonation(amount: number, method: string) {
  event('donation_made', {
    event_category: 'donation',
    value: amount,
    event_label: method,
  })
}

export function trackExternalLink(url: string, linkType: string) {
  event('external_link_click', {
    event_category: 'engagement',
    event_label: linkType,
    link_url: url,
  })
}

export function trackFAQExpanded(questionSlug: string) {
  event('faq_expanded', {
    event_category: 'engagement',
    event_label: questionSlug,
  })
}

export function trackVideoPlay(videoTitle: string) {
  event('video_play', {
    event_category: 'engagement',
    event_label: videoTitle,
  })
}

export function trackScrollDepth(depth: number) {
  event('scroll_depth', {
    event_category: 'engagement',
    value: depth,
    event_label: `${depth}%`,
  })
}

export function trackSearch(query: string, resultsCount: number) {
  event('search', {
    event_category: 'engagement',
    search_term: query,
    value: resultsCount,
  })
}

export function trackFormStart(formName: string) {
  event('form_start', {
    event_category: 'form',
    event_label: formName,
  })
}

export function trackFormSubmit(formName: string) {
  event('form_submit', {
    event_category: 'form',
    event_label: formName,
  })
}

export function trackError(errorType: string, errorMessage: string) {
  event('error', {
    event_category: 'error',
    event_label: errorType,
    error_message: errorMessage.substring(0, 100),
  })
}

export function trackSocialShare(platform: string, contentType: string) {
  event('social_share', {
    event_category: 'social',
    event_label: platform,
    content_type: contentType,
  })
}

export function trackDownload(fileName: string, fileType: string) {
  event('file_download', {
    event_category: 'engagement',
    event_label: fileName,
    file_extension: fileType,
  })
}
