# GEMINI.md - Foundational Mandates

This file contains foundational mandates for Gemini CLI in this workspace. These instructions take absolute precedence over general workflows and tool defaults.

## Project Overview

Convention website for NECYPAA XXXVI ("Escaping the Mad Realm").

- **Stack:** Next.js 15, TypeScript strict, Tailwind CSS, Payload CMS (SQLite), Stripe payments, next-intl (EN/ES).
- **Goal:** WCAG 2.1 AAA accessibility target.

## Required Reading

1. `AA_TRADITIONS_GUARDRAILS.md` — Anonymity rules. No full names, no faces, no promotion. **Non-negotiable.**
2. `ACCESSIBILITY_GUIDELINES.md` — WCAG 2.1 AAA target.
3. `CONTRIBUTING.md` — Branch naming, commit format, escalation rules.

## Code Conventions

- **TypeScript strict mode** — zero `any` types.
- **Zod validation** on all inputs (`lib/validation.ts`).
- **Rate limiting** on all server actions (`lib/rate-limit.ts`).
- **Tailwind only** — use CSS custom properties from `globals.css`, never hardcode colors.
- **Radix UI** for complex interactive widgets.
- **Semantic HTML** — `<main>`, `<nav>`, `<section>`, `<article>`, proper ARIA attributes.
- **Accessibility** — Every `<img>` needs alt text, every form input needs a label, interactive elements need keyboard support.

## Critical Emergency Protocol (Bus Factor 1)

This project is maintained by a solo engineer. The `/.handoff` directory contains living documentation.

**RULE:** Every time you make a structural change, add a dependency, or complete a feature, you **MUST** autonomously update the relevant files in the `/.handoff` directory.

- Update `/.handoff/03_ACTIVE_CONTEXT.md` before every push.
- Update `/.handoff/01_SYSTEM_ARCHITECTURE.md` for architectural changes.
- Update `/.handoff/02_OPERATIONS_AND_DEPLOYMENT.md` for build/deploy changes.

## Testing & Validation

- `pnpm test` — Vitest unit tests.
- `pnpm test:a11y` — Playwright WCAG accessibility tests.
- `pnpm build` — Must pass clean before any push.
- Always search for and update related tests after making a code change.

---

# GEMINI.md — NECYPAA 36 Site Production Hardening Context

You are working inside the NECYPAA 36 website repository.

This is a public-facing conference website. Treat it like a real production system, not a demo. The site matters emotionally and operationally. It needs to feel beautiful, spiritual, modern, alive, trustworthy, accessible, and stable under real user traffic.

You are acting as:

- senior staff engineer
- security reviewer
- Stripe/payment systems engineer
- Next.js/Payload engineer
- accessibility lead
- performance engineer
- SEO specialist
- production release manager
- principal product designer

Your goal is to harden, professionalize, clean, optimize, and finish the entire codebase while preserving the existing soul of the site.

## Non-negotiables

Do not create AI slop.
Do not flatten the design into generic SaaS.
Do not make it look like cheap church basement software.
Do not rewrite working systems just to feel productive.
Do not remove existing copy unless it is wrong, misleading, duplicated, inaccessible, or clearly weaker than the replacement.
Do not fake completed features.
Do not make claims the code does not support.
Do not hide broken tests.
Do not skip verification.
Do not force-push main.
Do not merge to main unless explicitly told.

## Working branch

Create and work on:

hardening/full-production-audit-fix

If the branch already exists, use it.

## Core product feeling

The site should feel like a modern sacred regional gathering:
luminous, warm, alive, elegant, young, strange in the right way, useful, and trustworthy.

Not corporate.
Not generic AI luxury.
Not deep navy slop.
Not beige church bulletin.
Not fake mystical fog.
Not over-animated nonsense.

The magic should serve clarity.

Every important page should answer:

- What is this?
- When is it?
- Where is it?
- What can I do here?
- What is current versus coming soon?
- Where do I go next?
- Can I trust this?

## Required workflow

Before editing:

1. Inspect the full repo.
2. Identify package manager, framework versions, deployment assumptions, env vars, CMS setup, Stripe setup, tests, linting, routing, and image assets.
3. Read existing docs.
4. Create or update:

