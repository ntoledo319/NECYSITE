import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { BLOG_POSTS } from "@/lib/data/blog-posts"
import SiteFooter from "@/components/site-footer"
import MobileCtaBar from "@/components/mobile-cta-bar"
import PageArtAccents from "@/components/art/page-art-accents"
import Link from "next/link"
import { ArrowLeft, BookOpen } from "lucide-react"

const CATEGORY_STYLES: Record<string, { label: string; colorVar: string; rgb: string }> = {
  story: { label: "Story", colorVar: "var(--nec-purple)", rgb: "124,58,237" },
  update: { label: "Update", colorVar: "var(--nec-cyan)", rgb: "20,184,166" },
  recap: { label: "Recap", colorVar: "var(--nec-gold)", rgb: "212,160,23" },
  announcement: { label: "Announcement", colorVar: "var(--nec-pink)", rgb: "192,38,211" },
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00")
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = BLOG_POSTS.find((p) => p.slug === slug)
  if (!post) {
    return { title: "Post Not Found — NECYPAA XXXVI" }
  }
  return {
    title: `${post.title} — NECYBLOG · NECYPAA XXXVI`,
    description: post.excerpt,
  }
}

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }))
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = BLOG_POSTS.find((p) => p.slug === slug)

  if (!post) {
    notFound()
  }

  const cat = CATEGORY_STYLES[post.category] ?? CATEGORY_STYLES.story
  const paragraphs = post.body.split("\n\n").filter(Boolean)

  return (
    <div
      className="min-h-screen min-h-screen-safe flex flex-col relative"
      style={{ backgroundColor: "var(--nec-navy)" }}
    >
      <PageArtAccents character="caterpillar" accentColor="var(--nec-gold)" variant="subtle" dividerVariant="compass" />

      <div className="flex-1 pt-24 pb-20 md:pb-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Back link */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-semibold mb-8 transition-colors hover:text-white"
              style={{ color: "var(--nec-muted)" }}
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              Back to NECYBLOG
            </Link>

            {/* Article card */}
            <article
              className="nec-card overflow-hidden"
              style={{
                boxShadow: `0 8px 48px rgba(0,0,0,0.4), 0 0 80px rgba(${cat.rgb},0.08)`,
              }}
            >
              {/* Top accent bar */}
              <div
                className="h-1 w-full"
                aria-hidden="true"
                style={{
                  background: `linear-gradient(90deg, rgba(${cat.rgb},0.7) 0%, rgba(${cat.rgb},0.2) 100%)`,
                }}
              />

              <div className="p-8 md:p-12">
                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest"
                    style={{
                      background: `rgba(${cat.rgb},0.12)`,
                      border: `1px solid rgba(${cat.rgb},0.35)`,
                      color: cat.colorVar,
                    }}
                  >
                    <BookOpen className="w-3 h-3" aria-hidden="true" />
                    {cat.label}
                  </span>
                  <time
                    dateTime={post.publishedAt}
                    className="text-xs font-medium"
                    style={{ color: "var(--nec-muted)" }}
                  >
                    {formatDate(post.publishedAt)}
                  </time>
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-6 leading-tight">
                  {post.title}
                </h1>

                {/* Body */}
                <div className="space-y-4">
                  {paragraphs.map((p, i) => (
                    <p
                      key={i}
                      className="text-base leading-relaxed"
                      style={{ color: "var(--nec-text)" }}
                    >
                      {p}
                    </p>
                  ))}
                </div>

                <p
                  className="text-base leading-relaxed italic mt-6"
                  style={{ color: "var(--nec-muted)" }}
                >
                  &mdash;Anonymous
                </p>
              </div>
            </article>

            {/* Back to blog CTA */}
            <div className="text-center mt-10">
              <Link href="/blog" className="btn-ghost">
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                Read More Posts
              </Link>
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
      <MobileCtaBar />
    </div>
  )
}
