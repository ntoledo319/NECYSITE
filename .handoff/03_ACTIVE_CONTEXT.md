# Active Context — NECYPAA XXXVI Website

> **Last Updated:** 2026-03-23
> **Purpose:** Snapshot of exactly where this project stands right now. Updated before every push.

---

## Current Project State

**Phase:** Content filling + polish. Core infrastructure is complete. Convention is Dec 31, 2026.

**Branch:** `main`
**Build status:** Passing (lint, type check, 45 unit tests, production build all green)
**Deployment:** Live at https://www.necypaact.com via Vercel auto-deploy

---

## Latest Changes (This Session — UI Visual Identity Upgrade)

### Framer Motion + Aceternity UI Bespoke Motion System

1. **Motion primitives library** — Created `components/ui/motion-primitives.tsx` with spring configs (gentle/snappy/slow), stagger variants, and bespoke components: `MotionReveal`, `SpotlightCard` (cursor-following glow), `TiltCard` (3D perspective tilt with glare), `AuroraBackground` (ambient gradient blobs), `FloatingElement` (organic float loops), `MagneticButton` (magnetic pull effect), `GrainOverlay` (film grain texture). All respect `prefers-reduced-motion`.

2. **ScrollReveal upgrade** — Replaced IntersectionObserver-based CSS class toggling with Framer Motion spring-physics animations. Same API, smoother feel.

3. **Hero section elevation** — Added `AuroraBackground` for living ambient glow, `FloatingElement` for animated graffiti accents (sparkles, splatters, hex shapes, vortex swirls), `MagneticButton` for CTA buttons, and spring-physics entrance animations on all content elements.

4. **CTA cards elevation** — Wrapped register and hotel cards with `TiltCard` (4° 3D tilt on hover) and `SpotlightCard` (cursor-following glow, purple for register, gold for hotel). CTA buttons wrapped in `MagneticButton`.

5. **Quick facts upgrade** — Staggered spring-physics entrance animation on the 6 fact pills using `staggerContainer`/`staggerChild` variants. Each pill has a `SpotlightCard` with color-matched glow.

6. **Navigation glass morphism** — Header now uses `motion.header` for smooth scroll-state transitions (background, border, shadow). Desktop dropdowns use `AnimatePresence` + spring animations. Mobile drawer/backdrop use `AnimatePresence` for smooth mount/unmount. Enhanced `backdropFilter` with `saturate(1.4)`.

7. **Grain overlay** — Global film-grain texture via `GrainOverlayWrapper` in layout, giving the site a lived-in, hand-printed feel. Respects reduce-motion.

8. **Bespoke CSS tokens** — Added to `globals.css`: button hover glow (`::before` pseudo-elements with gradient blur), hero price badge hover states, organic gradient dividers, fact pill interaction enhancement. Full a11y overrides for reduce-motion, high-contrast, and light mode on all new effects.

**Branch:** `ui-upgrade-26`
**Build status:** Passing (production build green, hooks violation fixed)

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
