"use client"

import { useState, useRef, useId, useCallback } from "react"
import { ChevronDown, BookOpen } from "lucide-react"
import type { BlogPost } from "@/lib/data/blog-posts"

const CATEGORY_STYLES: Record<
  string,
  { label: string; colorVar: string; rgb: string }
> = {
  story: { label: "Story", colorVar: "var(--nec-purple)", rgb: "124,58,237" },
  update: { label: "Update", colorVar: "var(--nec-cyan)", rgb: "20,184,166" },
  recap: { label: "Recap", colorVar: "var(--nec-gold)", rgb: "212,160,23" },
  announcement: {
    label: "Announcement",
    colorVar: "var(--nec-pink)",
    rgb: "192,38,211",
  },
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00")
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

interface BlogCardProps {
  post: BlogPost
  index: number
}

export default function BlogCard({ post, index }: BlogCardProps) {
  const [expanded, setExpanded] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const articleRef = useRef<HTMLElement>(null)
  const uniqueId = useId()
  const contentId = `blog-content-${uniqueId}`
  const cat = CATEGORY_STYLES[post.category] ?? CATEGORY_STYLES.story

  const paragraphs = post.body.split("\n\n").filter(Boolean)

  const handleToggle = useCallback(() => {
    setExpanded((prev) => {
      const willExpand = !prev
      if (willExpand) {
        requestAnimationFrame(() => {
          setTimeout(() => {
            articleRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "center",
            })
          }, 150)
        })
      }
      return willExpand
    })
  }, [])

  return (
    <article
      ref={articleRef}
      className="blog-card group relative nec-card overflow-hidden"
      style={{
        animationDelay: `${index * 80}ms`,
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

      <div className="p-6 sm:p-8">
        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
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
        <h3 className="text-xl sm:text-2xl font-black text-white mb-3 leading-tight">
          {post.title}
        </h3>

        {/* Excerpt — always visible */}
        <p
          className="text-sm sm:text-base leading-relaxed mb-5"
          style={{ color: "var(--nec-muted)" }}
        >
          {post.excerpt}
        </p>

        {/* Expandable body */}
        <div
          id={contentId}
          ref={contentRef}
          role="region"
          aria-label={`Full text of ${post.title}`}
          className="blog-card-body overflow-hidden"
          style={{
            display: "grid",
            gridTemplateRows: expanded ? "1fr" : "0fr",
          }}
        >
          <div className="min-h-0">
            <div
              className="pt-4 border-t space-y-4"
              style={{ borderColor: "var(--nec-border)" }}
            >
              {paragraphs.map((p, i) => (
                <p
                  key={i}
                  className="text-sm sm:text-base leading-relaxed"
                  style={{ color: "var(--nec-text)" }}
                >
                  {p}
                </p>
              ))}
              <p
                className="text-sm sm:text-base leading-relaxed italic mt-4"
                style={{ color: "var(--nec-muted)" }}
              >
                &mdash;Anonymous
              </p>
            </div>
          </div>
        </div>

        {/* Expand/Collapse toggle */}
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={contentId}
          onClick={handleToggle}
          className="blog-card-toggle mt-4 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide rounded-lg px-4 py-2 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{
            color: cat.colorVar,
            background: `rgba(${cat.rgb},0.08)`,
            border: `1px solid rgba(${cat.rgb},0.20)`,
          }}
        >
          {expanded ? "Read Less" : "Read More"}
          <ChevronDown
            className="w-4 h-4 blog-card-chevron"
            aria-hidden="true"
            style={{
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </button>
      </div>

      {/* Decorative corner glow */}
      <div
        className="absolute -bottom-12 -right-12 w-40 h-40 rounded-full pointer-events-none opacity-[0.06]"
        aria-hidden="true"
        style={{
          background: `radial-gradient(circle, rgba(${cat.rgb},1) 0%, transparent 70%)`,
          filter: "blur(30px)",
        }}
      />
    </article>
  )
}
