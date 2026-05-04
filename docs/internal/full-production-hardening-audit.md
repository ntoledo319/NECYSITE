# Full Production Hardening Audit

## Overview

This document tracks the phased hardening and professionalization of the NECYPAA XXXVI convention website for production readiness.

### Environment & Stack

- **Package Manager**: pnpm (10.2.0)
- **Frameworks**: Next.js 15.4.11, React 19.2.4
- **Styling**: Tailwind CSS (3.4.17) + Radix UI
- **Database/CMS**: Payload CMS 3.79.1 with SQLite adapter (`file:./payload.db` local default)
- **Payments**: Stripe (API version 2025-04-30.basil)
- **Deployment**: Vercel
- **Tests**: Vitest, Playwright (e2e/accessibility)
- **Known Env Vars**: `GOOGLE_CALENDAR_API_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `PAYLOAD_SECRET`, `STRIPE_MCP_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `VERCEL_OIDC_TOKEN`

---

## Phased Todo List & Progress

### Phase 1 — Payment and registration hardening

- [x] Create a durable first-party source of truth for registrations/orders (Payload Collection).
- [x] Implement Stripe webhook reconciliation (`app/api/webhooks/stripe/route.ts`).
- [x] Add lifecycle statuses (pending, paid, failed, refunded, comped, cash, canceled).
- [x] Validate and normalize all registration input server-side.
- [x] Normalize email casing.
- [x] Prevent duplicate paid records from repeated webhooks.
- [x] Improve success/cancel pages.
- [x] Add admin reconciliation support (Payload admin panel + `Registrations` collection).
- [x] Add tests for webhook idempotency, validation, and product definitions.

### Phase 2 — Cash/free/access-code security

- [x] Removed `/cash` public route completely (cash registration moved to separate `necypaa-ras` repository).
- [x] `submitAccessCodeRegistration` is protected by external issuer service + rate limiting.
- [x] Rate limiting applied to all public mutations (checkout, access-code redemption, contact forms).
- [ ] Add audit logging for every free/cash/comp registration (deferred to external issuer system).

### Phase 3 — Production-safe rate limiting

- [x] Replace in-memory-only rate limiting with production-safe storage (e.g., Upstash Redis/Vercel KV) with local fallback.
- [x] Apply to registration, free/cash/access-code submit, contact/newsletter forms.
- [x] Add tests/checks.
- [x] Document env vars.

### Phase 4 — Payload CMS hardening

- [x] Make access control explicit (public can read published, admin can edit).
- [x] Add missing roles (admin, editor, registration, viewer).
- [x] Restrict unsafe Media uploads (SVG handling).
- [x] Confirm and document production DB behavior/requirements.

### Phase 5 — Static data versus CMS consolidation

- [x] Identify duplicated content sources (static files vs Payload).
- [x] Reduce duplication where safe — created typed `lib/data/fetch-utils.ts` with CMS-first + static fallback.
- [x] Add event date validation (`isValidEventDate`, `isPastEvent` heuristics).
- [x] Handle archived/past events intentionally (upcoming vs past categorization in `getEvents`).

### Phase 6 — Replace weak placeholder pages

- [x] Review `/program`, `/asl`, `/merch`, `/bid`, `/prayer`.
- [x] Ensure they are useful (current status, update date, contact path) and not just placeholders.

### Phase 7 — Design system cleanup

- [ ] Split giant CSS if appropriate.
- [ ] Separate brand tokens from semantic tokens.
- [ ] Reduce `!important` usage.
- [ ] Remove dead or duplicate CSS.
- [ ] Audit consistency (buttons, cards, forms, nav, etc.).

### Phase 8 — Performance and asset diet

- [ ] Identify unused giant images.
- [ ] Convert oversized images to WebP/AVIF.
- [ ] Move source/original/backup images out of public deployment.
- [ ] Create `docs/assets-policy.md`.

### Phase 9 — Client/server component audit

- [ ] Remove unnecessary `"use client"` components.
- [ ] Reduce unnecessary Framer Motion usage.
- [ ] Respect `prefers-reduced-motion`.

### Phase 10 — Accessibility hardening