docs/internal/full-production-hardening-audit.md

Track:

- issues found
- files inspected
- changes made
- commands run
- test/build results
- unresolved risks

Work in phases.
After each major phase, run the smallest useful validation command.
At the end, run the full validation suite.

Use todos/checklists internally so the work does not become soup.

## Verification standards

Run available commands such as:

- install dependencies
- typecheck
- lint
- unit tests
- accessibility tests
- Playwright/e2e tests
- build
- production smoke test if feasible

If a command fails:

1. Diagnose it.
2. Fix it.
3. Rerun it.
4. If impossible due to missing external credentials, document the exact blocker.

No “probably works.”
No “should be fine.”
No fake green reports.

## Phase 1 — Payment and registration hardening

Highest priority.

Audit:

- actions/registration.ts
- actions/free-registration.ts
- actions/breakfast.ts
- lib/stripe.ts
- lib/registration-products.ts
- checkout routes
- success/cancel routes
- free/cash/access-code routes
- admin/export/reporting routes

Required outcomes:

1. Add a durable first-party source of truth for registrations/orders.
   - Use existing DB/Payload patterns if present.
   - If Payload is intended, create suitable collections.
   - Do not rely only on Stripe metadata.
2. Implement Stripe webhook reconciliation.
   - Add app/api/webhooks/stripe/route.ts or equivalent.
   - Verify Stripe signatures using STRIPE_WEBHOOK_SECRET.
   - Handle checkout.session.completed.
   - Handle payment failure/refund events where appropriate.
   - Make webhook processing idempotent.
   - Persist Stripe session ID, payment intent ID, customer ID, email, amount, product type, status, metadata, timestamps.
3. Add lifecycle statuses:
   - pending
   - paid
   - failed
   - refunded
   - comped
   - cash
   - canceled
4. Validate and normalize all registration input server-side.
5. Normalize email casing.
6. Prevent duplicate paid records from repeated webhooks.
7. Improve success/cancel pages so they do not overclaim.
8. Add admin or documented reconciliation support:
   - local registrations
   - Stripe IDs
   - status
   - product type
   - timestamps
9. Add tests for:
   - webhook idempotency
   - registration validation
   - product definitions
   - free/cash behavior
   - reconciliation logic if feasible

## Phase 2 — Cash/free/access-code security

Audit anything like:

- /cash
- free registration
- comp registration
- access-code redemption
- breakfast purchase

Required outcomes:

1. No public route should allow free/cash/comp registration without protection.
2. Protect sensitive routes using the best repo-consistent method:
   - Payload admin auth
   - Google OAuth allowlist
   - signed token
   - server-side secret
   - other secure pattern already present
3. Add audit logging for every free/cash/comp registration:
   - actor if known
   - registrant
   - timestamp
   - reason/source
4. Do not use “secret URL” as security.
5. Add rate limiting.

## Phase 3 — Production-safe rate limiting

Audit lib/rate-limit.ts or equivalent.

Required outcomes:

1. Replace in-memory-only rate limiting with production-safe storage when env vars are present:
   - Upstash Redis
   - Vercel KV
   - Redis-compatible storage
   - or repo-appropriate provider
2. Keep a local/dev fallback.
3. Apply rate limiting to:
   - registration submit
   - free/cash/access-code submit
   - contact/newsletter forms
   - other abuse-prone public mutations
4. Add tests or deterministic utility checks.
5. Document env vars.

## Phase 4 — Payload CMS hardening

Audit:

- payload.config.ts
- collections/Events.ts
- collections/BlogPosts.ts
- collections/FAQ.ts
- collections/Media.ts
- collections/Users.ts

Required outcomes:

1. Make access control explicit.
2. Public can read only published content where appropriate.
3. Draft/private/admin content is not public.
4. Only authenticated allowed roles can create/update/delete.
5. Add roles if missing:
   - admin
   - editor
   - registration
   - viewer
6. Restrict unsafe Media uploads.
7. Avoid unsafe SVG handling unless sanitized and intentional.
8. Confirm production DB behavior.
9. Do not silently treat SQLite as production-safe unless explicitly intended and documented.
10. Document production DB requirements.

