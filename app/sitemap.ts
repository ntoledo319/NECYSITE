import type { MetadataRoute } from "next"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://www.necypaact.com"

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/register", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/events", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/faq", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/service", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/states", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/alanon", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/blog", priority: 0.6, changeFrequency: "weekly" as const },
    { path: "/journey", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/accessibility", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/breakfast", priority: 0.5, changeFrequency: "monthly" as const },
    { path: "/program", priority: 0.5, changeFrequency: "monthly" as const },
    { path: "/merch", priority: 0.5, changeFrequency: "monthly" as const },
    { path: "/prayer", priority: 0.4, changeFrequency: "monthly" as const },
    { path: "/asl", priority: 0.4, changeFrequency: "monthly" as const },
    { path: "/bid", priority: 0.4, changeFrequency: "monthly" as const },
  ]

  return routes.map((route) => ({
    url: `${BASE_URL}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))
}
