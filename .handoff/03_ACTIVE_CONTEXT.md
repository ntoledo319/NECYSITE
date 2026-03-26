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

## Latest Changes (This Session — UI Visual Identity Upgrade, Phase 2)

### Framer Motion + Aceternity UI Bespoke Motion System (Complete)

**Phase 1 (previous session):**
1. **Motion primitives library** — `components/ui/motion-primitives.tsx` with spring configs, stagger variants, and bespoke components: `MotionReveal`, `SpotlightCard`, `TiltCard`, `AuroraBackground`, `FloatingElement`, `MagneticButton`, `GrainOverlay`. All respect `prefers-reduced-motion`.
2. **ScrollReveal** — Framer Motion spring-physics replacing IntersectionObserver.
3. **Hero section** — `AuroraBackground`, `FloatingElement` accents, `MagneticButton` CTAs.
4. **CTA cards** — `TiltCard` + `SpotlightCard` wrapping.
5. **Quick facts** — Staggered spring entrance + `SpotlightCard` per pill.
6. **Navigation** — Glass morphism with `motion.header`, `AnimatePresence` dropdowns/drawer.
7. **Grain overlay** — Global film-grain via `GrainOverlayWrapper`.
8. **Bespoke CSS tokens** — Button glow, price badge hover, organic dividers, fact pill enhancement, full a11y overrides.

**Phase 2 (previous session) — Total transformation:**
9. **YPAA Narrative section** — Staggered timeline step reveals, spotlight highlight chips, spring entrance on Welcome Home card, `MagneticButton` on Register/Learn More CTAs.
10. **Business Meeting section** — `SpotlightCard` on meeting card, `MagneticButton` on Zoom link, staggered entrance for date/time detail rows.
11. **Events Preview section** — Motion header entrance, `SpotlightCard` on featured upcoming event, staggered past events scroll strip.
12. **Site Footer** — Converted to client component. Animated gradient top bar (scaleX reveal), staggered 4-column entrance with `staggerContainer`/`staggerChild`.
13. **Mobile CTA Bar** — `AnimatePresence` spring entrance/exit from bottom, replacing CSS transition.
14. **Character Divider** — Converted to client component. Replaced CSS `character-float` with `FloatingElement` (spring-physics bob). Gradient lines use `motion.div` scaleX entrance with directional `transformOrigin`.
15. **FAQ Accordion** — Radix `asChild` pattern to wrap each `Accordion.Item` in `motion.div` with staggered entrance variants.
16. **Homepage ambient blobs** — Extracted to `components/ui/ambient-blobs.tsx` client component. Three vortex glow blobs wrapped in `FloatingElement` with offset drift (12–16s cycles, staggered delays).
17. **Purpose Section** — Converted to client component. Staggered pillar card entrance, `SpotlightCard` on first-timer callout.
18. **Page Shell** — Converted to client component. `motion.div` entrance on page header, `FloatingElement` on portal art, `MagneticButton` on "Back to the Portal" CTA.

**Phase 3 (this session) — Cohesion & polish layer:**
19. **Page transition wrapper** — `components/ui/page-transition.tsx` client component using Framer Motion `motion.div` keyed by `pathname` for fade+slide entrance on every route change.
20. **Scroll progress indicator** — `components/ui/scroll-progress.tsx` — thin gradient bar (purple→pink→gold) fixed at top of viewport, spring-dampened `scaleX` tracking `scrollYProgress`. Hidden when reduce-motion is active.
21. **Back-to-top FAB** — `components/ui/back-to-top.tsx` — floating button appears after 600px scroll, spring entrance/exit via `AnimatePresence`, keyboard accessible with `aria-label`.
22. **Custom 404 page** — `app/[locale]/(frontend)/not-found.tsx` — themed "Lost in the Mad Realm" page with Cheshire Cat portal art (`FloatingElement`), `MagneticButton` back-to-home link.
23. **Blog cards** — `SpotlightCard` wrapper with category-matched glow color. Removed CSS `animationDelay` in favor of Framer Motion stagger.
24. **Blog grid** — `motion.div` stagger container wrapping masonry grid cards with `staggerContainer`/`staggerChild` variants.
25. **Blog page header** — `components/ui/motion-header.tsx` reusable client wrapper for spring entrance on server-component pages. Applied to blog page header.
26. **States page** — `motion.header` spring entrance on hero, `motion.div` stagger on luxury stat badges (4-card grid), `motion.div` stagger on state card list.
27. **Registration step transitions** — `AnimatePresence mode="wait"` with directional slide (forward=right, back=left) between info→policy→payment steps. Direction tracked via `useRef`.
28. **Meetings section** — Staggered entrance on mobile `MeetingCard` list, spring entrance on "Add Your Meeting" CTA card.

**All new components respect `useReducedMotion` — animations are disabled entirely when reduce-motion is active.**

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
