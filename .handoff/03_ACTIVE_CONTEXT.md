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

## Latest Changes (This Session — Registration Flow Visual Fix)

### Registration Pages: Inline Style Purge + Design Token Refactor (Complete)

Root cause: commit `22a4200` (comprehensive UX/UI overhaul) introduced inline `style` attributes across all registration pages, bypassing the CSS theming system. These broke light mode, high contrast, and reduce-motion accessibility overrides.

**What was fixed:**

1. **globals.css** — Added ~280 lines of new CSS classes for registration flow surfaces:
   - `.nec-reg-card`, `.nec-reg-subcard`, `.nec-success-card-purple`, `.nec-success-card-orange`, `.nec-reg-accent-orange`, `.nec-reg-help-card`, `.nec-breakfast-info`
   - `.nec-step-active`, `.nec-step-inactive`, `.nec-step-badge-purple`, `.nec-step-badge-orange`
   - `.nec-success-icon-purple`, `.nec-success-icon-orange`
   - `.nec-heading-shadow`, `.nec-accent-bar`
   - `.nec-stripe-embed` — gradient transition from dark theme to Stripe's white embed
   - All classes have `[data-color-mode="light"]` and `.a11y-high-contrast` overrides.

2. **Page refactors** — Replaced all inline `style` attributes with CSS classes:
   - `register/page.tsx` — content card, step indicators, hotel CTA, heading shadow
   - `cash/page.tsx` — same treatment
   - `register/success/page.tsx` — accent bar, success card, icon ring, step badges, breakfast cross-sell, help card
   - `breakfast/page.tsx` — background, heading shadow, info box
   - `breakfast/success/page.tsx` — same treatment as register success with orange accents

3. **Sub-component refactors** — Replaced hardcoded Tailwind grays and `text-pink-400` with design tokens:
   - `registration-form.tsx` — `border-gray-700` → `border-[var(--nec-border)]`, `text-pink-400` → `text-[var(--nec-pink)]`, inline error styles → classes
   - `policy-agreement.tsx` — `text-pink-400` → `text-[var(--nec-pink)]`, container → `.nec-reg-subcard`
   - `registration-checkout.tsx` — summary card → `.nec-reg-subcard`, Stripe embed → `.nec-stripe-embed`
   - `breakfast-checkout.tsx` — error/loading states themed (was `bg-white`/`text-gray-600`), all sub-cards → `.nec-reg-subcard`, Stripe → `.nec-stripe-embed`, added spinner to loading state
   - `registration-confirmation.tsx` — all inline `style={{ color: "var(--nec-muted)" }}` → `text-[var(--nec-muted)]` classes, cards → `.nec-reg-subcard`
   - `checkout/access-code-checkout.tsx` — card → `.nec-reg-subcard`
   - `checkout/breakfast-add-ons.tsx` — card → `.nec-reg-subcard`
   - `checkout/scholarship-attribution.tsx` — card → `.nec-reg-subcard`

4. **Entrance animations** — Added Framer Motion staggered fade-up to both success pages:
   - `register/success/page.tsx` — staggerContainer + fadeUp variants with `SPRING_GENTLE`
   - `breakfast/success/page.tsx` — same treatment
   - Both respect `useReducedMotion` (animations skip entirely)

**Branch:** `ui-upgrade-26`
**Build status:** Passing (production build green, all routes compile)

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