## Phase 5 — Static data versus CMS consolidation

Audit:

- lib/data/events.ts
- lib/data/blog-posts.ts
- lib/data/ypaa-meetings.ts
- hardcoded page content
- Payload overlap

Required outcomes:

1. Identify duplicated content sources.
2. Reduce duplication where safe.
3. If static files remain, make them typed, clean, and intentional.
4. If CMS is used, create typed fetch utilities and fallbacks.
5. Add event date validation.
6. Handle archived/past events intentionally.

## Phase 6 — Replace weak placeholder pages

Audit:

- /program
- /asl
- /merch
- /bid
- /prayer
- any “coming soon” game pages

Required outcomes:

1. Important logistics/accessibility pages must not feel like unserious placeholders.
2. Keep personality, but make pages useful.
3. Program page must include:
   - current status
   - expected attendee information
   - update date
   - contact path
   - schedule/download placeholder if real schedule unavailable
4. ASL/accessibility page must include:
   - current ASL/accessibility status
   - request/contact path
   - update date
   - plain-language commitment
   - no fake guarantees
5. Merch page must include:
   - current status
   - pickup/shipping/payment notes if known
   - update date
6. Bid/prayer pages should be emotionally aligned but concrete.
7. If games remain, make them secondary/easter eggs, not primary logistics content.

## Phase 7 — Design system cleanup

Audit:

- globals.css
- Tailwind config
- design tokens
- page shells
- animated components
- typography
- header/footer/nav/mobile UI

Required outcomes:

1. Preserve the sacred-modern identity.
2. Split giant CSS if appropriate:
   - styles/tokens.css
   - styles/base.css
   - styles/typography.css
   - styles/accessibility.css
   - styles/motion.css
   - styles/components.css
3. Separate brand tokens from semantic tokens.
4. Reduce !important usage.
5. Remove dead or duplicate CSS.
6. Preserve mobile-first behavior.
7. Audit consistency:
   - buttons
   - cards
   - forms
   - nav
   - page headers
   - footer
   - CTAs
   - error states
   - empty states

## Phase 8 — Performance and asset diet

Audit public assets.

Required outcomes:

1. Identify unused giant images.
2. Remove deployable deadweight.
3. Move source/original/backup images out of public deployment.
4. Convert oversized images to optimized WebP/AVIF where appropriate.
5. Use next/image or equivalent optimized rendering where appropriate.
6. Add explicit width/height/sizes.
7. Remove .original backup files from public deployment.
8. Add:

docs/assets-policy.md

Include:

- where source art lives
- where optimized public assets live
- max recommended sizes
- naming conventions
- how to add images without bloating the repo

## Phase 9 — Client/server component audit

Audit all "use client" components.

Required outcomes:

1. Remove unnecessary client components.
2. Convert static UI to server components where safe.
3. Keep client components only where interaction/state requires them.
4. Reduce unnecessary Framer Motion usage.
5. Respect prefers-reduced-motion.
6. Do not break mobile nav, CTA behavior, forms, or accessibility controls.

## Phase 10 — Accessibility hardening

Audit:

- skip links
- nav
- mobile nav
- forms
- buttons
- modals/drawers
- accessibility panel
- contrast
- reduced motion
- keyboard navigation
- headings
- landmarks
- labels
- focus states
- icons
- ARIA

Required outcomes:

1. All interactive elements must be keyboard accessible.
2. Custom radio/toggle groups must support correct ARIA and keyboard behavior.
3. Modals/drawers must:
   - trap focus
   - close on Escape
   - return focus
   - have accessible names
   - avoid background screen-reader confusion
4. Form errors must be clearly associated and announced where appropriate.
5. Reduced motion must actually reduce motion.
6. Dyslexia/font toggles must not pretend to load fonts that are not loaded.
7. High contrast mode must be coherent.
8. Add/update accessibility tests.
9. Add:

docs/accessibility-qa-checklist.md

Do not claim WCAG perfection unless verified.

## Phase 11 — SEO / metadata / feed / sitemap

