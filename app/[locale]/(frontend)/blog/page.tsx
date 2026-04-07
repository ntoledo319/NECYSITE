import type { Metadata } from "next"
import SiteFooter from "@/components/site-footer"
import MobileCtaBar from "@/components/mobile-cta-bar"
import BlogGrid from "@/components/blog-grid"
import PageArtAccents from "@/components/art/page-art-accents"
import { BLOG_POSTS } from "@/lib/data/blog-posts"

export const metadata: Metadata = {
  title: "NECYBLOG aka BLOGYPAA — NECYPAA XXXVI",
  description:
    "Experience, strength, and hope from the NECYPAA XXXVI CT Host Committee. Anonymous stories from the road to Hartford.",
}

function formatDate(dateStr: string): string {
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export default function BlogPage() {
  const sortedPosts = [...BLOG_POSTS].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
  const latestPost = sortedPosts[0]
  const storyCount = sortedPosts.filter((post) => post.category === "story").length

  return (
    <div className="relative flex min-h-screen min-h-screen-safe flex-col" style={{ backgroundColor: "var(--nec-navy)" }}>
      <PageArtAccents character="caterpillar" accentColor="var(--nec-gold)" dividerVariant="compass" />

      <div className="relative z-10 flex-1 pb-20 pt-24 md:pb-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl space-y-12">
            <header className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-end">
              <div className="max-w-3xl">
                <span className="section-badge inline-flex">Host Journal</span>
                <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-[var(--nec-text)] sm:text-5xl md:text-6xl">
                  NECYBLOG, aka BLOGYPAA.
                </h1>
                <p className="mt-4 text-lg leading-8 text-[var(--nec-muted)]">
                  A rough-edged, anonymous running record of what the road to Hartford is doing to the people building it.
                  Not polished testimonials. Not committee minutes. The live wire in between.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                <div className="rounded-[1.5rem] border border-[rgba(var(--nec-purple-rgb),0.10)] bg-[rgba(var(--nec-card-rgb),0.82)] px-4 py-4 shadow-[0_16px_34px_rgba(44,24,16,0.06)]">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--nec-muted)]">Latest Dispatch</p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-[var(--nec-text)]">
                    {latestPost ? formatDate(latestPost.publishedAt) : "Coming soon"}
                  </p>
                </div>
                <div className="rounded-[1.5rem] border border-[rgba(var(--nec-pink-rgb),0.10)] bg-[rgba(var(--nec-card-rgb),0.82)] px-4 py-4 shadow-[0_16px_34px_rgba(44,24,16,0.06)]">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--nec-muted)]">Voices So Far</p>
                  <p className="mt-2 text-2xl font-semibold text-[var(--nec-text)]">{sortedPosts.length}</p>
                </div>
                <div className="rounded-[1.5rem] border border-[rgba(var(--nec-gold-rgb),0.10)] bg-[rgba(var(--nec-card-rgb),0.82)] px-4 py-4 shadow-[0_16px_34px_rgba(44,24,16,0.06)]">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--nec-muted)]">Story-First</p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-[var(--nec-text)]">
                    {storyCount} personal entries and counting
                  </p>
                </div>
              </div>
            </header>

            <section className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
              <article className="rounded-[1.85rem] border border-[rgba(var(--nec-purple-rgb),0.12)] bg-[linear-gradient(135deg,rgba(var(--nec-card-rgb),0.9),rgba(var(--nec-purple-rgb),0.04))] px-6 py-6 shadow-[0_22px_50px_rgba(44,24,16,0.08)] md:px-7">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--nec-purple)]">
                  Editorial Position
                </p>
                <div className="mt-4 space-y-4 text-base leading-7 text-[var(--nec-muted)]">
                  <p>
                    It is our hope for this to be a place where everyone involved in the creation of this
                    convention gets a few chances to anonymously share their experience, strength, and hope
                    as it relates to the work of host.
                  </p>
                  <p>
                    We scrub accidental tradition violations, but otherwise the point is honesty. Service
                    can be beautiful, exhausting, absurd, tender, irritating, and life-changing in the same week.
                    This page should make room for all of that.
                  </p>
                </div>
              </article>

              <aside className="rounded-[1.85rem] border border-[rgba(var(--nec-gold-rgb),0.12)] bg-[rgba(var(--nec-card-rgb),0.84)] px-6 py-6 shadow-[0_22px_50px_rgba(44,24,16,0.08)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--nec-gold)]">
                  House Rules
                </p>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--nec-muted)]">
                  <li>Anonymous first. The writing should feel honest without violating anyone else’s safety.</li>
                  <li>Specific over inspirational. If a post sounds like it could belong on any recovery site, it missed.</li>
                  <li>Committee voice, not brand voice. This page exists to sound like real people in service.</li>
                </ul>
                <p className="mt-4 text-sm font-semibold text-[var(--nec-text)] italic">
                  Take what works, vibe with the rest.
                </p>
              </aside>
            </section>

            <BlogGrid />
          </div>
        </div>
      </div>

      <SiteFooter />
      <MobileCtaBar />
    </div>
  )
}
