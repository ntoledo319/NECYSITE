import type { Metadata } from "next"
import SiteFooter from "@/components/site-footer"
import MobileCtaBar from "@/components/mobile-cta-bar"
import BlogGrid from "@/components/blog-grid"
import PageArtAccents from "@/components/art/page-art-accents"
import MotionHeader from "@/components/ui/motion-header"
import { BLOG_POSTS } from "@/lib/data/blog-posts"

export const metadata: Metadata = {
  title: "NECYBLOG aka BLOGYPAA — NECYPAA XXXVI",
  description:
    "Experience, strength, and hope from the NECYPAA XXXVI CT Host Committee. Anonymous stories from the road to Hartford.",
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00")
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export default function BlogPage() {
  const latestPosts = [...BLOG_POSTS]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 3)

  return (
    <div
      className="min-h-screen min-h-screen-safe flex flex-col relative overflow-hidden"
      style={{ backgroundColor: "var(--nec-navy)" }}
    >
      <PageArtAccents character="caterpillar" accentColor="var(--nec-gold)" dividerVariant="compass" />

      <div className="page-frame">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid gap-8 lg:grid-cols-[0.94fr_1.06fr] lg:items-start">
              <MotionHeader className="max-w-3xl">
                <span className="section-badge mb-4 inline-block">NECYBLOG</span>
                <h1 className="section-heading mb-2">
                  NECYBLOG{" "}
                  <span className="block text-lg sm:text-xl font-bold mt-1 text-[var(--nec-pink)]">
                    aka BLOGYPAA
                  </span>
                </h1>

                <div
                  className="my-6 h-[2px] w-24 rounded-full"
                  aria-hidden="true"
                  style={{
                    background:
                      "linear-gradient(90deg, var(--nec-purple), var(--nec-pink), var(--nec-gold))",
                    boxShadow:
                      "0 0 12px rgba(var(--nec-purple-rgb),0.15), 0 0 24px rgba(var(--nec-pink-rgb),0.08)",
                  }}
                />

                <div className="space-y-4 text-base sm:text-lg leading-relaxed text-[var(--nec-muted)]">
                  <p>
                    It is our hope for this to be a place where everyone involved in
                    the creation of this convention gets a few opportunities to
                    anonymously share their experience, strength, and hope as it
                    relates to happenings with this service structure.
                  </p>
                  <p
                    className="font-semibold text-[var(--nec-text)] italic"
                  >
                    Take what works, vibe with the rest.
                  </p>
                  <p>
                    We do take the liberty of scrubbing any accidental tradition
                    violations from the content.
                  </p>
                  <p>
                    Aside from that, here you&apos;ll get everyone on
                    host&apos;s raw, unfiltered takes, so help us HP.
                  </p>
                </div>
              </MotionHeader>

              <div className="relative overflow-hidden rounded-[2rem] border border-[rgba(var(--nec-gold-rgb),0.14)] bg-[linear-gradient(145deg,rgba(var(--nec-gold-rgb),0.07),rgba(var(--nec-card-rgb),0.92))] p-5 shadow-[0_22px_54px_rgba(44,24,16,0.08)]">
                <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                  <div className="absolute left-6 top-6 h-16 w-16 rounded-full border border-[rgba(var(--nec-gold-rgb),0.14)]" />
                  <div className="absolute right-8 top-10 h-10 w-20 rounded-[1rem] border border-[rgba(var(--nec-pink-rgb),0.14)]" />
                </div>

                <div className="relative grid gap-4">
                  {latestPosts.map((post, index) => (
                    <div
                      key={post.id}
                      className={`rounded-[1.2rem] border bg-[rgba(var(--nec-card-rgb),0.88)] px-5 py-5 shadow-[0_14px_28px_rgba(44,24,16,0.06)] ${
                        index === 1 ? "sm:translate-x-6" : index === 2 ? "sm:-translate-x-2" : ""
                      }`}
                      style={{
                        borderColor:
                          index === 0
                            ? "rgba(var(--nec-purple-rgb),0.14)"
                            : index === 1
                              ? "rgba(var(--nec-pink-rgb),0.14)"
                              : "rgba(var(--nec-gold-rgb),0.14)",
                      }}
                    >
                      <p className="text-xs font-medium text-[var(--nec-muted)]">
                        {formatDate(post.publishedAt)}
                      </p>
                      <h2 className="mt-3 text-lg font-semibold tracking-[-0.02em] text-[var(--nec-text)] leading-tight">
                        {post.title}
                      </h2>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-16">
              <BlogGrid />
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
      <MobileCtaBar />
    </div>
  )
}
