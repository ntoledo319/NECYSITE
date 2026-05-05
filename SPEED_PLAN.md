# NECYPAA XXXVI — Zero-Compromise Speed Plan

**Date:** May 5, 2026
**Author:** Cascade (for Nikki)
**Status:** Diagnostic complete. Ready to execute.
**Goal:** Bullet-fast. No visual, accessibility, or content sacrifices.

---

## TL;DR — Why the site still feels laggy

Despite the March 2026 optimization pass, the site is still slow because:

1. **~85 MB of dead images** are being shipped to production (unused PNGs + `.original` backups).
2. **framer-motion (126 KB gzipped)** is loaded on every page for trivial header/footer/CTA animations.
3. **globals.css is 2,427 lines (115.8 KB)** — 2–3× larger than it needs to be, loaded render-blocking on every page.
4. **57 of our components are marked `"use client"`**, several without needing to be. Interactive data files like `ypaa-meetings.ts` (52 KB) get shipped to the browser when the page is a client component.
5. **Hydration flash (FOUC)** — color-mode + font-size are applied *after* React mounts, causing a visible recalc + layout shift on every page load.
6. **`ScrollProgress` and `BackToTop` use React state on every scroll tick** — causing React re-renders ~60 times/second while scrolling.
7. **`web-vitals` is installed but never actually wired up** — pure dead dependency.
8. **Google Analytics fires two `gtag('config')` calls back-to-back** — wasted work + double page_view beacons.
9. **CSP declares `fonts.googleapis.com`/`fonts.gstatic.com`** but we self-host via `next/font` — unnecessary CSP surface + no benefit.
10. **Payload CMS chunks (`51a7870e` 757 KB, `7440` 687 KB)** end up in the homepage's client reference manifest. They aren't actually executed on the frontend, but they inflate the build artifact and prefetch manifest.

**Projected impact if all phases land:** ~85 % smaller deploy artifact, ~55–65 % smaller initial JS, ~70 % smaller CSS, no hydration flash, p95 LCP < 1.8 s on 4G mobile, TTI < 2.5 s, INP < 150 ms. Zero visual regressions.

---

## Table of Contents

