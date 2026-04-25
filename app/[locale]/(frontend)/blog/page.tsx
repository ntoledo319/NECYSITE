import type { Metadata } from "next"
import SiteFooter from "@/components/site-footer"
import MobileCtaBar from "@/components/mobile-cta-bar"
import BlogGrid from "@/components/blog-grid"
import PageArtAccents from "@/components/art/page-art-accents"
import MotionHeader from "@/components/ui/motion-header"
import { getBlogPosts } from "@/lib/data/fetch-utils"

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

export default async function BlogPage() {
  const allPosts = await getBlogPosts()
  const latestPosts = [...allPosts]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 3)

  return (
    <div
      className="min-h-screen-safe relative flex min-h-screen flex-col overflow-hidden"
      style={{ backgroundColor: "var(--nec-navy)" }}
    >
      <PageArtAccents character="caterpillar" accentColor="var(--nec-gold)" dividerVariant="compass" />

      <div className="page-frame">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 lg:grid-cols-[0.94fr_1.06fr] lg:items-start">
              <MotionHeader className="max-w-3xl">
                <span className="section-badge page-enter-1 mb-4 inline-block">NECYBLOG</span>
                <h1 className="section-heading page-enter-2 mb-2">
                  NECYBLOG{" "}
                  <span className="mt-1 block text-lg font-bold text-[var(--nec-pink)] sm:text-xl">aka BLOGYPAA</span>
                </h1>

                <div
                  className="my-6 h-[2px] w-24 rounded-full"
                  aria-hidden="true"
                  style={{
                    background: "linear-gradient(90deg, var(--nec-purple), var(--nec-pink), var(--nec-gold))",
                    boxShadow: "0 0 12px rgba(var(--nec-purple-rgb),0.15), 0 0 24px rgba(var(--nec-pink-rgb),0.08)",
                  }}
                />

                <div className="page-enter-3 space-y-4 text-base leading-relaxed text-[var(--nec-muted)] sm:text-lg">
                  <p>
                    Experience, strength, and hope from everyone on host committee — anonymous, unfiltered, so help us
                    HP.
                  </p>
                  <p className="font-semibold italic text-[var(--nec-text)]">Take what works, vibe with the rest.</p>
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
                      <p className="text-xs font-medium text-[var(--nec-muted)]">{formatDate(post.publishedAt)}</p>
                      <h2 className="mt-3 text-lg font-semibold leading-tight tracking-[-0.02em] text-[var(--nec-text)]">
                        {post.title}
                      </h2>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="section-atmosphere-gold mt-16">
              <BlogGrid posts={allPosts} />
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
      <MobileCtaBar />
    </div>
  )
}
