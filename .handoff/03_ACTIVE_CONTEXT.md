# Active Context — NECYPAA XXXVI Website

> **Last Updated:** 2026-03-26
> **Purpose:** Snapshot of exactly where this project stands right now. Updated before every push.

---

## Current Project State

**Phase:** Content filling + polish. Core infrastructure is complete. Convention is Dec 31, 2026.

**Branch:** `main`
**Build status:** Passing (lint, type check, 45 unit tests, production build all green)
**Deployment:** Live at https://www.necypaact.com via Vercel auto-deploy

---

## Latest Changes (This Session — System-Wide UI Pass)

### Site-Wide Inline Style Purge + Design Token Unification (Complete)

Comprehensive audit and fix of all hardcoded Tailwind colors (`text-gray-*`, `text-purple-400`, `text-pink-400`), inline `style={{ color }}` attributes, and inline `rgba()` backgrounds across every frontend page and component. All replaced with CSS utility classes using design tokens, with full light mode and high-contrast overrides.

**What was fixed:**

1. **globals.css** — Added ~450 lines of new CSS utility classes in two phases:
   - **Registration flow surfaces** (phase 1): `.nec-reg-card`, `.nec-reg-subcard`, `.nec-success-card-purple`, `.nec-success-card-orange`, `.nec-reg-accent-orange`, `.nec-reg-help-card`, `.nec-breakfast-info`, `.nec-step-active`, `.nec-step-inactive`, `.nec-step-badge-purple`, `.nec-step-badge-orange`, `.nec-success-icon-purple`, `.nec-success-icon-orange`, `.nec-heading-shadow`, `.nec-accent-bar`, `.nec-stripe-embed`
   - **Site-wide surfaces** (phase 2): `.nec-featured-card`, `.nec-icon-badge` (+ `-pink`, `-gold`), `.nec-pill` (+ `-subtle`, `-pink`), `.nec-cta-accent`, `.nec-gradient-card`, `.nec-statement-card`, `.nec-error-icon`, `.nec-section-label`, `.nec-glow-blob`
   - All classes have `[data-color-mode="light"]` and `.a11y-high-contrast` overrides.

2. **Registration pages** (phase 1):
   - `register/page.tsx`, `cash/page.tsx`, `register/success/page.tsx`, `breakfast/page.tsx`, `breakfast/success/page.tsx` — all inline styles → CSS classes

3. **Registration components** (phase 1):
   - `registration-form.tsx`, `policy-agreement.tsx`, `registration-checkout.tsx`, `breakfast-checkout.tsx`, `registration-confirmation.tsx`, `checkout/access-code-checkout.tsx`, `checkout/breakfast-add-ons.tsx`, `checkout/scholarship-attribution.tsx`

4. **Content pages** (phase 2 — this session):
   - `events/page.tsx` — `text-gray-300` → `text-[var(--nec-text)]`, inline rgba → `.nec-featured-card`, `.nec-icon-badge`, `.nec-pill`, `.nec-glow-blob`
   - `service/page.tsx` — same treatment, MAL card → `.nec-featured-card`
   - `accessibility/page.tsx` — all `style={{ color }}` → className, `.nec-gradient-card`, `.nec-statement-card`, `.nec-section-label`
   - `journey/page.tsx` — all `style={{ color }}` → className, pills → `.nec-pill-subtle`, `.nec-pill-pink`
   - `blog/page.tsx` + `blog/[slug]/page.tsx` — all `style={{ color }}` → className
   - `error.tsx` — icon ring → `.nec-error-icon`, colors → className
   - `not-found.tsx` — CTA → `.nec-cta-accent`, glow → `.nec-glow-blob`, colors → className
   - `states/page.tsx` — `text-gray-300` → `text-[var(--nec-text)]`

5. **Components**:
   - `page-shell.tsx` — `text-purple-400` → `text-[var(--nec-purple)]`, `text-pink-400` → `text-[var(--nec-pink)]`, muted text → className

6. **Entrance animations** — Added Framer Motion staggered fade-up to both success pages (respects `useReducedMotion`)

**Result:** Zero `text-gray-*`, `text-purple-400`, or `text-pink-400` hardcoded classes remain. All color styles use design tokens. All surfaces have light mode and high-contrast overrides.

**Branch:** `ui-upgrade-26`
**Build status:** Passing (production build green, all routes compile, zero lint errors)

---

## Recent Commits (Pre-Session)

```
4c0117d feat(events): populate past events + redesign homepage section
3bf7aa5 fix(meta): use badge image for social sharing preview
fdf3e5c refactor(states): tabbed layout to prevent resource burial
861bc77 fix(meetings): replace unicode escape sequences with actual characters
dabf354 fix(meetings): handle empty city/day/time in meeting cards gracefully
9d64cbf feat(meetings): integrate YPAA + Young Persons Al-Anon meeting directories
22a4200 style: comprehensive UX/UI design overhaul
```

---

## Features: Complete vs In-Progress vs Placeholder

### Complete (Real Content + Functionality)
- Homepage (hero, quick facts, CTA, YPAA narrative, events preview, meetings)
- Registration (3-step flow: info → policy → Stripe checkout)
- Breakfast tickets (standalone Stripe checkout)
- Free/cash registration (Stripe customer record)
- Access code redemption (issuer service integration)
- FAQ page (CMS-backed)
- Events page (upcoming + past events)
- Blog (index + detail pages — uses static data, CMS integration pending)
- States/meeting directory (interactive map + 13 states + DC)
- Al-Anon resources page
- Accessibility statement + 6-mode panel
- Bilingual support (EN/ES with next-intl routing)
- Anonymous feedback form

### Placeholder Pages (PageShell "Coming Soon")
- `/bid` — How to bid for next convention
- `/program` — Convention program/schedule
- `/merch` — Merchandise
- `/prayer` — Prayer/meditation
- `/asl` — ASL resources
- `/service` — Service committee opportunities

---

## Known Critical Bugs

**None currently.** Last bug fix was `4c0117d` (past events rendering).

---

## Known Critical Gaps (P0 — Fix Before Launch)

1. **No Stripe webhook handler** — If a user closes browser mid-checkout, payment succeeds on Stripe but the site has no record. Need `app/api/webhooks/stripe/route.ts`.

2. **No persistent registration storage** — Registrations exist only as Stripe customer metadata. Need a `Registrations` Payload CMS collection.

3. **Rate limiter is per-instance** — In-memory `Map` resets on Vercel cold starts. Replace with Vercel KV for production.

See `docs/tech-debt-and-gaps.md` for the full prioritized list (20 items, P0–P3).

---

## Active Dependencies on External Systems

| System | Status | Notes |
|--------|--------|-------|
| **Stripe** | Active (test mode for dev, live for prod) | Keys in Vercel env vars |
| **Issuer Service** | Optional | Only needed for access code flow |
| **Vercel** | Active | Auto-deploy on `main` |
| **Google Fonts** | Active | Loaded via `<link>` in layout |

---

## What a New Developer Should Do First

1. Read `AA_TRADITIONS_GUARDRAILS.md` — The rules about anonymity and tone are non-negotiable.
2. Read `ACCESSIBILITY_GUIDELINES.md` — Every component must be WCAG 2.1 AA minimum.
3. Follow `docs/onboarding.md` for environment setup.
4. Read `docs/architecture.md` for how the system fits together.
5. Run `pnpm dev`, `pnpm test`, `pnpm build` to verify your setup.
6. Check `docs/tech-debt-and-gaps.md` for the highest-priority work items.
