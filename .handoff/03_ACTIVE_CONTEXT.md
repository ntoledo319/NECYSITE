# Active Context — NECYPAA XXXVI Website

> **Last Updated:** 2026-04-07
> **Purpose:** Snapshot of exactly where this project stands right now. Updated before every push.

---

## Current Project State

**Phase:** Side-branch design revolution complete enough for review. The current branch is now a full light-first, editorial, page-specific redesign rather than a partial polish pass.

**Branch:** `wave2/light-first-component-surgery` (branched from `main`; `main` still reflects the older site)
**Deployment:** Not merged to `main`. Vercel production still follows `main`.
**Verification status:** Targeted ESLint passes on the rewritten surfaces. `pnpm exec tsc --noEmit` still fails only on two pre-existing test files that use top-level `await` under the current TS config:
- `lib/__tests__/accessibility-context.test.ts`
- `lib/__tests__/issuer-client.test.ts`

---

## Latest Changes (Current Branch State)

### 1. Branch-Wide Visual System Overhaul

The site no longer presents as a dark neon SaaS template. The branch now uses a warm light-first parchment palette, calmer shadows, editorial typography, and less decorative noise across the shared shell.

**Shared changes already landed on this branch include:**
- Light-first color token overhaul in `globals.css`
- Typography shift toward `Source Serif 4` + `Playfair Display`
- Removal/reduction of generic glow/blob motion
- More premium button, form, card, and badge treatments
- Cleaner header IA and flatter navigation
- Polished share sheet, language switcher, accessibility panel, and back-to-top controls

### 2. Homepage and Core Flow Recomposition

The core conversion and storytelling surfaces were redesigned earlier in this branch:
- Homepage hero, quick facts, CTA, events preview, meeting browser, and narrative sections
- Registration flow framing and checkout context
- Breakfast ticket flow
- Events archive framing
- Meeting cards and directory scan quality

This moved the branch away from stacked component marketing pages and toward more deliberate compositions with clearer focal points.

### 3. Page-by-Page Individualization Sweep

This session completed the route-level differentiation pass so the site feels authored page by page instead of relying on repeated placeholder shells.

**Rebuilt or heavily re-authored in this sweep:**
- `app/[locale]/(frontend)/faq/page.tsx`
- `app/[locale]/(frontend)/program/page.tsx`
- `app/[locale]/(frontend)/merch/page.tsx`
- `app/[locale]/(frontend)/prayer/page.tsx`
- `app/[locale]/(frontend)/asl/page.tsx`
- `app/[locale]/(frontend)/bid/page.tsx`
- `app/[locale]/(frontend)/blog/page.tsx`
- `app/[locale]/(frontend)/blog/[slug]/page.tsx`
- `app/[locale]/(frontend)/journey/page.tsx`
- `app/[locale]/(frontend)/breakfast/page.tsx`
- `app/[locale]/(frontend)/breakfast/success/page.tsx`
- `app/[locale]/(frontend)/service/page.tsx`
- `app/[locale]/(frontend)/accessibility/page.tsx`
- `app/[locale]/(frontend)/cash/page.tsx`
- `app/[locale]/(frontend)/register/success/page.tsx`
- `app/[locale]/(frontend)/not-found.tsx`
- `app/[locale]/(frontend)/error.tsx`

**Supporting component work in this sweep:**
- `components/games/inventory-shell.tsx` now supports fully individualized teaser/bridge experiences instead of one generic “coming soon” layout
- `components/blog-card.tsx` and `components/blog-grid.tsx` now match the calmer editorial design direction

### 4. Placeholder Strategy Changed

Several routes that previously read as generic “coming soon” pages now have specific voices, bridge links, route-specific notes, committee framing, and themed visual treatment. The branch still contains future-facing pages, but they no longer feel dead or temporary in a low-effort way.

---

## Features: Current Status

### Strong / Review-Ready
- Homepage
- Registration flow
- Registration success flow
- Breakfast sales flow
- Breakfast success flow
- Events page
- Blog index and article detail pages
- States directory
- Al-Anon page
- Accessibility statement page
- Meetings browser
- Journey/archive page
- Cash registration flow
- Service opportunities page

### Present but Still Future-Facing
- Program
- Merch
- Prayer / meditation
- ASL
- Bid information
- FAQ

These routes now have distinct design and navigation value, but some still intentionally act as pre-launch bridges until final content/program data is ready.

---

## Known Bugs / Technical Constraints

### Active Known Constraint

`pnpm exec tsc --noEmit` is not fully green because of existing top-level `await` usage in:
- `lib/__tests__/accessibility-context.test.ts`
- `lib/__tests__/issuer-client.test.ts`

This is not introduced by the UI work on this branch.

### High-Priority Product Gaps Still Unrelated to This Design Pass

1. No Stripe webhook handler for authoritative post-payment reconciliation.
2. No persistent registration storage beyond Stripe metadata.
3. Rate limiting is still in-memory and not durable across production instances.

See `docs/tech-debt-and-gaps.md` for the broader backlog.

---

## Recent Commits Already On Branch

```
1fbca97 Polish NECYPAA UI across core flows
4c0117d feat(events): populate past events + redesign homepage section
3bf7aa5 fix(meta): use badge image for social sharing preview
fdf3e5c refactor(states): tabbed layout to prevent resource burial
861bc77 fix(meetings): replace unicode escape sequences with actual characters
```

---

## What a New Developer Should Know Immediately

1. `main` is no longer the visual reference. The side branch is intentionally a dramatic redesign.
2. The project now leans editorial, warm, and page-specific. Avoid reintroducing generic SaaS gradients, random pills, or effect-heavy surfaces.
3. The remaining work is more about finishing real content and backend reliability than about establishing a design direction.
4. Before pushing again, keep this file current. The pre-push hook expects it.
