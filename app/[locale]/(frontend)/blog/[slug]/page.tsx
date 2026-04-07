import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight, BookOpen, Clock3, Sparkles } from "lucide-react"
import PageArtAccents from "@/components/art/page-art-accents"
import MobileCtaBar from "@/components/mobile-cta-bar"
import SiteFooter from "@/components/site-footer"
import { BLOG_POSTS } from "@/lib/data/blog-posts"

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

function getReadingTime(body: string): string {
  const words = body.trim().split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.round(words / 220))
  return `${minutes} min read`
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = BLOG_POSTS.find((entry) => entry.slug === slug)

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
  const post = BLOG_POSTS.find((entry) => entry.slug === slug)

  if (!post) {
    notFound()
  }

  const category = CATEGORY_STYLES[post.category] ?? CATEGORY_STYLES.story
  const paragraphs = post.body.split("\n\n").filter(Boolean)
  const [ledeParagraph, ...bodyParagraphs] = paragraphs
  const currentIndex = BLOG_POSTS.findIndex((entry) => entry.slug === slug)
  const adjacentPosts = [BLOG_POSTS[currentIndex - 1], BLOG_POSTS[currentIndex + 1]].filter(
    (entry): entry is (typeof BLOG_POSTS)[number] => Boolean(entry),
  )

  return (
    <div
      className="relative min-h-screen min-h-screen-safe bg-[var(--nec-navy)]"
      style={{ backgroundColor: "var(--nec-navy)" }}
    >
      <PageArtAccents
        character="caterpillar"
        accentColor={category.colorVar}
        variant="subtle"
        dividerVariant="compass"
      />

      <div className="relative z-10 flex-1 pt-24 pb-20 md:pb-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--nec-muted)] transition-colors hover:text-[var(--nec-text)]"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to NECYBLOG
            </Link>

            <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
              <article className="overflow-hidden rounded-[2rem] border border-[rgba(var(--nec-purple-rgb),0.10)] bg-[rgba(var(--nec-card-rgb),0.76)] shadow-[0_20px_60px_rgba(16,10,7,0.10)]">
                <div
                  className="h-1.5 w-full"
                  aria-hidden="true"
                  style={{
                    background: `linear-gradient(90deg, rgba(${category.rgb},0.72) 0%, rgba(${category.rgb},0.24) 100%)`,
                  }}
                />

                <div className="border-b border-[rgba(var(--nec-purple-rgb),0.10)] px-6 py-7 md:px-10 md:py-9">
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em]"
                      style={{
                        background: `rgba(${category.rgb},0.12)`,
                        border: `1px solid rgba(${category.rgb},0.24)`,
                        color: category.colorVar,
                      }}
                    >
                      <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                      {category.label}
                    </span>
                    <time
                      dateTime={post.publishedAt}
                      className="text-sm font-medium text-[var(--nec-muted)]"
                    >
                      {formatDate(post.publishedAt)}
                    </time>
                  </div>

                  <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-[-0.045em] text-[var(--nec-text)] sm:text-5xl">
                    {post.title}
                  </h1>
                  <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--nec-muted)]">
                    {post.excerpt}
                  </p>
                </div>

                <div className="px-6 py-7 md:px-10 md:py-10">
                  <div
                    className="rounded-[1.6rem] border px-5 py-5 md:px-6"
                    style={{
                      borderColor: `rgba(${category.rgb},0.18)`,
                      background: `linear-gradient(145deg, rgba(${category.rgb},0.08), rgba(var(--nec-card-rgb),0.66))`,
                    }}
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--nec-muted)]">
                      Opening Note
                    </p>
                    <p className="mt-4 text-lg leading-9 text-[var(--nec-text)] md:text-[1.35rem]">
                      {ledeParagraph}
                    </p>
                  </div>

                  <div className="mt-8 space-y-5">
                    {bodyParagraphs.map((paragraph, index) => (
                      <p
                        key={`${post.slug}-${index}`}
                        className="max-w-3xl text-[1.02rem] leading-8 text-[var(--nec-text)]"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  <div className="mt-10 border-t border-[rgba(var(--nec-purple-rgb),0.10)] pt-6">
                    <p className="text-sm italic text-[var(--nec-muted)]">&mdash; Anonymous</p>
                  </div>
                </div>
              </article>

              <aside className="space-y-4 lg:sticky lg:top-28">
                <div className="nec-card p-6">
                  <p className="form-section-label">Reading Notes</p>
                  <div className="mt-5 space-y-4">
                    <div className="rounded-[1.35rem] border border-[rgba(var(--nec-purple-rgb),0.10)] bg-[rgba(var(--nec-card-rgb),0.68)] p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--nec-muted)]">
                        Published
                      </p>
                      <p className="mt-2 text-sm font-semibold text-[var(--nec-text)]">
                        {formatDate(post.publishedAt)}
                      </p>
                    </div>
                    <div className="rounded-[1.35rem] border border-[rgba(var(--nec-purple-rgb),0.10)] bg-[rgba(var(--nec-card-rgb),0.68)] p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--nec-muted)]">
                        Pace
                      </p>
                      <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-[var(--nec-text)]">
                        <Clock3 className="h-4 w-4 text-[var(--nec-cyan)]" aria-hidden="true" />
                        {getReadingTime(post.body)}
                      </p>
                    </div>
                    <div className="rounded-[1.35rem] border border-[rgba(var(--nec-purple-rgb),0.10)] bg-[rgba(var(--nec-card-rgb),0.68)] p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--nec-muted)]">
                        Journal
                      </p>
                      <p className="mt-2 text-sm font-semibold text-[var(--nec-text)]">
                        NECYBLOG Dispatch
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.6rem] border border-[rgba(var(--nec-gold-rgb),0.16)] bg-[linear-gradient(145deg,rgba(var(--nec-gold-rgb),0.08),rgba(var(--nec-card-rgb),0.76))] p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(var(--nec-gold-rgb),0.18)] bg-[rgba(var(--nec-gold-rgb),0.10)] text-[var(--nec-gold)]">
                      <Sparkles className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--nec-gold)]">
                        Why It Exists
                      </p>
                      <p className="mt-1 text-sm font-semibold text-[var(--nec-text)]">
                        Host writing is part archive, part invitation.
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-[var(--nec-muted)]">
                    These entries let the committee sound like actual people instead of schedule
                    copy. Keep reading if you want the emotional temperature behind the convention.
                  </p>
                </div>
              </aside>
            </div>

            <section className="mt-10" aria-label="More host writing">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--nec-muted)]">
                    Continue Reading
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[var(--nec-text)]">
                    More from the host journal
                  </h2>
                </div>
                <Link href="/blog" className="btn-ghost">
                  View All Dispatches
                </Link>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {adjacentPosts.map((entry) => {
                  const entryCategory = CATEGORY_STYLES[entry.category] ?? CATEGORY_STYLES.story

                  return (
                    <Link
                      key={entry.slug}
                      href={`/blog/${entry.slug}`}
                      className="group rounded-[1.6rem] border border-[rgba(var(--nec-purple-rgb),0.10)] bg-[rgba(var(--nec-card-rgb),0.72)] p-6 transition-[transform,border-color,background-color] duration-200 hover:-translate-y-0.5 hover:border-[rgba(var(--nec-purple-rgb),0.16)] hover:bg-[rgba(var(--nec-card-rgb),0.86)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nec-purple)]"
                    >
                      <p
                        className="text-[11px] font-semibold uppercase tracking-[0.18em]"
                        style={{ color: entryCategory.colorVar }}
                      >
                        {entryCategory.label}
                      </p>
                      <h3 className="mt-3 text-xl font-semibold tracking-[-0.02em] text-[var(--nec-text)]">
                        {entry.title}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-[var(--nec-muted)]">
                        {entry.excerpt}
                      </p>
                      <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--nec-text)]">
                        Read Dispatch
                        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
                      </span>
                    </Link>
                  )
                })}
              </div>
            </section>
          </div>
        </div>
      </div>

      <SiteFooter />
      <MobileCtaBar />
    </div>
  )
}
