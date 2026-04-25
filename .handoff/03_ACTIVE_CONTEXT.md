# Handoff Context — NECYPAA XXXVI Production Hardening

**Date:** April 25, 2026

## Original Directive
Execute the full production hardening mission defined in `GEMINI.md`.

## Current Branch
`hardening/full-production-audit-fix`

## Phases Completed
### Phase 1 — Payment and registration hardening
- Created `Registrations` Payload CMS collection.
- Updated server actions to insert initial records.
- Implemented Stripe webhook at `app/api/webhooks/stripe/route.ts` to reconcile checkout completion.
- Added Vitest tests for webhook logic.

### Phase 2 — Cash/free/access-code security
- Removed `/cash` local route completely as the cash registration system was moved to a separate repository (`necypaa-ras`).
- Cleaned up obsolete local tests, actions (`free-registration.ts`), and sitemap entries.
- Validated that the remaining `submitAccessCodeRegistration` is protected by the external issuer service and properly rate-limited.

### Phase 3 — Production-safe rate limiting
- Replaced in-memory rate limiting with `@upstash/redis` backed implementation in `lib/rate-limit.ts`.
- Retained the in-memory method as a graceful fallback when Redis credentials aren't provided.
- Refactored calling code to handle the asynchronous API.
- Updated documentation with new `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` environment variables.

### Phase 4 — Payload CMS hardening
- Added explicit read/create/update/delete access controls to all Payload collections (`Users`, `Media`, `Events`, `BlogPosts`, `FAQ`, `Registrations`).
- Added `admin`, `editor`, `registration`, and `viewer` roles to `Users`.
- Removed `image/svg+xml` from `Media` allowed mime types to prevent malicious SVG uploads.
- Documented the Vercel ephemeral storage limitation in `01_SYSTEM_ARCHITECTURE.md`, recommending Turso (libSQL) via `DATABASE_URI` for persistent production SQLite.

### Phase 5 — Static data versus CMS consolidation
- Kept strongly-typed static files (`lib/data/blog-posts.ts`, `lib/data/events.ts`) to act as safe fallbacks.
- Created `lib/data/fetch-utils.ts` to dynamically fetch events and blog posts from Payload CMS, gracefully falling back to static data if the database is unpopulated or wiped.
- Added event date validation and dynamic upcoming/past categorization heuristics based on the parsed dates.
- Updated all frontend components (`blog/page.tsx`, `events/page.tsx`, `blog/[slug]/page.tsx`, `service/page.tsx`, `feed.xml`) to use the new typed fetch utilities instead of static imports.

### Phase 6 — Replace weak placeholder pages
- Refactored `InventoryShell` component to accept a `pageContent` prop that replaces the default "coming soon" placeholder text.
- Kept the retro games accessible via the "Inventory in Progress" button as an easter egg.
- Updated `/program`, `/asl`, `/merch`, `/bid`, and `/prayer` pages with concrete, useful information regarding current status, logistics, and contact paths.

## Next Phase
Phase 7 — Design system cleanup

## Verification & Completion Notes (2026-04-25)
- **Build:** Verified clean (`pnpm build` passes).
- **Tests:** Verified all 58 Vitest tests pass.
- **Code fixes applied:**
  - Fixed syntax error in `components/sections/events-preview-section.tsx` (duplicate ternary + missing props interface).
  - Fixed missing `getBlogPostBySlug` import in `app/[locale]/(frontend)/service/page.tsx`.
- **Hardening completions:**
  - `lib/issuer-client.ts` — Added Zod runtime validation for redemption responses + retry logic with exponential backoff.
  - `lib/env.ts` — Created centralized environment variable validation (warnings at module load, strict `validateEnv()` available for startup).
  - `app/feed.xml/route.ts` — Fixed RSS item links from `/blog#slug` to `/blog/slug`.
  - `app/sitemap.ts` — Removed meaningless `lastModified: new Date()` from all entries.
  - `app/api/webhooks/stripe/route.ts` — Replaced `err: any` with `unknown` narrowing.
  - `lib/data/fetch-utils.ts` — Replaced all `any` types with `Record<string, unknown>` + runtime narrowing.
  - Checkout error boundaries — Wrapped `RegistrationCheckout` and `BreakfastCheckout` in `ErrorBoundary` with graceful fallbacks.
  - `.github/workflows/ci.yml` — Added GitHub Actions CI (install → lint → format-check → test → build).
- **Documentation created/corrected:**
  - `docs/tech-debt-and-gaps.md` — Marked P0 #1–3, P1 #8, P2 #11 as fixed. Removed stale `free-registration.ts` references.
  - `docs/architecture.md` — Removed `/cash` route, `free-registration.ts` action, and free/cash data flow. Updated rate-limiting and CMS notes.
  - `.handoff/01_SYSTEM_ARCHITECTURE.md` — Removed stale webhook gap and `free-registration.ts` references. Updated test count to 58.
  - `docs/internal/full-production-hardening-audit.md` — Marked Phase 1, 2, 5, 6 as completed. Removed duplicate Phase 6 entry.
  - `docs/onboarding.md` — Removed `free-registration.ts` reference. Updated test count and CMS-first guidance.
  - `docs/i18n-status.md` — New doc: honest assessment that the site is English-first with Spanish infrastructure ready, not fully bilingual.
  - `docs/accessibility-qa-checklist.md` — New doc: pre-launch accessibility checklist.
  - `docs/assets-policy.md` — New doc: image format rules, naming conventions, and optimization guidance.

## Open Risks & Blockers
- **CSS Splitting:** Attempt to split `globals.css` into smaller files failed due to PostCSS/Tailwind complexities. Keeping it monolithic for now.
- **SQLite on Vercel:** Documented the ephemeral nature of `payload.db` on Vercel in `01_SYSTEM_ARCHITECTURE.md`. Persistent storage (e.g., Turso) is required for production.
- **`!important` usage:** While many `!important` rules are for accessibility overrides, a manual audit is needed to identify and remove unnecessary uses.
- **CSS Audit:** Comprehensive audit of dead/duplicate CSS and consistency across components is pending.
- **Server action integration tests:** `registration.ts` and `breakfast.ts` server actions lack full integration tests with mocked Stripe (P3 #15 in tech-debt).
- **Image asset diet:** `public/images/` is 91 MB with 47 unoptimized PNG/JPEG files. Conversion to WebP/AVIF is recommended before launch.
- **i18n:** Site is not fully bilingual. Spanish CMS fields exist but are unpopulated.

## Final Report Requirements
Refer to `GEMINI.md` for the final report structure.