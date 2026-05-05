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

## Latest Changes (2026-04-26)
- Added Google Analytics 4 (GA4) integration for enhanced visitor tracking
- Files created:
  - `lib/gtag.ts` — GA4 tracking utility with custom events
  - `components/analytics/google-analytics.tsx` — GA4 script component
  - `components/analytics/scroll-tracker.tsx` — Scroll depth tracking (25%, 50%, 75%, 90%, 100%)
  - `components/analytics/index.ts` — Analytics component exports
- Modified:
  - `app/[locale]/(frontend)/layout.tsx` — Added GoogleAnalytics and ScrollTracker components
  - `.env.local` — Added `NEXT_PUBLIC_GA_ID` placeholder
- Custom events available:
  - `trackRegistrationStarted(location)` — When user begins registration
  - `trackRegistrationCompleted(ticketType)` — Successful registration
  - `trackDonation(amount, method)` — Donation made
  - `trackExternalLink(url, linkType)` — External link clicks
  - `trackFAQExpanded(questionSlug)` — FAQ interactions
  - `trackVideoPlay(videoTitle)` — Video engagement
  - `trackScrollDepth(percentage)` — Scroll depth (auto-tracked)
  - `trackSearch(query, resultsCount)` — Site search
  - `trackFormStart/Submit(formName)` — Form interactions
  - `trackError(type, message)` — Error tracking
  - `trackSocialShare(platform, contentType)` — Social sharing
  - `trackDownload(fileName, fileType)` — File downloads

### Google Analytics Setup Instructions
1. Go to https://analytics.google.com/analytics/web/
2. Create a new GA4 property for "NECYPAA XXXVI"
3. Get your Measurement ID (looks like `G-XXXXXXXXXX`)
4. Add to `.env.local`:
   ```
   NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
   ```
5. Redeploy to Vercel

### What GA4 Gives You (Free Tier)
- **Geographic**: Country → State → City (no county, but metro area is close)
- **Demographics**: Age, gender, interests (if users opt-in)
- **Technology**: Browser, OS, device, screen resolution
- **Engagement**: Session duration, pages/session, bounce rate
- **Events**: All custom events listed above
- **Realtime**: Live user count, active pages
- **Retention**: 14 months standard, 2 months granular
- **Custom**: Funnel exploration, path analysis, cohort analysis

### Combining with Vercel Analytics
Vercel Analytics (already running) + GA4 = complete picture:
- Vercel: Core Web Vitals, performance, deployment correlation
- GA4: User behavior, conversions, demographics, geographic breakdowns

## Latest Changes (2026-05-05) — Production Recovery

### Production registration broken & restored

**Symptom (user-reported):** "Server Components render error" on `/en/register` when a user submitted the form. Live admin (`/admin`) had been returning HTTP 500 silently for ~10 days.

**Root cause (two independent layers):**

