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
- [ ] Create a durable first-party source of truth for registrations/orders (Payload Collection).
- [ ] Implement Stripe webhook reconciliation (`app/api/webhooks/stripe/route.ts`).
- [ ] Add lifecycle statuses (pending, paid, failed, refunded, comped, cash, canceled).
- [ ] Validate and normalize all registration input server-side.
- [ ] Normalize email casing.
- [ ] Prevent duplicate paid records from repeated webhooks.
- [ ] Improve success/cancel pages.
- [ ] Add admin reconciliation support.
- [ ] Add tests for webhook idempotency, validation, and product definitions.

### Phase 2 — Cash/free/access-code security
- [ ] Protect sensitive routes (Payload admin auth, or signed token).
- [ ] Add audit logging for every free/cash/comp registration.
- [ ] Add rate limiting for sensitive routes.

### Phase 3 — Production-safe rate limiting
- [x] Replace in-memory-only rate limiting with production-safe storage (e.g., Upstash Redis/Vercel KV) with local fallback.
- [x] Apply to registration, free/cash/access-code submit, contact/newsletter forms.
- [x] Add tests/checks.
- [x] Document env vars.

### Phase 4 — Payload CMS hardening
- [ ] Make access control explicit (public can read published, admin can edit).
- [ ] Add missing roles (admin, editor, registration, viewer).
- [ ] Restrict unsafe Media uploads (SVG handling).
- [ ] Confirm and document production DB behavior/requirements.

### Phase 5 — Static data versus CMS consolidation
- [ ] Identify duplicated content sources (static files vs Payload).
- [ ] Reduce duplication where safe.
- [ ] Add event date validation.
- [ ] Handle archived/past events intentionally.

### Phase 6 — Replace weak placeholder pages
- [ ] Review `/program`, `/asl`, `/merch`, `/bid`, `/prayer`.
- [ ] Ensure they are useful (current status, update date, contact path) and not just placeholders.

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

### [Date: Phase 2 Completed]
- Removed `/cash` local route completely as the cash registration system was moved to a separate repository (`necypaa-ras`).
- Cleaned up obsolete local tests, actions (`free-registration.ts`), and sitemap entries.
- Validated that the remaining `submitAccessCodeRegistration` is protected by the external issuer service and properly rate-limited.
 reconcile checkout completion.
- Added Vitest tests for webhook logic.
@upstash/redis` backed implementation in `lib/rate-limit.ts`.
- Retained the in-memory method as a graceful fallback when Redis credentials aren't provided.
- Refactored calling code to handle the asynchronous API.
- Updated documentation with new `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` environment variables.
 reconcile checkout completion.
- Added Vitest tests for webhook logic.
