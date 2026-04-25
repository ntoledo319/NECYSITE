import type { Metadata } from "next"
import { notFound } from "next/navigation"

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

function isRecentPost(dateStr: string, daysThreshold = 14): boolean {
  const published = new Date(dateStr + "T12:00:00")
  const now = new Date()
  const diffMs = now.getTime() - published.getTime()
  return diffMs >= 0 && diffMs < daysThreshold * 24 * 60 * 60 * 1000
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) {
    return { title: "Post Not Found — NECYPAA XXXVI" }
  }
  return {
    title: `${post.title} — NECYBLOG · NECYPAA XXXVI`,
    description: post.excerpt,
  }
}

export async function generateStaticParams() {
  const posts = await getBlogPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const cat = CATEGORY_STYLES[post.category] ?? CATEGORY_STYLES.story
  const paragraphs = post.body.split("\n\n").filter(Boolean)
  const [leadParagraph, ...remainingParagraphs] = paragraphs

  return (
    <div
      className="min-h-screen min-h-screen-safe flex flex-col relative overflow-hidden"
      style={{ backgroundColor: "var(--nec-navy)" }}
    >
      <PageArtAccents character="caterpillar" accentColor="var(--nec-gold)" variant="subtle" dividerVariant="compass" />

      <div className="page-frame">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-semibold mb-8 transition-colors hover:text-[var(--nec-text)] text-[var(--nec-muted)]"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              Back to NECYBLOG
            </Link>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
              <article
                className="overflow-hidden border bg-[rgba(var(--nec-card-rgb),0.94)] shadow-[0_24px_60px_rgba(44,24,16,0.10)]"
                style={{
                  borderRadius: "2rem",
                  borderColor: `rgba(${cat.rgb},0.16)`,
                }}
              >
                <div
                  className="h-1.5 w-full"
                  aria-hidden="true"
                  style={{
                    background: `linear-gradient(90deg, rgba(${cat.rgb},0.72) 0%, rgba(${cat.rgb},0.22) 100%)`,
                  }}
                />

                <div className="border-b border-[rgba(var(--nec-purple-rgb),0.10)] px-6 py-7 md:px-10 md:py-9">
                  <div className="flex flex-wrap items-center gap-3 mb-5">
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em]"
                      style={{
                        background: `rgba(${cat.rgb},0.12)`,
                        border: `1px solid rgba(${cat.rgb},0.24)`,
                        color: cat.colorVar,
                      }}
                    >
                      <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                      {cat.label}
                    </span>
                    <time
                      dateTime={post.publishedAt}
                      className="text-sm font-medium text-[var(--nec-muted)]"
                    >
                      {formatDate(post.publishedAt)}
                    </time>
                    {isRecentPost(post.publishedAt) && (
                      <span
                        className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest"
                        style={{
                          background: "rgba(var(--nec-cyan-rgb), 0.12)",
                          border: "1px solid rgba(var(--nec-cyan-rgb), 0.24)",
                          color: "var(--nec-cyan)",
                        }}
                        aria-label="Recently published"
                      >
                        New
                      </span>
                    )}
                  </div>

                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.045em] text-[var(--nec-text)] leading-tight">
                    {post.title}
                  </h1>

                  <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--nec-muted)]">
                    {post.excerpt}
                  </p>
                </div>

                <div className="px-6 py-7 md:px-10 md:py-10">
                  {leadParagraph && (
                    <div
                      className="rounded-[1.4rem] border px-5 py-5 md:px-6"
                      style={{
                        borderColor: `rgba(${cat.rgb},0.18)`,
                        background: `linear-gradient(145deg, rgba(${cat.rgb},0.08), rgba(var(--nec-card-rgb),0.72))`,
                      }}
                    >
                      <p className="text-lg leading-9 text-[var(--nec-text)] md:text-[1.3rem]">
                        {leadParagraph}
                      </p>
                    </div>
                  )}

                  <div className="mt-8 space-y-5">
                    {remainingParagraphs.map((paragraph, index) => (
                      <p
                        key={index}
                        className="max-w-3xl text-base leading-8 text-[var(--nec-text)]"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  <p className="text-base leading-relaxed italic mt-8 text-[var(--nec-muted)]">
                    &mdash;Anonymous
                  </p>
                </div>
              </article>

              <aside className="space-y-4 lg:sticky lg:top-28">
                <div
                  className="overflow-hidden rounded-[1.6rem] border bg-[rgba(var(--nec-card-rgb),0.86)] p-4 shadow-[0_18px_44px_rgba(44,24,16,0.08)]"
                  style={{ borderColor: `rgba(${cat.rgb},0.16)` }}
                >
                  <div
                    className="rounded-[1.15rem] border p-2"
                    style={{
                      borderColor: `rgba(${cat.rgb},0.16)`,
                      background: `linear-gradient(145deg, rgba(${cat.rgb},0.07), rgba(var(--nec-card-rgb),0.90))`,
                    }}
                  >
                    <div className="aspect-[4/5] overflow-hidden rounded-[0.9rem] border border-[rgba(var(--nec-purple-rgb),0.10)] bg-[rgba(var(--nec-card-rgb),0.88)]">
                      <div
                        className="h-full w-full"
                        aria-hidden="true"
                        style={{
                          background: `radial-gradient(circle at 50% 26%, rgba(${cat.rgb},0.24) 0%, transparent 28%), linear-gradient(180deg, rgba(${cat.rgb},0.08) 0%, rgba(var(--nec-card-rgb),0.96) 72%)`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <Link href="/blog" className="btn-ghost w-full !justify-center">
                    <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                    Read More Posts
                  </Link>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
      <MobileCtaBar />
    </div>
  )
}