1. **Two missing env vars on the live project.** The live project (`v0-necypaa` under team `necypaas-projects`, owned by `frothy.appeal@gmail.com`) had only 5 env vars set: `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_MCP_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `GOOGLE_CALENDAR_API_KEY`. **`PAYLOAD_SECRET` and `DATABASE_URI` had never been set.** This worked unnoticed for ~5 weeks (2026-03-18 Payload introduction → 2026-04-25 production-hardening pass) because Payload silently fell back to a random per-cold-start secret and a read-only `file:./payload.db` bundled into the deployment. Reads (events, blog, FAQ pages) succeeded; writes (registration, admin) failed silently. The 2026-04-25 hardening pass added eager validation in `lib/env.ts` and a `PAYLOAD_SECRET ?? throw` guard, which masked the underlying issue with a confusing user-facing crash.

2. **`libsql` native binding not deployed.** Even with env vars correct and a real `DATABASE_URI`, `/admin` and any Payload-write route returned 500 with `Cannot find module 'libsql'`. The libSQL native binding and `@libsql/client` were transitive deps of `@payloadcms/db-sqlite`; pnpm did not hoist them, and Next.js's webpack tried (and failed) to bundle the native module instead of letting Node's runtime `require()` resolve it.

**Fix applied:**

- **Provisioned Turso DB** `necypaa-prod` in `aws-us-east-1`, owner `frothyappeal`. Schema (16 tables: `users`, `users_sessions`, `events`, `events_details`, `events_schedule`, `blog_posts`, `_blog_posts_v`, `faq`, `media`, `registrations`, `payload_kv`, `payload_locked_documents`, `payload_locked_documents_rels`, `payload_migrations`, `payload_preferences`, `payload_preferences_rels`) seeded from local `payload.db`. Local `payload.db` content is intentionally minimal (1 admin user, 1 migration record); events/blog/faq pages render from hard-coded static fallback content in the Next.js source — Payload tables are present and writable but currently empty.
- **Set `PAYLOAD_SECRET` and `DATABASE_URI`** on the live project (`prj_Bcg79JrlDALrNWQxU21hfHsV0xtq`, team `team_6HxrGZnzv7pEo1nhSxC1teCX`) via the Vercel REST API, type `encrypted`, all three targets (Production / Preview / Development).
- **`package.json`** — Promoted `libsql@^0.4.7` and `@libsql/client@^0.14.0` from transitive to direct dependencies so pnpm hoists them into top-level `node_modules`, where Node.js can resolve them at runtime.
- **`next.config.mjs`** — Added `serverExternalPackages: ["libsql", "@libsql/client", "@libsql/core", "@payloadcms/db-sqlite"]` so Next.js's webpack stops trying to bundle native modules and lets Node's `require()` resolve them at runtime.
- **`.vercel/project.json`** — Re-linked to the correct live project (`prj_Bcg79JrlDALrNWQxU21hfHsV0xtq` / `team_6HxrGZnzv7pEo1nhSxC1teCX`); previous link pointed to a phantom `v0-necypaa` clone under a different account.

**Late catch — Turso token rotation:**

After all env vars were set and the libsql native module fix was deployed, /admin and /en/register were still returning 500 with `Failed query: ... Error [LibsqlError]: SERVER_ERROR: Server returned HTTP status 404`. Initial diagnosis suggested schema mismatch, but a fresh Node.js test against the same `DATABASE_URI` reproduced the 404 from local — meaning the URL itself was being rejected by Turso. Generating a new token with `turso db tokens create necypaa-prod --expiration none` resolved the issue. **Turso silently invalidates earlier `--expiration none` tokens when a new one is generated for the same database**, which was triggered earlier in the recovery flow when troubleshooting auth. The 404 is Turso's response when an auth-token signature is valid in shape but no longer authorised for the named DB. Fix: rotated to fresh token, PATCHed the env entry on Vercel via `/v10/projects/.../env/{id}`, redeployed.

### Active production identity

- **Vercel project:** `prj_Bcg79JrlDALrNWQxU21hfHsV0xtq` (`v0-necypaa`)
- **Vercel team:** `team_6HxrGZnzv7pEo1nhSxC1teCX` (`necypaas-projects`)
- **Vercel CLI account:** `host-4508` (`frothy.appeal@gmail.com`)
- **Turso account:** `frothyappeal` (same email)
- **Domains attached:** `necypaact.com`, `www.necypaact.com`, `v0-necypaa.vercel.app` — all 200 OK across all routes after the fix.
- **GitHub author identity (unchanged):** `ntoledo319 <toledonick98@gmail.com>`

### Phantom clone account (informational)

Around 2026-05-03 a duplicate Vercel account `hubypaa-5418` (`hubypaa@gmail.com`) was created — likely an artifact of a v0/Agent flow — and a separate `v0-necypaa` project was cloned into a `hubypaas-projects` team. That account/project never owned the production domain, was never connected to live traffic, and is safe to delete from `hubypaa@gmail.com` at any time. **All production lives only on `frothy.appeal@gmail.com`.**

### Outstanding follow-ups (post-recovery)

1. **Defensive Payload writes in `actions/registration.ts`** — currently a `payload.create()` failure throws and bubbles a "Server Components render error" to the user. Wrap in try/catch + log + continue with Stripe-only flow, using Stripe Checkout session metadata as the durable fallback record.
2. **`/api/health` endpoint** — add a lightweight route that returns 200 + JSON with Payload + Turso connectivity status, so future incidents surface faster.
3. **`STRIPE_WEBHOOK_SECRET`** — never set on the live project. Stripe → DB reconciliation in `app/api/webhooks/stripe/route.ts` is currently unsigned. Set this and configure the corresponding endpoint in the Stripe dashboard.
4. **Delete phantom `v0-necypaa` project under `hubypaa@gmail.com`** when convenient (no traffic; cosmetic cleanup only).

## Previous Changes (2026-05-04)

### Config & i18n Hardening
- **`middleware.ts`** — Added `/media` to the `next-intl` matcher exclusion list so Payload CMS uploads bypass locale middleware.
- **`next.config.mjs`** — CSP `connect-src` now dynamically includes the `ISSUER_SERVICE_BASE_URL` origin at build time.
- **`app/sitemap.ts`** — Fixed to emit fully localized paths (`/en/register`, `/es/register`, etc.) instead of non-locale paths.
- **`i18n/navigation.ts`** — Verified `createNavigation` export. Updated `SiteHeader`, `SiteFooter`, `PageShell`, and `MobileCtaBar` to import `Link` from `@/i18n/navigation` so locale prefixes are preserved on client-side navigation.

### Documentation Updates
- **`docs/tech-debt-and-gaps.md`** — Added "Recently Fixed (2026-05-04)" section documenting the config and i18n hardening items.
- **`docs/testing.md`** — Updated stale references (Stripe webhook handler now exists, blog content now CMS-backed) and added a "Recent Fixes" section.

## Final Report Requirements

Refer to `GEMINI.md` for the final report structure.
