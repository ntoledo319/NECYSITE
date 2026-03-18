import type { Metadata } from "next"
import PageShell from "@/components/page-shell"

export const metadata: Metadata = {
  title: "Blog Post — NECYPAA XXXVI",
}

export default function BlogPostPage() {
  return (
    <PageShell
      badge="NECYBLOG"
      title="Post Not Found"
      subtitle="This blog post doesn't exist yet. Check back soon."
    />
  )
}
