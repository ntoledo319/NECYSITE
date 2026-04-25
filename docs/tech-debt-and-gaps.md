# Technical Debt & Gap Analysis

> Last updated: 2026-03-23
> Audit scope: Full codebase scan — app/, components/, lib/, actions/, collections/, e2e/

## Sizing Legend

| Size | Effort | Description |
|------|--------|-------------|
| **XS** | < 1 hour | Config change, one-liner fix |
| **S** | 1–4 hours | Single file or small module |
| **M** | 4–16 hours | Multiple files, moderate complexity |
| **L** | 2–5 days | Cross-cutting concern or new subsystem |
| **XL** | 1–2 weeks | Architectural change or major integration |

---

## P0 — Critical (Fix Before Launch)

### 1. No Stripe Webhook Handler ✅ FIXED
**Size: L** | Security, Data Integrity

~There is no webhook endpoint to receive Stripe events.~ **Fixed:** `app/api/webhooks/stripe/route.ts` now handles `checkout.session.completed`, `checkout.session.expired`, `payment_intent.payment_failed`, and `charge.refunded` with signature verification and idempotent updates to the `Registrations` collection.

### 2. No Persistent Registration Storage ✅ FIXED
**Size: L** | Data Integrity

~Registrations are stored only as Stripe customer metadata.~ **Fixed:** The `Registrations` Payload CMS collection now stores all registration records with lifecycle statuses (`pending`, `paid`, `failed`, `refunded`, `comped`, `cash`, `canceled`). Webhook and server actions both write to this collection.

### 3. Rate Limiter is Per-Instance / In-Memory ✅ FIXED
**Size: M** | Security

~`lib/rate-limit.ts` uses an in-memory `Map`.~ **Fixed:** `lib/rate-limit.ts` now uses `@upstash/redis` when `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are present, falling back to the in-memory implementation for local development.

---

## P1 — High (Address Within First Sprint Post-Launch)

### 4. Language Switcher Not Wired to Router ✅ FIXED
**Size: S** — Fixed in this audit. The `LanguageSwitcher` component now uses next-intl's `useRouter` to navigate between locales.

### 5. Missing Environment Variable Validation
**Size: S** | Reliability

Only `STRIPE_SECRET_KEY` is validated at startup (`lib/stripe.ts`). Other critical env vars (`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_BASE_URL`, `PAYLOAD_SECRET`, `ISSUER_SERVICE_BASE_URL`) are only checked at call sites or not at all.

**Impact:** Confusing runtime errors if env vars are missing.
**Fix:** Add a `lib/env.ts` module that validates all required env vars at build time using `zod` or `t3-env`.

### 6. No CSRF Protection on Server Actions
**Size: M** | Security

Next.js server actions have built-in origin checking, but there is no explicit CSRF token. For payment-sensitive actions, defense-in-depth is warranted.

**Impact:** Low risk given Next.js defaults, but Stripe metadata writes could be abused.
**Fix:** Add `x-action-token` header validation or use Next.js's built-in `serverActions.allowedOrigins` config.

### 7. Issuer Service Response Not Validated
**Size: S** | Security

`lib/issuer-client.ts` line 81 casts the response with `as RedemptionSuccess` without runtime validation. A compromised or misbehaving issuer service could inject unexpected data.

**Impact:** Type safety bypass at a security boundary.
**Fix:** Parse the response through a Zod schema before returning.

### 8. Blog Posts Are Hardcoded ✅ FIXED
**Size: M** | Content

~`lib/data/blog-posts.ts` contains 4 placeholder blog posts.~ **Fixed:** `lib/data/fetch-utils.ts` queries the Payload CMS `blog-posts` and `events` collections at runtime, gracefully falling back to the typed static files if the CMS is empty or unreachable. All frontend pages (`blog`, `events`, `blog/[slug]`, `service`, `feed.xml`) now use these fetch utilities.

---

## P2 — Medium (Address Within 30 Days)

### 9. No Error Boundary on Checkout Components
**Size: S** | UX

The Stripe `EmbeddedCheckout` components in `breakfast-checkout.tsx` and `registration-checkout.tsx` lack React error boundaries. If Stripe.js fails to load, the user sees a white box.

**Impact:** Poor UX on Stripe outages or ad-blocker interference.
**Fix:** Wrap checkout components in an error boundary with a user-friendly fallback message.

### 10. No Retry Logic on Issuer Service Calls
**Size: S** | Reliability

`lib/issuer-client.ts` makes a single `fetch()` with a 10-second timeout. Network blips cause immediate failure.

**Impact:** Intermittent code redemption failures.
**Fix:** Add a single retry with exponential backoff (e.g. 1s delay).

### 11. Several Placeholder Pages Still Empty ✅ FIXED
**Size: M** | Content

~Pages at `/bid`, `/program`, `/merch`, `/prayer`, `/asl` use the `PageShell` placeholder component with "Coming Soon" content.~ **Fixed:** The `InventoryShell` component now accepts a `pageContent` prop, and all five pages display concrete status, logistics, and contact information. Retro games remain accessible as secondary easter eggs.

### 12. Missing `robots.txt`
**Size: XS** | SEO

No `robots.txt` file exists. The dynamic `sitemap.ts` exists but crawlers can't discover it without a robots.txt pointing to it.

**Impact:** Suboptimal search engine indexing.
**Fix:** Add `public/robots.txt` with `Sitemap: https://www.necypaact.com/sitemap.xml`.

