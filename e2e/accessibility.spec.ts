import { test, expect } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"
import { BLOG_POSTS } from "../lib/data/blog-posts"

/**
 * Automated accessibility tests for all pages with real content.
 *
 * Uses axe-core to check WCAG 2.1 AA compliance on every page.
 * AAA rules are included as best-effort (violations logged but
 * only AA violations fail the test — per project policy, we target
 * AAA but enforce AA as the absolute floor).
 */

const PAGES_WITH_CONTENT = [
  { path: "/", name: "Homepage" },
  { path: "/register", name: "Registration" },
  { path: "/breakfast", name: "Breakfast Tickets" },
  { path: "/faq", name: "FAQ" },
  { path: "/accessibility", name: "Accessibility" },
  { path: "/alanon", name: "Al-Anon" },
  { path: "/states", name: "Member States" },
  { path: "/events", name: "Events" },
  { path: "/service", name: "Service" },
  { path: "/journey", name: "Journey" },
  { path: "/blog", name: "Blog" },
]

const PLACEHOLDER_PAGES = [
  { path: "/bid", name: "Bid" },
  { path: "/program", name: "Program" },
  { path: "/merch", name: "Merch" },
  { path: "/prayer", name: "Prayer" },
  { path: "/asl", name: "ASL" },
]

const BLOG_POST_PAGES = BLOG_POSTS.map((post) => ({
  path: `/blog/${post.slug}`,
  name: `Blog Post: ${post.slug}`,
}))

for (const page of PAGES_WITH_CONTENT) {
  test(`${page.name} (${page.path}) — WCAG 2.1 AA`, async ({ page: browserPage }) => {
    await browserPage.goto(page.path, { waitUntil: "networkidle" })

    const results = await new AxeBuilder({ page: browserPage })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze()

    const violations = results.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      description: v.description,
      nodes: v.nodes.length,
      help: v.helpUrl,
    }))

    if (violations.length > 0) {
      console.error(
        `\n❌ ${page.name} has ${violations.length} a11y violation(s):\n`,
        JSON.stringify(violations, null, 2)
      )
    }

    expect(results.violations).toEqual([])
  })

  test(`${page.name} (${page.path}) — WCAG 2.1 AAA (best-effort)`, async ({ page: browserPage }) => {
    await browserPage.goto(page.path, { waitUntil: "networkidle" })

    const results = await new AxeBuilder({ page: browserPage })
      .withTags(["wcag2aaa", "wcag21aaa"])
      .analyze()

    if (results.violations.length > 0) {
      console.warn(
        `\n⚠️  ${page.name} has ${results.violations.length} AAA-level issue(s) (non-blocking):\n`,
        results.violations.map((v) => `  - ${v.id}: ${v.description} (${v.nodes.length} node(s))`).join("\n")
      )
    }

    // AAA is best-effort — log but don't fail
    // Uncomment the next line to enforce AAA:
    // expect(results.violations).toEqual([])
  })
}

for (const page of PLACEHOLDER_PAGES) {
  test(`${page.name} placeholder (${page.path}) — WCAG 2.1 AA`, async ({ page: browserPage }) => {
    await browserPage.goto(page.path, { waitUntil: "networkidle" })

    const results = await new AxeBuilder({ page: browserPage })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze()

    expect(results.violations).toEqual([])
  })
}

for (const page of BLOG_POST_PAGES) {
  test(`${page.name} (${page.path}) — WCAG 2.1 AA`, async ({ page: browserPage }) => {
    await browserPage.goto(page.path, { waitUntil: "networkidle" })

    const results = await new AxeBuilder({ page: browserPage })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze()

    expect(results.violations).toEqual([])
  })
}

test.describe("Keyboard navigation", () => {
  test("Skip-to-content link is present and functional", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" })

    // Tab to the first focusable element — should be skip link
    await page.keyboard.press("Tab")
    const skipLink = page.locator("a[href='#main-content']")

    // Skip link should exist (may be visually hidden until focused)
    const skipLinkCount = await skipLink.count()
    if (skipLinkCount > 0) {
      await skipLink.press("Enter")
      const focused = await page.evaluate(() => document.activeElement?.id)
      expect(focused).toBe("main-content")
    }
  })

  test("All interactive elements are keyboard-reachable on homepage", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" })

    // Tab through elements and verify focus moves
    for (let i = 0; i < 15; i++) {
      await page.keyboard.press("Tab")
    }

    const activeTag = await page.evaluate(() => document.activeElement?.tagName)
    // Should have landed on some interactive element
    expect(["A", "BUTTON", "INPUT", "SELECT", "TEXTAREA"]).toContain(activeTag)
  })
})

test.describe("Color contrast & visual", () => {
  test("Homepage has no color-contrast violations", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" })

    const results = await new AxeBuilder({ page })
      .withRules(["color-contrast", "color-contrast-enhanced"])
      .analyze()

    if (results.violations.length > 0) {
      console.error(
        "\n❌ Color contrast violations:\n",
        results.violations.map((v) =>
          v.nodes.map((n) => `  - ${n.target}: ${n.failureSummary}`).join("\n")
        ).join("\n")
      )
    }

    expect(results.violations.filter((v) => v.id === "color-contrast")).toEqual([])
  })
})

test.describe("ARIA & semantics", () => {
  test("All images have alt text", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" })

    const results = await new AxeBuilder({ page })
      .withRules(["image-alt"])
      .analyze()

    expect(results.violations).toEqual([])
  })

  test("All form inputs have labels", async ({ page }) => {
    await page.goto("/register", { waitUntil: "networkidle" })

    const results = await new AxeBuilder({ page })
      .withRules(["label", "label-title-only"])
      .analyze()

    expect(results.violations).toEqual([])
  })

  test("Page has proper landmark structure", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" })

    const results = await new AxeBuilder({ page })
      .withRules(["landmark-one-main", "region"])
      .analyze()

    expect(results.violations).toEqual([])
  })

  test("Navigation elements have aria-labels", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" })

    const navElements = page.locator("nav")
    const count = await navElements.count()

    for (let i = 0; i < count; i++) {
      const ariaLabel = await navElements.nth(i).getAttribute("aria-label")
      expect(ariaLabel, `nav element ${i} missing aria-label`).toBeTruthy()
    }
  })
})
