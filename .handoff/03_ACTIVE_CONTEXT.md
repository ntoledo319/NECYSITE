# Active Context — NECYPAA XXXVI Website

> **Last Updated:** 2026-04-05
> **Purpose:** Snapshot of exactly where this project stands right now. Updated before every push.

---

## Current Project State

**Phase:** Aesthetic overhaul (Wave 1–2 complete, Wave 3–4 pending). Convention is Dec 31, 2026.

**Branch:** `wave2/light-first-component-surgery` (branched from `main` — main is untouched)
**Build status:** Passing (production build green, all routes compile)
**Deployment:** Not yet merged to main. Vercel auto-deploys from main only.

---

## Latest Changes (This Session — Aesthetic Redo Wave 1)

### Wave 1A: Color Token Overhaul — Light-First Warm Parchment (Complete)

Complete replacement of the dark-first neon SaaS palette with a warm, parchment-based light-first design system derived from the original Mad Realm poster art.

**What changed:**

1. **`:root` tokens** — Replaced all color variables with warm palette:
   - `--nec-navy` → warm parchment `#F5F0E8` (was dark purple `#0a0612`)
   - `--nec-text` → dark walnut `#2C1810` (was white)
   - `--nec-muted` → warm gray `#6B5B4F` (was cold gray)
   - `--nec-purple` → aged plum `#6B3060` (was neon `#7c3aed`)
   - `--nec-cyan` → teal patina `#2D6B5E` (was electric cyan)
   - `--nec-gold` → antique gold `#7A5B0D` (was bright yellow)
   - `--nec-pink` → raspberry `#8B2252` (was neon magenta)
   - Added `--nec-card`, `--shadow-card`, `--shadow-text` tokens
   - Added RGB triplet variables for `rgba()` usage

2. **`[data-color-mode="dark"]` block** — New warm navy palette (navy `#0F1A2B`, cream text `#E8E0D4`) with corresponding shadow/card tokens.

3. **Removed ~300 lines of `[data-color-mode="light"]` overrides** — Since light is now the default, these were all redundant. Base styles use CSS variables that resolve correctly in both modes.

4. **Component base styles** — All registration cards, site-wide surfaces, badges, pills, buttons, etc. now use `var(--nec-*)` and `rgba(var(--nec-*-rgb), opacity)` instead of hardcoded `rgba(26,16,48,...)`.

5. **High contrast** — Updated for both light (max contrast warm colors on parchment) and dark (bright warm tones on navy) modes.

6. **Focus rings** — Plum (`--nec-purple`) on light, teal (`--nec-cyan`) on dark. Both exceed 3:1 contrast on their backgrounds.

7. **A11yProvider** — Default `colorMode` changed from `"dark"` to `"light"`. OS preference detection still works. Tests updated.

### Wave 1B: Typography Swap (Complete)

Replaced generic SaaS sans-serifs with warm editorial serifs:

- **Body**: Plus Jakarta Sans → **Source Serif 4** (excellent readability, warm, WCAG AAA compliant)
- **Headings**: Outfit → **Playfair Display** (editorial high-contrast serif, evokes storybook/letterpress)
- **Display**: Bangers kept (fits Mad Realm whimsy)
- Updated `layout.tsx`, `tailwind.config.js`, `globals.css`, `critical.css` font-family fallbacks.

### Wave 1D: Remove AuroraBackground & AmbientBlobs (Complete)

- Removed `AuroraBackground` from `hero-section.tsx` (framer-motion animated blobs — AI slop)
- Removed `AmbientBlobs` from `page.tsx` (CSS animated glow blobs — unnecessary with warm parchment body)
- Component files left in place as dead code (can be deleted in cleanup pass)
- Home page First Load JS dropped ~1kB

**Build:** Passing. All tests pass. Zero lint errors.

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
