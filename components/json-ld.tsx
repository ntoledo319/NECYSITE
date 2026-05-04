export function EventJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "NECYPAA XXXVI — Escaping the Mad Realm",
    description:
      "The 36th Northeast Convention of Young People in Alcoholics Anonymous. Four days of speakers, workshops, meetings, and fellowship.",
    startDate: "2026-12-31T18:00:00-05:00",
    endDate: "2027-01-03T14:00:00-05:00",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: "Hartford Marriott Downtown",
      address: {
        "@type": "PostalAddress",
        streetAddress: "200 Columbus Blvd",
        addressLocality: "Hartford",
        addressRegion: "CT",
        postalCode: "06103",
        addressCountry: "US",
      },
    },
    image: "https://www.necypaact.com/images/necypaa-xxxvi-flyer.webp",
    organizer: {
      "@type": "Organization",
      name: "NECYPAA XXXVI Connecticut Host Committee",
      url: "https://www.necypaact.com",
    },
    offers: {
      "@type": "Offer",
      url: "https://www.necypaact.com/register",
      availability: "https://schema.org/InStock",
      validFrom: "2025-01-01",
    },
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
}

export function OrganizationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "NECYPAA XXXVI Connecticut Host Committee",
    url: "https://www.necypaact.com",
    email: "info@necypaa.org",
    logo: "https://www.necypaact.com/images/necypaa-xxxvi-badge.webp",
    sameAs: ["https://necypaa.org/"],
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
}
