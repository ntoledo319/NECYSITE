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
      {/* Post count */}
      <div className="flex items-center gap-3 mb-8 max-w-5xl mx-auto">
        <Newspaper
          className="w-5 h-5 flex-shrink-0"
          style={{ color: "var(--nec-purple)" }}
          aria-hidden="true"
        />
        <p
          className="text-sm font-semibold uppercase tracking-widest"
          style={{ color: "var(--nec-muted)" }}
        >
          {sorted.length} {sorted.length === 1 ? "Dispatch" : "Dispatches"}
        </p>
        <div
          className="flex-1 h-[1px]"
          aria-hidden="true"
          style={{ background: "var(--nec-border)" }}
        />
      </div>

      {/* Cards grid — responsive masonry-style with CSS columns */}
      <motion.div
        className="blog-grid max-w-5xl mx-auto columns-1 md:columns-2 gap-6 space-y-6"
        variants={shouldReduce ? undefined : staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
      >
        {visible.map((post, i) => (
          <motion.div key={post.id} className="break-inside-avoid" variants={staggerChild}>
            <BlogCard post={post} index={i} />
          </motion.div>
        ))}
      </motion.div>

      {/* Load more */}
      {hasMore && (
        <div className="text-center mt-12">
          <button
            type="button"
            onClick={() => setVisibleCount((c) => c + 6)}
            className="btn-ghost"
          >
            Load More Writing
          </button>
        </div>
      )}

      {/* Empty state */}
      {sorted.length === 0 && (
        <div className="text-center py-20">
          <p
            className="text-lg font-semibold"
            style={{ color: "var(--nec-muted)" }}
          >
            No dispatches yet. The host committee is still finding the words.
          </p>
        </div>
      )}
    </section>
  )
}
