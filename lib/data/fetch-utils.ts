import { BLOG_POSTS, type BlogPost } from "./blog-posts"
import { pastEvents, upcomingEvent, type EventData } from "./events"

// Lazy import Payload to avoid pulling it into every server bundle at parse time.
// This significantly reduces memory usage during build ("Collecting page data" step)
// especially when the CMS has no data yet.
async function loadPayload() {
  // Allow opting out of Payload during build (e.g. CI / preview deploys with no DB)
  if (process.env.SKIP_PAYLOAD_AT_BUILD === "true") {
    return null
  }
  try {
    const [{ getPayload }, { default: configPromise }] = await Promise.all([
      import("payload"),
      import("@payload-config"),
    ])
    return await getPayload({ config: configPromise })
  } catch (error) {
    console.error("Failed to initialize Payload CMS:", error)
    return null
  }
}

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
    const payload = await loadPayload()
    if (!payload) return BLOG_POSTS

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
        publishedAt: doc.publishedAt ? new Date(String(doc.publishedAt)).toISOString().split("T")[0] : "2026-01-01",
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

function getEventStartMs(event: EventData): number | null {
  if (!event.startsAt) return null
  const ms = new Date(event.startsAt).getTime()
  return Number.isFinite(ms) ? ms : null
}

export function partitionEvents(
  events: EventData[],
  now: Date = new Date(),
): { upcoming: EventData | null; past: EventData[] } {
  const nowMs = now.getTime()

  const dated = events
    .map((event) => ({ event, startMs: getEventStartMs(event) }))
    .filter((entry): entry is { event: EventData; startMs: number } => entry.startMs !== null)

  const upcomingList = dated
    .filter((entry) => entry.startMs >= nowMs)
    .sort((a, b) => a.startMs - b.startMs)
    .map((entry) => entry.event)

  const past = dated
    .filter((entry) => entry.startMs < nowMs)
    .sort((a, b) => b.startMs - a.startMs)
    .map((entry) => entry.event)

  return {
    upcoming: upcomingList[0] ?? null,
    past: [...upcomingList.slice(1), ...past],
  }
}

export async function getEvents(): Promise<{ upcoming: EventData | null; past: EventData[] }> {
  try {
    const payload = await loadPayload()
    if (!payload) {
      return partitionEvents([upcomingEvent, ...pastEvents])
    }

    const { docs } = await payload.find({
      collection: "events",
      limit: 100,
    })

    if (docs.length > 0) {
      const mappedEvents: EventData[] = docs
        .map((doc: Record<string, unknown>) => {
          const schedule = Array.isArray(doc.schedule)
            ? doc.schedule.map((s: Record<string, unknown>) => ({ label: String(s.label), time: String(s.time) }))
            : []
          const details = Array.isArray(doc.details)
            ? doc.details.map((d: Record<string, unknown>) => ({ label: String(d.label), value: String(d.value) }))
            : []
          const flyerImage = doc.flyerImage as Record<string, unknown> | undefined
          const startsAtRaw = doc.startsAt
          const endsAtRaw = doc.endsAt
          const startsAt = startsAtRaw ? new Date(String(startsAtRaw)).toISOString() : ""
          const endsAt = endsAtRaw ? new Date(String(endsAtRaw)).toISOString() : undefined
          return {
            id: String(doc.id),
            title: String(doc.title),
            date: String(doc.date),
            startsAt,
            endsAt,
            location: String(doc.location || ""),
            schedule,
            details,
            description: String(doc.description || ""),
            flyerSrc: typeof flyerImage?.url === "string" ? flyerImage.url : "/images/placeholder.jpg",
            flyerAlt: String(doc.flyerAlt || "Event flyer"),
          }
        })
        .filter((e: EventData) => Boolean(e.startsAt))

      return partitionEvents(mappedEvents)
    }
  } catch (error) {
    console.error("Failed to fetch events from CMS, falling back to static:", error)
  }

  return partitionEvents([upcomingEvent, ...pastEvents])
}