- [Phase 0 — Instrumentation (do first, 1 hour)](#phase-0--instrumentation)
- [Phase 1 — Delete dead weight (1 hour, massive wins)](#phase-1--delete-dead-weight)
- [Phase 2 — Kill framer-motion on high-traffic pages (3 hours)](#phase-2--kill-framer-motion-on-high-traffic-pages)
- [Phase 3 — Fix hydration + scroll hot paths (2 hours)](#phase-3--fix-hydration--scroll-hot-paths)
- [Phase 4 — Server-component conversion (2 hours)](#phase-4--server-component-conversion)
- [Phase 5 — CSS diet (3 hours)](#phase-5--css-diet)
- [Phase 6 — Image pipeline finalize (1 hour)](#phase-6--image-pipeline-finalize)
- [Phase 7 — Third-party + network tuning (1 hour)](#phase-7--third-party--network-tuning)
- [Phase 8 — Next.js / runtime polish (1 hour)](#phase-8--nextjs--runtime-polish)
- [Phase 9 — Caching + offline + PPR (2 hours)](#phase-9--caching--offline--ppr)
- [Phase 10 — Validation + regression guard (1 hour)](#phase-10--validation--regression-guard)
- [Appendix A — File-by-file action list](#appendix-a--file-by-file-action-list)
- [Appendix B — Measurement commands](#appendix-b--measurement-commands)

---

## Phase 0 — Instrumentation

**Goal:** Get real numbers before we change anything, so every phase can be measured.

### 0.1 Fix the `web-vitals` reporter that was never wired up

- `@/lib/web-vitals.ts` exists and exports `reportWebVitals()` but **nothing imports it.**
- The March report claimed it's integrated in the layout — it isn't.
- Wire it into `@/app/[locale]/(frontend)/layout.tsx` via a dedicated `<WebVitalsReporter />` client component with `useReportWebVitals` from `next/web-vitals` (Next.js 15 built-in) so it works in both dev and prod.

### 0.2 Add a bundle analyzer script

- Install `@next/bundle-analyzer` as a dev dep.
- Add an `analyze` script: `ANALYZE=true next build`.
- Run before and after each phase; commit the HTML reports to `docs/perf/` for the record.

### 0.3 Capture baseline Lighthouse

- Run `npx unlighthouse --site https://www.necypaact.com --throttle-method simulate` on mobile + desktop.
- Record baseline: LCP, CLS, INP, TBT, TTI, total transfer size, JS transfer size, CSS transfer size.
- Paste into `docs/perf/baseline.md`.

**Deliverable:** `docs/perf/baseline.md` + a `pnpm analyze` script.

---

## Phase 1 — Delete dead weight

**Goal:** 85 MB → 5 MB public assets. Single biggest win per minute of work.

### 1.1 Purge unreferenced PNGs (60 MB)

These files exist in `public/images/` or `public/` and are referenced **nowhere** in the source:

- `public/images/ct-state-art.png` — **21 MB**
- `public/images/necypaa-logo.png` — **13 MB**
- `public/images/hartford-ct-text.png` — **11 MB**
- `public/images/prereg-cta-text.png` — **8.8 MB**
- `public/images/necypaa-logo-transparent.png` — **2.2 MB**
- `public/images/event-dates.png` — **2.0 MB**
- `public/flyer.png` — **1.8 MB** (duplicate of `public/images/flyer.webp`)

**Verification command:**

```bash
# Confirm zero refs before delete:
for f in ct-state-art necypaa-logo hartford-ct-text prereg-cta-text necypaa-logo-transparent event-dates; do
  echo "=== $f ==="
  grep -r "$f" app components lib i18n messages 2>/dev/null | grep -v "PERFORMANCE_REPORT\|SPEED_PLAN" || echo "unused"
done
```

### 1.2 Purge `.original` backup files (25 MB)

Thirty-three `*.original` files in `public/images/` (from March's WebP conversion). Git history is the backup. They should never ship.

**Action:**

```bash
find public -name "*.original" -delete
```

Then add to `.gitignore`:

```
# Never commit PNG/JPEG backups created by image optimization scripts
public/**/*.original
```

### 1.3 Drop unused dependencies

- `web-vitals` — package is installed, `@/lib/web-vitals.ts` is never imported. Replace with built-in `next/web-vitals` (see Phase 0.1); remove the `web-vitals` dependency.
- Audit `lucide-react` imports: we use named icons but import from `lucide-react` root. With `experimental.optimizePackageImports` already on this is fine, but verify no `import * from "lucide-react"` exists. (None found in scan — confirmed clean.)

### 1.4 Remove the unused `critical.css`

- `@/app/[locale]/(frontend)/critical.css` (147 lines) was created during Phase 2 of the March pass. It is **never imported**, does not help, and confuses future contributors.
- Either wire it up as a render-blocking `<link rel="stylesheet" href=".../critical.css">` in `<head>` before globals.css loads async, **or delete it** and accept that globals.css needs to go on a diet instead. This plan does the diet (Phase 5), so **delete critical.css**.

**Projected gain:** Deploy artifact shrinks ~85 MB → ~5 MB public. Faster `vercel deploy`. Faster edge cache warming. Cleaner `.next/cache`.

---

## Phase 2 — Kill framer-motion on high-traffic pages

**Goal:** Remove framer-motion (126 KB gzipped JS) from the layout + home page. Keep it only for the 2–3 pages that genuinely need complex spring physics.

### 2.1 Audit every `import ... from "framer-motion"`

19 files import framer-motion. Categorize each:

| File | Usage | Replacement |
|---|---|---|
| `components/site-header.tsx` | Fade-in + mobile drawer slide | **CSS keyframes** + `transition: transform` |
| `components/site-footer.tsx` | Footer bar `scaleX` on enter | **CSS `@keyframes scaleX`** with `animation-fill-mode: both` |
| `components/mobile-cta-bar.tsx` | Slide up/down based on overflow | **CSS transform** via data-attribute toggle |
| `components/ui/motion-header.tsx` | Simple fade+y entrance | **CSS `.page-enter-1`** (already exists in globals.css) |
| `components/sections/events-preview-section.tsx` | stagger children entrance | **IntersectionObserver + CSS** (use existing `ScrollReveal`) |
| `components/sections/meetings-section.tsx` | stagger children entrance | Same |
| `components/blog-grid.tsx` | stagger children entrance | Same |
| `components/character-divider.tsx` | Floating element | **CSS `@keyframes float`** |
| `components/ui/motion-primitives.tsx` | `SpotlightCard`, `TiltCard`, `FloatingElement`, `MagneticButton` | Keep `SpotlightCard` (CSS radial gradient follow). Rewrite others in vanilla JS + CSS, OR lazy-load only where used |
| `components/sections/business-meeting-section.tsx` | Uses `SpotlightCard`, `MagneticButton` | Same as above |
| `components/sections/purpose-section.tsx` | Uses `SpotlightCard` | Keep (CSS-only version) |
| `components/sections/hero-section.tsx` | Doesn't use framer-motion (raw scroll listener). **But imports `MagneticButton`.** | Replace `MagneticButton` with CSS transform on hover |
| `app/[locale]/(frontend)/states/page.tsx` | Entry animations | Convert to CSS stagger |
| `components/page-shell.tsx` | Page entrance | Use `.page-enter-*` classes |

### 2.2 Rewrite `motion-primitives.tsx` as zero-dep primitives

Keep the API identical but drop framer-motion:

- **`SpotlightCard`** → pure CSS-var-driven mouse-tracking (already almost pure CSS).
- **`MagneticButton`** → `useRef` + `requestAnimationFrame` + CSS `transform: translate3d()`.
- **`FloatingElement`** → CSS `@keyframes float`, param via CSS custom props.
- **`TiltCard`** → Drop. Replace call sites with `SpotlightCard` or a lightweight hover-transform wrapper.
- **`staggerContainer` / `staggerChild`** → Delete. Consumers move to `ScrollReveal` + CSS `transition-delay` classes (`.sr-delay-1`, `.sr-delay-2`, `.sr-delay-3` already exist).

### 2.3 Convert `site-header.tsx` to CSS-driven

- Scroll-shadow: currently animates `borderBottomColor` + `boxShadow` via `motion.header`. Convert to a `data-scrolled="true"` attribute with CSS transitions. Keep the existing `requestAnimationFrame`-throttled scroll listener.
- Mobile drawer: replace `<motion.nav>` + `AnimatePresence` with a CSS `transform: translateY(-8px)` / `opacity: 0` toggle. Use `hidden` attribute + CSS `display` logic or `:has()` on body `[data-menu-open="true"]`.
- Dropdown: replace `<motion.div>` with CSS `opacity` + `transform` on `aria-expanded="true"` parent. Radix's own accordion already handles this pattern.

### 2.4 Keep framer-motion only where it pays rent

After phase 2.3, framer-motion should only be imported in:

- `components/calendar/calendar-client.tsx` (if complex drag is needed) — audit first; if not, remove.
- `components/games/*` — these are games; they're fine.

Then mark framer-motion as a **dynamic import** in those specific files so it never loads on the first paint of any page.

### 2.5 Add an ESLint rule to prevent regression

Add to `eslint.config.mjs`:

```js
{
  files: ["components/site-header.tsx", "components/site-footer.tsx", "components/sections/**", "components/ui/motion-primitives.tsx", "app/**/layout.tsx"],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        paths: [{
          name: "framer-motion",
          message: "framer-motion is banned on critical-path files. Use CSS transitions or ScrollReveal."
        }]
      }
    ]
  }
}
```

**Projected gain:** Homepage JS drops from ~583 KB → ~340 KB (first load). LCP improves 400–800 ms on slow mobile. INP drops below 100 ms on dropdown opens.

---

## Phase 3 — Fix hydration + scroll hot paths

**Goal:** No FOUC. No scroll jank. No layout thrash.

### 3.1 Inline color-mode + font-size before paint

Currently `@/lib/accessibility-context.tsx` sets `data-color-mode` and `fontSize` in a `useEffect` — this runs **after** React hydrates, causing a flash of the wrong theme and a layout shift when font-size differs from 100%.

**Fix:** Add an inline `<script>` to `<head>` in `@/app/[locale]/(frontend)/layout.tsx` that reads `localStorage` synchronously before the body renders:

```html
<script dangerouslySetInnerHTML={{ __html: `
  (function(){
    try {
      var s = JSON.parse(localStorage.getItem('necypaa-a11y-settings') || '{}');
      var root = document.documentElement;
      var mode = s.colorMode || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
      root.setAttribute('data-color-mode', mode);
      root.style.colorScheme = mode;
      if (s.fontSize && s.fontSize !== 1) root.style.fontSize = (s.fontSize * 100) + '%';
      if (s.highContrast) root.classList.add('a11y-high-contrast');
      if (s.dyslexiaFont) root.classList.add('a11y-dyslexia-font');
      if (s.reduceMotion || matchMedia('(prefers-reduced-motion: reduce)').matches) root.classList.add('a11y-reduce-motion');
      if (s.grayscale) root.classList.add('a11y-grayscale');
    } catch(e){}
  })();
`}} />
```

Kill the equivalent `useEffect` code path in `A11yProvider` so it only *saves* settings, never *applies* them on mount.

### 3.2 Replace `ScrollProgress` React-state pattern

`components/ui/scroll-progress.tsx` calls `setProgress()` on every scroll tick → re-renders on every frame → re-runs all child reconciliation.

**Fix:** Skip React state entirely. Imperatively set `style.transform` on a ref:

```tsx
"use client"
import { useEffect, useRef } from "react"

export default function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let raf = 0
    const tick = () => {
      const doc = document.documentElement
      const h = doc.scrollHeight - doc.clientHeight
      const p = h > 0 ? doc.scrollTop / h : 0
      if (ref.current) ref.current.style.transform = `scaleX(${p})`
      raf = 0
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(tick) }
    window.addEventListener("scroll", onScroll, { passive: true })
    tick()
    return () => { window.removeEventListener("scroll", onScroll); if (raf) cancelAnimationFrame(raf) }
  }, [])
  return <div ref={ref} className="scroll-progress-bar fixed ..." aria-hidden="true" />
}
```

Apply the same pattern to `components/ui/back-to-top.tsx` (use `classList.toggle('back-to-top-visible')` on a ref instead of `setVisible`).

### 3.3 Drop `MutationObserver` on `document.body.style` in `MobileCtaBar`

`components/mobile-cta-bar.tsx` observes every style mutation on `<body>` to decide when to hide. This runs on every a11y setting change, every modal open, etc.

**Fix:** Expose a cheap signal. Add a CSS class `body[data-locked="true"]` controlled by the same code that sets `overflow: hidden` (site-header for drawer, flyer-with-modal, accessibility-panel). Mobile CTA bar simply reads `body[data-locked="true"]` via CSS selector:

```css
body[data-locked="true"] .sticky-cta-bar { transform: translateY(100%); }
```

Zero JS, zero observers.

### 3.4 Replace `PageTransition` with the browser View Transitions API

`components/ui/page-transition.tsx` imperatively fades every page route change. With Next.js 15 + React 19, we can use the native View Transitions API. Same visual, near-zero cost, skippable on `prefers-reduced-motion` automatically:

```tsx
// in layout.tsx — replace PageTransition wrapper with:
<style>{`
  ::view-transition-old(root),
  ::view-transition-new(root) { animation-duration: 0.25s; }
  @media (prefers-reduced-motion: reduce) {
    ::view-transition-old(root),
    ::view-transition-new(root) { animation: none; }
  }
`}</style>
```

Opt in via `unstable_ViewTransition` or manual `startViewTransition()` wrapping router transitions. If not feasible with current `next-intl` navigation, **keep the current `PageTransition` but promote it to a server component wrapper** and remove the React re-render (imperative-only) path already in place. (Current impl is imperative — it's fine; just make sure it's not causing extra commits. No code change needed beyond verification.)

### 3.5 Pre-compute layout-affecting values at SSR

- `min-height: 100dvh` in `HeroSection` is already correct (good).
- Eliminate `useEffect(() => { if (window.innerWidth < 768) setViewMode("list") }, [])` in `/states/page.tsx` — this causes a post-hydration state flip. Read the viewport via a CSS media query + render both views conditionally with CSS `display: none`, or do a user-agent sniff at the server. (CSS approach preferred.)

**Projected gain:** CLS drops from ~0.08 → < 0.02. INP drops 30–50 ms on scroll-heavy pages. No FOUC on first paint.

---

## Phase 4 — Server-component conversion

**Goal:** Fewer `"use client"` islands. Less JS shipped. Faster streaming.

### 4.1 The big win: `/states/page.tsx` → server component

Today it's `"use client"` because of tab/filter state. Solution: **split into a thin server page + a client island**.

- `app/[locale]/(frontend)/states/page.tsx` becomes `async` server component.
- `components/states-interactive.tsx` (new) holds the interactive shell — tabs, filter, state selection.
- Static parts (header, stats strip, Tradition 6 notice, AA meeting finder CTA, feedback note) move into the server component.
- **Critical:** `getYPAAMeetingCountsByState()` runs server-side now, so the full `YPAA_MEETINGS` array (52 KB) stops shipping to the client on page load. The client only gets what it needs (via props or a lazy fetch of the directory data).

### 4.2 Convert purely-decorative components to server components

These are `"use client"` for no reason — no state, no effects, no event handlers:

- `components/site-footer.tsx` — uses framer-motion (solved in Phase 2) + static markup. After removing framer-motion → **server component.**
- `components/mobile-cta-bar.tsx` — after the CSS-driven rewrite in 3.3, it becomes static → **server component.**
- `components/page-shell.tsx` — after the framer-motion removal → **server component.**

### 4.3 Move data-shaping into a `lib/data/` server module

- `lib/data/fetch-utils.ts` already lazy-imports Payload. Good.
- Add `unstable_cache` with a 5-minute TTL tag around `getEvents()` and `getBlogPosts()` so repeat SSR cost is constant:

```ts
import { unstable_cache } from "next/cache"
export const getEvents = unstable_cache(_getEvents, ["events"], { revalidate: 300, tags: ["events"] })
```

Add a revalidation endpoint: `POST /api/revalidate?tag=events` with a secret header. Wire Payload's `afterChange` hook to hit it.

### 4.4 Parallelize data fetches on the home page

Currently:

```tsx
const hostEvents = await getEvents()
const events = await fetchCalendarEvents()
```

Make it parallel:

```tsx
const [hostEvents, events] = await Promise.all([getEvents(), fetchCalendarEvents()])
```

Also: short-circuit `fetchCalendarEvents()` when `GOOGLE_CALENDAR_API_KEY` isn't present (already done — good).

**Projected gain:** `/states` first-load JS drops ~60 KB. Home page TTFB drops 100–300 ms.

---

## Phase 5 — CSS diet

**Goal:** 2,427 lines → < 900 lines. 115.8 KB → < 40 KB.

### 5.1 Identify duplicates with `stylelint` + `csscss`

Add to devDependencies:

```bash
pnpm add -D stylelint stylelint-config-standard css-declaration-sorter
```

Install `csscss` globally (Ruby gem) or use `https://github.com/projectwallace/css-analyzer`:

```bash
pnpm dlx @projectwallace/css-analyzer "app/[locale]/(frontend)/globals.css"
```

Expected findings:

- 40+ `.a11y-high-contrast` overrides that can collapse into generic selectors like `.a11y-high-contrast [class*="card"]`.
- 20+ `.a11y-reduce-motion` `animation: none !important` rules that can be one universal rule.
- Duplicate `transition` declarations on `.nec-card`, `.nec-card-lift`, `.nec-interactive-card`, `.nec-meeting-dir-card`, etc.

### 5.2 Consolidate the three reduce-motion blocks

Today there are three separate giant blocks (inside `@media (prefers-reduced-motion)`, `.a11y-reduce-motion`, and `.a11y-reduce-motion *`). Collapse to:

```css
.a11y-reduce-motion,
.a11y-reduce-motion *,
.a11y-reduce-motion *::before,
.a11y-reduce-motion *::after,
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

One rule, one scan. Replaces ~80 lines.

### 5.3 Split the stylesheet by route group

Today globals.css contains ~300 lines of registration-only and ~200 lines of meeting-directory-only CSS loaded on every page. Move them out:

- `@/app/[locale]/(frontend)/register/register.css` — imported only by register pages.
- `@/app/[locale]/(frontend)/states/states.css` — imported only by states page.
- `@/components/meeting-directory.module.css` — imported only where used.

Next.js automatically code-splits route-level CSS.

### 5.4 Kill redundant `!important` chains

There are ~60 `!important` declarations in globals.css. Most exist to override Tailwind utilities. With proper specificity (`[data-color-mode="dark"]` is already specific), most can drop.

### 5.5 Harden Tailwind purge

`tailwind.config.js` content globs are correct. Add `safelist` only for classes generated by data (e.g., `text-gray-300`, `hover:bg-white/5` — we override them in globals.css so they must not be purged). Add:

```js
safelist: [
  "text-white", "text-gray-200", "text-gray-300", "text-gray-400", "text-gray-500", "text-gray-600", "text-gray-700",
  "hover:bg-white/5", "hover:bg-white/[0.03]",
]
```

### 5.6 Drop unused font family declarations

`--font-display: Bangers` is declared in Tailwind config but **Bangers is not loaded via `next/font`.** Either load it (it's a display font, only heroes use it) or remove the fallback to avoid FOUT on the hero title.

If kept: add to `app/[locale]/(frontend)/layout.tsx`:

```ts
import { Bangers } from "next/font/google"
const bangers = Bangers({ weight: "400", subsets: ["latin"], variable: "--font-display", display: "swap", preload: false })
```

Change `preload: true` on `cormorant` to `preload: false` — we only use Cormorant Garamond in places that aren't above-the-fold. **Only keep `preload: true` on Source Serif 4 (body) and Playfair Display (h1).**

**Projected gain:** CSS transfer 115.8 KB → 35–45 KB. First Contentful Paint 200–400 ms faster.

---

## Phase 6 — Image pipeline finalize

**Goal:** Every image served is < 200 KB. Every above-the-fold image has a blur placeholder + priority. AVIF preferred.

### 6.1 Convert remaining PNGs to WebP + AVIF

After Phase 1.1 deletes unused ones, the remaining PNGs still shipping:

```bash
find public -name "*.png" ! -name "*.original" -exec du -h {} + | sort -rh
```

- Run through `sharp` to produce `.webp` + `.avif` siblings at quality 82 (AVIF) and 85 (WebP).
- Update `scripts/optimize-images.mjs` to also emit AVIF.

### 6.2 Generate blur placeholders at build time

Add to `scripts/optimize-images.mjs`: for every hero image (poster, logo, badge, portals, characters), emit a 10×10 base64 WebP + write a TypeScript file:

```ts
// lib/data/image-placeholders.ts (generated)
export const BLUR = {
  "/images/mad-realm-poster-full.webp": "data:image/webp;base64,...",
  "/images/mad-realm-logo-no-bg.webp": "data:image/webp;base64,...",
  // ...
}
```

Components just do:

```tsx
import { BLUR } from "@/lib/data/image-placeholders"
<Image src={src} placeholder="blur" blurDataURL={BLUR[src]} ... />
```

CLS goes to zero on image load. No runtime sharp dependency needed.

### 6.3 Audit `priority` and `fetchPriority`

- `HeroSection` poster + logo: `priority` ✅ (correct).
- `SiteHeader` badge: `priority` ✅ (correct).
- Every other `Image` that is below the fold: remove `priority`. Verify `loading="lazy"` is implicit (it is).
- For the hero poster specifically, also add `fetchPriority="high"` (React 19 supports it natively as a prop).

### 6.4 Tune `next.config.mjs` images

```js
images: {
  formats: ["image/avif", "image/webp"],
  minimumCacheTTL: 31536000,
  deviceSizes: [360, 640, 750, 828, 1080, 1200, 1920],   // drop 2048, 3840
  imageSizes: [16, 32, 48, 64, 96, 128, 256],             // drop 384
  // we don't serve external images:
  remotePatterns: [],
}
```

Smaller `deviceSizes` = smaller `srcset` = smaller HTML.

**Projected gain:** LCP image 20–30 % smaller via AVIF. CLS ~0 on hero. 1.5–2.5 MB saved per visit on cold-cache mobile.

---

## Phase 7 — Third-party + network tuning

**Goal:** No wasted bytes, no wasted requests.

### 7.1 De-duplicate Google Analytics `config` calls

`components/analytics/google-analytics.tsx` currently fires **two** `gtag('config', ID, {...})` calls back-to-back. Collapse to one:

```ts
gtag('config', '${GA_TRACKING_ID}', {
  page_path: window.location.pathname,
  send_page_view: true,
  transport_type: 'beacon',
  cookie_flags: 'SameSite=None;Secure',
  cookie_expires: 63072000,
  cookie_update: true,
  anonymize_ip: false,
  allow_google_signals: true,
  allow_ad_personalization_signals: false,
  custom_map: { dimension1: 'user_type', dimension2: 'page_category', dimension3: 'content_language' }
});
```

### 7.2 Gate analytics behind user interaction

Load GA + Vercel Analytics + SpeedInsights with `strategy="lazyOnload"` on pages other than the home page. For the home page, keep `afterInteractive`. Rationale: most sub-page visitors came from home → analytics already fired.

Better: add a `requestIdleCallback`-gated loader for everything except the main tag:

```tsx
<Script src="..." strategy="lazyOnload" />
```

### 7.3 Preconnect to Stripe on pages that need it

On `/register`, `/breakfast`, and `/merch` only, add:

```tsx
<link rel="preconnect" href="https://js.stripe.com" />
<link rel="preconnect" href="https://api.stripe.com" />
```

Lazy-load Stripe only when user clicks "Continue to payment" (currently already done — good). Just add the preconnects.

### 7.4 Tighten CSP

Current CSP allows `https://fonts.googleapis.com` and `https://fonts.gstatic.com` for `style-src` and `font-src`. We self-host via `next/font`, so these are unused surface.

**Remove** from `next.config.mjs` CSP:

- `style-src`: drop `https://fonts.googleapis.com`
- `font-src`: drop `https://fonts.gstatic.com`

Keep `'unsafe-inline'` for style-src (Next.js inlines critical CSS). Consider using `'nonce-'`-based CSP with Next.js 15's nonce API for style-src in a follow-up — reduces XSS surface.

### 7.5 Drop the Vercel `SpeedInsights` double-tracking

Vercel Analytics already captures Core Web Vitals. `@vercel/speed-insights` is a separate `<script>` doing overlapping work. Keep one, drop the other. Recommendation: keep `@vercel/speed-insights`, drop the explicit `web-vitals` reporter (which isn't wired anyway — already dealt with in 1.3). Remove `<Analytics />` if it duplicates data — check Vercel project settings.

### 7.6 Set `Cache-Control` headers for `/images/*`

Add to `next.config.mjs`:

```js
async headers() {
  return [
    ...existingHeaders,
    {
      source: "/images/:path*",
      headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }]
    },
    {
      source: "/fonts/:path*",
      headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }]
    }
  ]
}
```

**Projected gain:** ~20 KB less third-party JS on sub-pages. Faster Stripe init. One fewer DNS resolution.

---

## Phase 8 — Next.js / runtime polish

### 8.1 Enable Turbopack for dev builds (no prod impact)

`package.json`:

```json
"dev": "next dev --turbopack"
```

Dev feedback loop 5–10× faster. Zero prod risk.

### 8.2 Expand `optimizePackageImports`

`next.config.mjs`:

```js
experimental: {
  optimizePackageImports: [
    "lucide-react",
    "framer-motion",
    "@radix-ui/react-accordion",
    "@radix-ui/react-checkbox",
    "@radix-ui/react-label",
    "@radix-ui/react-slot",
    "@radix-ui/react-switch",
  ],
}
```

### 8.3 Inline small above-the-fold SVGs

`/images/necypaa-xxxvi-badge.webp` is used in the header + OG image. The header uses a 200×100 `<Image>`. Convert it to an inlined `<svg>` (or a tiny SVG in `/public/icon.svg` already exists) so the header renders with zero image request.

### 8.4 Harden server-only imports

Grep for accidental client imports of `payload`, `stripe`, etc.:

```bash
grep -rE "^import.*from [\"']payload[\"']" app components | grep -v "use server\|fetch-utils\|actions/"
```

Anything flagged must either move to `"use server"` files or to `actions/*`.

### 8.5 Statically type the Google Calendar response

Already typed — good. Add an `AbortController` timeout wrap on the whole pagination loop (currently only per-request), so a flaky Google API can't stretch a page render to 20×10s = 200s:

```ts
const globalTimeout = AbortSignal.timeout(15_000)
// pass globalTimeout as signal to every fetch
```

### 8.6 Route segment config

Add `export const dynamic = "force-static"` to pages that are fully static:

- `/faq`
- `/asl`
- `/prayer`
- `/bid`
- `/service`
- `/journey`
- `/accessibility`
- `/merch`

Keep `revalidate = 300` on `/` and `/events` and `/blog` (CMS-driven).

---

## Phase 9 — Caching + offline + PPR

### 9.1 Enable Partial Prerendering (PPR)

Next.js 15 supports PPR. Add to `next.config.mjs`:

```js
experimental: {
  ppr: "incremental",
  // ...existing
}
```

Then mark specific routes:

```tsx
export const experimental_ppr = true
```

Start with `/` and `/events`. PPR lets the static shell stream instantly while the dynamic `BusinessMeetingSection` (Google Calendar data) streams in behind a Suspense boundary.

### 9.2 Wrap dynamic sections in Suspense

`app/[locale]/(frontend)/page.tsx`:

```tsx
<Suspense fallback={<BusinessMeetingSkeleton />}>
  <BusinessMeetingSection nextMeeting={...} />
</Suspense>
```

Do the same for `EventsPreviewSection`.

### 9.3 Service Worker via `@serwist/next`

Install `@serwist/next` (modern Workbox successor). Configure:

- Runtime cache `CacheFirst` for `/images/*` and `/fonts/*`.
- Runtime cache `StaleWhileRevalidate` for `/api/*`.
- Offline fallback page: reuse `@/app/[locale]/(frontend)/not-found.tsx` styled as offline.

Repeat visits serve instantly from the SW, bypassing even the network.

### 9.4 Vercel Edge config for low TTFB

If still on Vercel: set `export const runtime = "edge"` on non-Stripe, non-Payload routes (blog, faq, static informational pages). Edge deploys respond in 5–40 ms vs 100–300 ms from Lambda.

**Caution:** Payload CMS admin needs Node.js runtime — leave `/admin` and `/api/*` on Node.

**Projected gain:** Repeat-visit LCP < 500 ms (served from SW). First-visit TTFB 80–150 ms faster for edge routes.

---

## Phase 10 — Validation + regression guard

### 10.1 Lighthouse CI

`.github/workflows/lighthouse.yml`:

```yaml
name: Lighthouse CI
on: [pull_request]
jobs:
  lhci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - uses: treosh/lighthouse-ci-action@v12
        with:
          urls: |
            http://localhost:3000/
            http://localhost:3000/events
            http://localhost:3000/states
            http://localhost:3000/register
          budgetPath: .github/lighthouse-budget.json
          uploadArtifacts: true
```

`.github/lighthouse-budget.json`:

```json
[{
  "path": "/*",
  "resourceSizes": [
    { "resourceType": "script", "budget": 200 },
    { "resourceType": "stylesheet", "budget": 50 },
    { "resourceType": "image", "budget": 600 },
    { "resourceType": "total", "budget": 1200 }
  ],
  "timings": [
    { "metric": "largest-contentful-paint", "budget": 1800 },
    { "metric": "interactive", "budget": 2500 },
    { "metric": "cumulative-layout-shift", "budget": 0.05 }
  ]
}]
```

### 10.2 Bundle size budget in CI

`package.json`:

```json
"scripts": {
  "size:check": "size-limit"
}
```

`.size-limit.json`:

```json
[
  {
    "name": "home-page-first-load-js",
    "path": ".next/static/chunks/app/[locale]/(frontend)/page-*.js",
    "limit": "40 kB"
  },
  {
    "name": "layout-first-load-js",
    "path": ".next/static/chunks/app/[locale]/(frontend)/layout-*.js",
    "limit": "50 kB"
  },
  {
    "name": "framer-motion-chunk",
    "path": ".next/static/chunks/3103-*.js",
    "limit": "40 kB"
  }
]
```

### 10.3 Playwright perf smoke test

Add `e2e/performance.spec.ts`:

```ts
import { test, expect } from "@playwright/test"

test("homepage loads under 2s on fast 3G", async ({ page }) => {
  await page.route("**/*", (route) => route.continue())
  const start = Date.now()
  await page.goto("/", { waitUntil: "domcontentloaded" })
  const duration = Date.now() - start
  expect(duration).toBeLessThan(2000)
})

test("no layout shift on first 3s", async ({ page }) => {
  await page.goto("/")
  const cls = await page.evaluate(() => new Promise<number>((resolve) => {
    let total = 0
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as any[]) {
        if (!entry.hadRecentInput) total += entry.value
      }
    }).observe({ type: "layout-shift", buffered: true })
    setTimeout(() => resolve(total), 3000)
  }))
  expect(cls).toBeLessThan(0.1)
})
```

### 10.4 Manual smoke list

After full pass, verify by hand:

- [ ] Home page renders poster + logo + hero text in < 1 s on throttled mobile (Chrome DevTools "Fast 4G").
- [ ] No flash of light theme on dark-mode reload.
- [ ] No flash of default font size when user has 150% text size.
- [ ] Scrolling is butter smooth on a 2020 iPhone SE.
- [ ] Back button and forward button are instant (SW cache or PPR).
- [ ] Screen reader announcement for mode changes still works.
- [ ] All 6 a11y modes still visually correct.
- [ ] All modals still trap focus and respond to Escape.
- [ ] Keyboard-only nav through header, dropdown, drawer, CTA bar.
- [ ] Print preview still legible.
- [ ] Cold-cache mobile Lighthouse Performance ≥ 95.

---

## Appendix A — File-by-file action list

### Delete

- `public/images/ct-state-art.png`
- `public/images/necypaa-logo.png`
- `public/images/hartford-ct-text.png`
- `public/images/prereg-cta-text.png`
- `public/images/necypaa-logo-transparent.png`
- `public/images/event-dates.png`
- `public/flyer.png`
- `public/**/*.original` (33 files)
- `app/[locale]/(frontend)/critical.css`
- `lib/web-vitals.ts` (replaced by `next/web-vitals` hook)
- `components/ui/motion-header.tsx` (fold into callers)

### Rewrite (keep filename)

- `components/site-header.tsx` — remove framer-motion, data-attribute CSS patterns
- `components/site-footer.tsx` — server component, no framer-motion
- `components/mobile-cta-bar.tsx` — server component, CSS `body[data-locked]`
- `components/page-shell.tsx` — server component
- `components/ui/motion-primitives.tsx` — drop framer-motion, keep API
- `components/ui/scroll-progress.tsx` — imperative refs, no state
- `components/ui/back-to-top.tsx` — imperative refs, no state
- `components/ui/page-transition.tsx` — verify no re-render; consider View Transitions
- `components/sections/events-preview-section.tsx` — ScrollReveal + CSS stagger
- `components/sections/meetings-section.tsx` — ScrollReveal + CSS stagger
- `components/sections/business-meeting-section.tsx` — drop `MagneticButton`
- `components/sections/purpose-section.tsx` — CSS SpotlightCard
- `components/sections/hero-section.tsx` — drop `MagneticButton` usage
- `components/blog-grid.tsx` — IntersectionObserver + CSS
- `components/character-divider.tsx` — CSS keyframes
- `lib/accessibility-context.tsx` — remove `applySettings` on mount (inline script handles it)
- `components/analytics/google-analytics.tsx` — collapse two `gtag('config')` to one
- `next.config.mjs` — CSP cleanup, image sizes, PPR, cache headers, more `optimizePackageImports`
- `app/[locale]/(frontend)/layout.tsx` — inline a11y script, remove Cormorant preload
- `app/[locale]/(frontend)/page.tsx` — `Promise.all`, Suspense boundaries
- `app/[locale]/(frontend)/states/page.tsx` — server-component shell + client island

### Add

- `app/[locale]/(frontend)/register/register.css` — route-scoped CSS
- `app/[locale]/(frontend)/states/states.css` — route-scoped CSS
- `components/states-interactive.tsx` — client island for states page
- `components/web-vitals-reporter.tsx` — wraps `useReportWebVitals`
- `lib/data/image-placeholders.ts` — generated blur data URLs
- `docs/perf/baseline.md` — pre-optimization numbers
- `docs/perf/post-phase-N.md` — after each phase
- `.github/workflows/lighthouse.yml` — Lighthouse CI
- `.github/lighthouse-budget.json` — budget
- `.size-limit.json` — bundle size budget
- `e2e/performance.spec.ts` — perf smoke tests

### Update handoff

- `.handoff/01_SYSTEM_ARCHITECTURE.md` — note View Transitions, SW, PPR
- `.handoff/02_OPERATIONS_AND_DEPLOYMENT.md` — note Lighthouse CI, perf budgets
- `.handoff/03_ACTIVE_CONTEXT.md` — note current perf state

---

## Appendix B — Measurement commands

```bash
# 1. Total public assets size
du -sh public/images public/fonts public/

# 2. JS bundle per route
cat .next/app-build-manifest.json | python3 -c "
import json, sys, os
d = json.load(sys.stdin)
for route, files in sorted(d.get('pages', {}).items()):
    total = sum(os.path.getsize(os.path.join('.next', f)) for f in files if os.path.exists(os.path.join('.next', f)))
    print(f'{total/1024:7.1f} KB  {route}')"

# 3. CSS size per route
find .next/static/css -name "*.css" -exec du -h {} +

# 4. Unused exports
pnpm dlx knip --reporter compact

# 5. Unused CSS
pnpm dlx purgecss --css "app/**/*.css" --content "app/**/*.tsx" "components/**/*.tsx" --output /tmp/purged

# 6. Lighthouse local
pnpm build && pnpm start &
sleep 5
npx unlighthouse --site http://localhost:3000 --throttle-method simulate

# 7. Find unused public files
for f in $(find public -type f -name "*.png" -o -name "*.webp" -o -name "*.jpg" -o -name "*.jpeg"); do
  name=$(basename "$f")
  ref=$(grep -r "$name" app components lib i18n messages --include="*.tsx" --include="*.ts" --include="*.css" --include="*.json" 2>/dev/null | head -1)
  if [ -z "$ref" ]; then echo "UNUSED: $f ($(du -h "$f" | cut -f1))"; fi
done
```

---

## Execution order (recommended)

1. **Phase 0** (1 h) — instrumentation. Establish baseline.
2. **Phase 1** (1 h) — delete dead weight. Verify nothing breaks.
3. **Phase 3** (2 h) — hydration + scroll hot paths. Biggest UX win.
4. **Phase 2** (3 h) — framer-motion removal. Biggest JS win.
5. **Phase 4** (2 h) — server-component conversion. Locks in JS savings.
6. **Phase 5** (3 h) — CSS diet. Biggest CSS win.
7. **Phase 6** (1 h) — image pipeline finalize.
8. **Phase 7** (1 h) — third-party + network.
9. **Phase 8** (1 h) — Next.js runtime polish.
10. **Phase 9** (2 h) — caching, PPR, SW.
11. **Phase 10** (1 h) — regression guard.

**Total: ~18 hours of focused work.** Can be split across 3–4 sessions. Each phase is independently safe to deploy.

---

## Success criteria (measurable)

| Metric | Baseline (est.) | Target | How to verify |
|---|---|---|---|
| Homepage JS first-load | 583 KB | < 200 KB | `.next/app-build-manifest.json` |
| Homepage CSS | 115.8 KB | < 45 KB | `find .next/static/css -name "*.css"` |
| Deploy artifact public/ | 91 MB | < 8 MB | `du -sh public/` |
| LCP on Fast 4G (mobile) | 2.8–3.5 s (est.) | < 1.8 s | Lighthouse |
| CLS | 0.06–0.10 (est.) | < 0.02 | Lighthouse |
| INP | 180–250 ms (est.) | < 100 ms | Web Vitals reporter |
| TTFB (home) | 250–500 ms | < 150 ms | Lighthouse |
| Lighthouse Perf (mobile) | ~70 (est.) | ≥ 95 | Lighthouse |
| Cold-start Time to Interactive | 4–5 s (est.) | < 2.5 s | Lighthouse |
| No visual regression | — | pass | Manual + playwright screenshots |
| All 6 a11y modes work | pass | pass | Manual axe + playwright-axe |

---

## Non-goals (explicitly out of scope)

- Replacing Payload CMS (mature, works, keep it).
- Replacing Next.js (already on 15.4).
- Dropping next-intl (we have `/en` and `/es` — keep).
- Dropping Tailwind.
- Visual redesign.
- Changing any accessibility behavior.

---

**Final note:** every phase is reversible via git. Every phase has an objective, measurable success criterion. Nothing in this plan requires a visual compromise, an accessibility compromise, or a content compromise. If a phase lands and the numbers don't improve, revert it — no pride, just measurement.

_Generated by Cascade on May 5, 2026._