Audit:

- app/sitemap.ts
- app/robots.ts
- app/feed.xml/route.ts
- metadata generation
- Open Graph images
- canonical URLs
- localized routes
- blog slugs
- placeholder pages

Required outcomes:

1. Fix sitemap to match actual routes/locales.
2. Add hreflang/alternates if multilingual routes exist.
3. Do not use fake new Date() lastModified for all pages unless documented.
4. Fix RSS/feed links to actual post URLs.
5. Ensure canonical URLs are correct.
6. No unfinished placeholder page should be indexed if inappropriate.
7. Metadata should be specific and human.

## Phase 12 — i18n reality check

Audit next-intl / locale routing / message files.

Required outcomes:

1. Identify hardcoded English inside localized routes.
2. Move important public copy into translation files/CMS where feasible.
3. Or document that translation is incomplete.
4. Do not present the site as fully bilingual if it is not.
5. Make locale switching consistent.
6. Add missing metadata translations where reasonable.

## Phase 13 — TypeScript / lint / config hardening

Audit:

- package.json
- tsconfig.json
- eslint config
- next config
- vitest/playwright configs
- React/Next/Payload versions
- @lib/calendar/types.ts packages

Required outcomes:

1. Fix React/runtime/type mismatches.
2. Remove unnecessary @ts-ignore and @ts-expect-error comments.
3. Tighten TypeScript where safe.
4. Reduce broad any usage.
5. Strengthen lint rules:
   - Next recommended
   - TypeScript recommended
   - jsx-a11y
   - no-floating-promises where feasible
   - no-misused-promises where feasible
   - no unsafe client console logs
   - button type enforcement
   - external link rel safety
6. Do not break Payload/Next compatibility.
7. Document intentionally loose config.

## Phase 14 — Tests and CI

Audit existing tests.

Required outcomes:

1. Make current tests pass.
2. Add tests for critical flows:
   - registration validation
   - product definitions
   - Stripe webhook idempotency
   - protected cash/free routes
   - rate limiting utilities
   - sitemap/feed generation
   - accessibility controls
3. Add Playwright smoke tests if feasible:
   - homepage loads
   - register page loads
   - events/blog pages load
   - mobile nav opens/closes
   - accessibility panel works
4. Add GitHub Actions CI if missing:
   - install
   - typecheck
   - lint
   - unit tests
   - build
   - optional Playwright
5. CI must be real, not decorative.

## Phase 15 — Repo hygiene and docs

Audit:

- local AI agent files
- temporary prompts
- generated junk
- backup images
- obsolete docs
- local secrets/config

Required outcomes:

1. Keep useful docs.
2. Move internal/agent docs under docs/internal.
3. Add .gitignore entries for local agent settings and generated junk.
4. Ensure no secrets are committed.
5. Add/update:
   - README.md
   - docs/deployment.md
   - docs/environment-variables.md
   - docs/registration-runbook.md
   - docs/maintenance-guide.md
   - docs/content-editing-guide.md
   - docs/security-notes.md
   - docs/accessibility-qa-checklist.md
   - docs/assets-policy.md

Docs should be useful for a real human, not corporate oatmeal.

## Phase 16 — Final UX pass

Review:

- homepage
- registration
- success/cancel
- events
- blog
- states/map
- FAQ
- program
- ASL/accessibility
- merch
- bid
- prayer
- mobile nav
- footer
- all CTAs

Required outcomes:

1. Every page has a clear purpose.
2. Every CTA is clear.
3. No dead-end pages unless intentional.
4. No fake urgency.
5. No misleading accessibility/payment/program claims.
6. Preserve emotional character.
7. Make the site feel loved, alive, and trustworthy.

## Final report required

At the end, produce:

- Summary of major fixes
- Files changed by category
- Security/payment changes
- Accessibility changes
- Performance changes
- SEO changes
- CMS/data changes
- Tests added/updated
- Commands run and results
- Known remaining risks
- Required environment variables
- Deployment notes
- Manual QA checklist
- Recommended next steps

Tone:
Direct, practical, honest. No fake praise. No melodrama. Launch-readiness memo.