- [ ] Ensure all interactive elements are keyboard accessible.
- [ ] Ensure correct ARIA and keyboard behavior for custom groups.
- [ ] Modals/drawers trap focus, close on Escape, return focus.
- [ ] Form errors clearly associated.
- [ ] Create `docs/accessibility-qa-checklist.md`.

### Phase 11 — SEO / metadata / feed / sitemap

- [ ] Fix sitemap to match actual routes/locales.
- [ ] Add hreflang/alternates.
- [ ] Fix RSS/feed links.
- [ ] Ensure canonical URLs are correct.

### Phase 12 — i18n reality check

- [ ] Identify hardcoded English in localized routes.
- [ ] Move important public copy to translation files/CMS or document incompleteness.
- [ ] Make locale switching consistent.

### Phase 13 — TypeScript / lint / config hardening

- [ ] Fix React/runtime/type mismatches.
- [ ] Remove unnecessary `@ts-ignore` and `@ts-expect-error`.
- [ ] Tighten TypeScript and ESLint rules.

### Phase 14 — Tests and CI

- [ ] Make current tests pass.
- [ ] Add tests for critical flows.
- [ ] Add Playwright smoke tests.
- [ ] Add GitHub Actions CI.

### Phase 15 — Repo hygiene and docs

- [ ] Move internal/agent docs under `docs/internal`.
- [ ] Add `.gitignore` entries for agent settings/junk.
- [ ] Update README and all required docs.

### Phase 16 — Final UX pass

- [ ] Ensure every page has clear purpose and CTAs.
- [ ] No dead-ends or fake urgency.
- [ ] Preserve emotional character.

---

## Log of Changes

### [Date: Initial Setup]

- Repo inspected.
- `hardening/full-production-audit-fix` branch created.
- Audit document initialized.

### [Date: Phase 1 Completed]

- Created `Registrations` Payload CMS collection.
- Updated server actions to insert initial records.
- Implemented Stripe webhook at `app/api/webhooks/stripe/route.ts` to reconcile checkout completion.
- Added Vitest tests for webhook logic.

### [Date: Phase 2 Completed]

- Removed `/cash` local route completely as the cash registration system was moved to a separate repository (`necypaa-ras`).
- Cleaned up obsolete local tests, actions (`free-registration.ts`), and sitemap entries.
- Validated that the remaining `submitAccessCodeRegistration` is protected by the external issuer service and properly rate-limited.

### [Date: Phase 3 Completed]

- Replaced in-memory rate limiting with `@upstash/redis` backed implementation in `lib/rate-limit.ts`.
- Retained the in-memory method as a graceful fallback when Redis credentials aren't provided.
- Refactored calling code to handle the asynchronous API.
- Updated documentation with new `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` environment variables.

### [Date: Phase 4 Completed]

- Added explicit read/create/update/delete access controls to all Payload collections (`Users`, `Media`, `Events`, `BlogPosts`, `FAQ`, `Registrations`).
- Added `admin`, `editor`, `registration`, and `viewer` roles to `Users`.
- Removed `image/svg+xml` from `Media` allowed mime types to prevent malicious SVG uploads.
- Documented the Vercel ephemeral storage limitation in `01_SYSTEM_ARCHITECTURE.md`, recommending Turso (libSQL) via `DATABASE_URI` for persistent production SQLite.

### [Date: Phase 5 Completed]

- Kept strongly-typed static files (`lib/data/blog-posts.ts`, `lib/data/events.ts`) to act as safe fallbacks.
- Created `lib/data/fetch-utils.ts` to dynamically fetch events and blog posts from Payload CMS, gracefully falling back to static data if the database is unpopulated or wiped.
- Added event date validation and dynamic upcoming/past categorization heuristics based on the parsed dates.
- Updated all frontend components (`blog/page.tsx`, `events/page.tsx`, `blog/[slug]/page.tsx`, `service/page.tsx`, `feed.xml`) to use the new typed fetch utilities instead of static imports.

### [Date: Phase 6 Completed]

- Refactored `InventoryShell` component to accept a `pageContent` prop that replaces the default "coming soon" placeholder text.
- Kept the retro games accessible via the "Inventory in Progress" button as an easter egg.
- Updated `/program`, `/asl`, `/merch`, `/bid`, and `/prayer` pages with concrete, useful information regarding current status, logistics, and contact paths.
