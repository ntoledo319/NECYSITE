import { getPayload } from "payload"
import configPromise from "@payload-config"
import { BLOG_POSTS, type BlogPost } from "./blog-posts"
import { pastEvents, upcomingEvent, type EventData } from "./events"

interface LexicalNode {
  type?: string
  text?: string
  children?: LexicalNode[]
}

interface LexicalRoot {
  root?: {
    children?: LexicalNode[]
  }
}

// Lexical AST to plaintext converter for simple paragraphs
function extractTextFromLexical(lexicalData: unknown): string {
  const data = lexicalData as LexicalRoot
  if (!data?.root?.children) return ""

  const paragraphs: string[] = []

  for (const block of data.root.children) {
    if (block.type === "paragraph" || block.type === "heading") {
      let text = ""
      for (const node of block.children || []) {
        if (node.text) {
          text += node.text
        }
      }
      if (text.trim()) {
        paragraphs.push(text.trim())
      }
    }
  }

  return paragraphs.join("\n\n")
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const payload = await getPayload({ config: configPromise })
    const { docs } = await payload.find({
      collection: "blog-posts",
      where: {
        _status: { equals: "published" },
      },
      sort: "-publishedAt",
      limit: 100,
    })

    if (docs.length > 0) {
      return docs.map((doc: Record<string, unknown>) => ({
        id: String(doc.id),
        title: String(doc.title),
        slug: String(doc.slug),
        excerpt: String(doc.excerpt || ""),
        body: typeof doc.body === "string" ? doc.body : extractTextFromLexical(doc.body),
        category: String(doc.category) as BlogPost["category"],
        publishedAt: doc.publishedAt ? new Date(String(doc.publishedAt)).toISOString().split('T')[0] : "2026-01-01",
      }))
    }
  } catch (error) {
    console.error("Failed to fetch blog posts from CMS, falling back to static:", error)
  }

  return BLOG_POSTS
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const posts = await getBlogPosts()
  return posts.find((p) => p.slug === slug)
}

function isValidEventDate(dateString: string): boolean {
  // Simple validation to ensure date string isn't completely mangled.
  return dateString.length > 5
}

function isPastEvent(dateString: string): boolean {
  // Try to parse the year out of the human-readable string (e.g. "April 25th, 2026")
  const match = dateString.match(/\b(20\d{2})\b/)
  if (match) {
    const year = parseInt(match[1], 10)
    const currentYear = new Date().getFullYear()
    if (year < currentYear) return true
    if (year > currentYear) return false
    
    // If same year, we'd ideally parse month/day, but the string is unstructured.
    // For robust architecture, we should add an ISO date field in the future.
  }
  return false
}

export async function getEvents(): Promise<{ upcoming: EventData | null; past: EventData[] }> {
  try {
    const payload = await getPayload({ config: configPromise })
    const { docs } = await payload.find({
      collection: "events",
      limit: 100,
    })

    if (docs.length > 0) {
      const mappedEvents: EventData[] = docs.map((doc: Record<string, unknown>) => {
        const schedule = Array.isArray(doc.schedule)
          ? doc.schedule.map((s: Record<string, unknown>) => ({ label: String(s.label), time: String(s.time) }))
          : []
        const details = Array.isArray(doc.details)
          ? doc.details.map((d: Record<string, unknown>) => ({ label: String(d.label), value: String(d.value) }))
          : []
        const flyerImage = doc.flyerImage as Record<string, unknown> | undefined
        return {
          id: String(doc.id),
          title: String(doc.title),
          date: String(doc.date),
          location: String(doc.location || ""),
          schedule,
          details,
          description: String(doc.description || ""),
          flyerSrc: typeof flyerImage?.url === "string" ? flyerImage.url : "/images/placeholder.jpg",
          flyerAlt: String(doc.flyerAlt || "Event flyer"),
        }
      })

      // Filter out invalid dates
      const validEvents = mappedEvents.filter(e => isValidEventDate(e.date))

      // Basic heuristic: assume the one event that isn't clearly past is upcoming
      // (This matches the site's current single-upcoming-event design).
      const past = validEvents.filter(e => isPastEvent(e.date))
      const potentialUpcoming = validEvents.filter(e => !isPastEvent(e.date))
      
      const upcoming = potentialUpcoming.length > 0 ? potentialUpcoming[0] : null
      const remainingPast = potentialUpcoming.slice(1) // if there are multiple, push to past for now

      return {
        upcoming,
        past: [...past, ...remainingPast],
      }
    }
  } catch (error) {
    console.error("Failed to fetch events from CMS, falling back to static:", error)
  }

  return {
    upcoming: upcomingEvent,
    past: pastEvents,
  }
}