### 13. No Structured Data (JSON-LD) on Event Pages
**Size: S** | SEO

A `json-ld.tsx` component exists but is not used on event detail pages. Adding `Event` schema markup would improve search visibility.

**Impact:** Missed rich snippet opportunities in search results.
**Fix:** Add JSON-LD `Event` structured data to the events page.

### 14. Accessibility Panel Doesn't Persist Across Tabs
**Size: S** | UX

Settings are stored in `localStorage`, which is per-origin but each tab reads on mount. If a user changes settings in one tab, the other tab doesn't reflect it until refresh.

**Impact:** Minor inconsistency in multi-tab usage.
**Fix:** Use `StorageEvent` listener to sync across tabs.

---

## P3 — Low (Backlog)

### 15. No Integration Tests for Server Actions
**Size: L** | Quality

Server actions (`actions/registration.ts`, `actions/breakfast.ts`) have no integration tests covering the full action flow with mocked Stripe. The Stripe webhook handler has unit tests; server actions themselves are tested only via validation and rate-limiting utilities.

**Impact:** Regressions in checkout flows may not be caught.
**Fix:** Add integration tests with mocked Stripe client for `startRegistrationCheckout` and `startBreakfastCheckout`.

### 16. Games Lack Tests
**Size: M** | Quality

Seven retro game components (`components/games/`) have no tests. While not business-critical, canvas rendering bugs could cause runtime errors.

**Impact:** Low — games are Easter eggs.
**Fix:** Add smoke tests that verify components mount without errors.

### 17. Meeting Data is Entirely Static
**Size: L** | Maintainability

`lib/data/ypaa-meetings.ts` (48KB) and `lib/data/meetings.ts` contain hardcoded meeting data. Any update requires a code change and deploy.

**Impact:** Meeting info goes stale; non-developers can't update it.
**Fix:** Migrate to a Payload CMS collection or external data source with periodic sync.

### 18. No Image Alt Text Audit for Dynamic Content
**Size: S** | Accessibility

Playwright tests verify alt text on existing pages, but dynamically loaded images (blog post featured images, event flyers) aren't covered.

**Impact:** New content could introduce a11y violations undetected.
**Fix:** Add a11y tests for dynamic content pages (blog posts, individual events).

### 19. `console.error` in Production Server Actions
**Size: XS** | Observability

Server actions use `console.error` for error logging. On Vercel, these go to function logs but have no structured format, alerting, or correlation IDs.

**Impact:** Difficult to debug production issues.
**Fix:** Add a lightweight structured logger (e.g. `pino`) or use Vercel's Log Drains with structured JSON output.

### 20. No Bundle Size Monitoring
**Size: S** | Performance

No automated check prevents bundle size regressions. The shared JS bundle is currently ~87KB (under the 100KB target) but has no CI gate.

**Impact:** Bundle could silently grow past target.
**Fix:** Add `@next/bundle-analyzer` or a size-limit CI check.

---

## Summary

| Priority | Count | Estimated Total Effort |
|----------|-------|----------------------|
| P0 — Critical | 3 | ~L + L + M |
| P1 — High | 5 | ~S + S + M + S + M |
| P2 — Medium | 6 | ~S + S + M + XS + S + S |
| P3 — Low | 6 | ~L + M + L + S + XS + S |

**Most critical next action:** Implement a Stripe webhook handler (P0 #1) and persistent registration storage (P0 #2). Without these, paid registrations have no server-side confirmation and no queryable attendee list.
