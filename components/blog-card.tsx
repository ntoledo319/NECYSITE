"use client"

import { useState, useRef, useId, useCallback } from "react"
import { ChevronDown, BookOpen, Clock } from "lucide-react"
import type { BlogPost } from "@/lib/data/blog-posts"
import { getReadingTime } from "@/lib/reading-time"

const CATEGORY_STYLES: Record<string, { label: string; colorVar: string; rgb: string }> = {
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

function isRecentPost(dateStr: string, daysThreshold = 14): boolean {
  const published = new Date(dateStr + "T12:00:00")
  const now = new Date()
  const diffMs = now.getTime() - published.getTime()
  return diffMs >= 0 && diffMs < daysThreshold * 24 * 60 * 60 * 1000
}

function formatRelativeDate(dateStr: string): string | null {
  const published = new Date(dateStr + "T12:00:00")
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - published.getTime()) / (24 * 60 * 60 * 1000))
  if (diffDays < 0 || diffDays >= 7) return null
  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Yesterday"
  return `${diffDays} days ago`
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

  const cardShift = index % 3 === 0 ? "rotate-[-0.8deg]" : index % 3 === 1 ? "rotate-[0.55deg]" : "rotate-[-0.25deg]"

  return (
    <article
      ref={articleRef}
      className={`group relative overflow-hidden border bg-[rgba(var(--nec-card-rgb),0.92)] shadow-[0_22px_44px_rgba(44,24,16,0.08)] transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-[rgba(var(--nec-purple-rgb),0.18)] hover:shadow-[0_26px_54px_rgba(44,24,16,0.12)] ${cardShift}`}
      style={{
        borderRadius: index % 2 === 0 ? "1.6rem" : "1.25rem",
        borderColor: `rgba(${cat.rgb},0.16)`,
        background:
          index % 2 === 0
            ? `linear-gradient(145deg, rgba(${cat.rgb},0.06), rgba(var(--nec-card-rgb),0.94) 38%, rgba(var(--nec-card-rgb),0.88) 100%)`
            : `linear-gradient(145deg, rgba(var(--nec-card-rgb),0.95), rgba(${cat.rgb},0.04) 100%)`,
      }}
    >
      <div
        className="absolute left-0 top-0 h-full w-1.5"
        aria-hidden="true"
        style={{
          background: `linear-gradient(180deg, rgba(${cat.rgb},0.72) 0%, rgba(${cat.rgb},0.18) 100%)`,
        }}
      />

      <div
        className="absolute right-5 top-5 h-10 w-10 rounded-full opacity-[0.16] blur-xl"
        aria-hidden="true"
        style={{ background: `rgba(${cat.rgb},0.55)` }}
      />

      <div className="relative p-6 sm:p-7">
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em]"
            style={{
              background: `rgba(${cat.rgb},0.12)`,
              border: `1px solid rgba(${cat.rgb},0.24)`,
              color: cat.colorVar,
            }}
          >
            <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
            {cat.label}
          </span>
          <time
            dateTime={post.publishedAt}
            className="text-xs font-medium"
            style={{ color: "var(--nec-muted)" }}
            title={formatDate(post.publishedAt)}
          >
            {formatRelativeDate(post.publishedAt) ?? formatDate(post.publishedAt)}
          </time>
          <span
            className="inline-flex items-center gap-1 text-xs font-medium"
            style={{ color: "var(--nec-muted)" }}
            aria-label={getReadingTime(post.body)}
          >
            <Clock className="h-3 w-3" aria-hidden="true" />
            {getReadingTime(post.body)}
          </span>
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

        <h3 className="mb-3 text-xl font-semibold leading-tight tracking-[-0.03em] text-[var(--nec-text)] sm:text-[1.7rem]">
          {post.title}
        </h3>

        <p className="mb-5 text-sm leading-7 sm:text-base" style={{ color: "var(--nec-muted)" }}>
          {post.excerpt}
        </p>

        <div
          id={contentId}
          ref={contentRef}
          role="region"
          aria-label={`Full text of ${post.title}`}
          className="overflow-hidden"
          style={{
            display: "grid",
            gridTemplateRows: expanded ? "1fr" : "0fr",
          }}
        >
          <div className="min-h-0">
            <div className="space-y-4 border-t pt-5" style={{ borderColor: "rgba(var(--nec-purple-rgb),0.10)" }}>
              {paragraphs.map((paragraph, paragraphIndex) => (
                <p key={paragraphIndex} className="text-sm leading-7 sm:text-base" style={{ color: "var(--nec-text)" }}>
                  {paragraph}
                </p>
              ))}
              <p className="pt-1 text-sm italic leading-relaxed sm:text-base" style={{ color: "var(--nec-muted)" }}>
                &mdash;Anonymous
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={contentId}
          onClick={handleToggle}
          className="mt-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold uppercase tracking-wide transition-[background-color,border-color,transform] duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{
            color: cat.colorVar,
            background: `rgba(${cat.rgb},0.08)`,
            border: `1px solid rgba(${cat.rgb},0.20)`,
            outlineColor: cat.colorVar,
          }}
        >
          {expanded ? "Read Less" : "Read More"}
          <ChevronDown
            className="h-4 w-4 transition-transform duration-200"
            aria-hidden="true"
            style={{
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </button>
      </div>
    </article>
  )
}
