"use client"

import { useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { BLOG_POSTS } from "@/lib/data/blog-posts"
import BlogCard from "@/components/blog-card"
import { Newspaper } from "lucide-react"
import { staggerContainer, staggerChild } from "@/components/ui/motion-primitives"

export default function BlogGrid() {
  const [visibleCount, setVisibleCount] = useState(6)
  const sorted = [...BLOG_POSTS].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
  const visible = sorted.slice(0, visibleCount)
  const hasMore = visibleCount < sorted.length
  const shouldReduce = useReducedMotion()

  return (
    <section aria-label="Blog posts">
      <div className="mx-auto mb-8 flex max-w-6xl items-center gap-3">
        <Newspaper
          className="w-5 h-5 flex-shrink-0"
          style={{ color: "var(--nec-purple)" }}
          aria-hidden="true"
        />
        <p
          className="text-sm font-semibold uppercase tracking-widest"
          style={{ color: "var(--nec-muted)" }}
        >
          {sorted.length} {sorted.length === 1 ? "Post" : "Posts"}
        </p>
        <div
          className="flex-1 h-[1px]"
          aria-hidden="true"
          style={{ background: "linear-gradient(90deg, var(--nec-border), transparent)" }}
        />
      </div>

      <motion.div
        className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
        variants={shouldReduce ? undefined : staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
      >
        {visible.map((post, index) => (
          <motion.div
            key={post.id}
            variants={staggerChild}
            className={index === 0 ? "md:col-span-2 xl:col-span-2" : ""}
          >
            <BlogCard post={post} index={index} />
          </motion.div>
        ))}
      </motion.div>

      {hasMore && (
        <div className="text-center mt-12">
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + 6)}
            className="btn-ghost"
          >
            Load More Posts
          </button>
        </div>
      )}

      {sorted.length === 0 && (
        <div className="text-center py-20">
          <p
            className="text-lg font-semibold"
            style={{ color: "var(--nec-muted)" }}
          >
            No posts yet — check back soon.
          </p>
        </div>
      )}
    </section>
  )
}
