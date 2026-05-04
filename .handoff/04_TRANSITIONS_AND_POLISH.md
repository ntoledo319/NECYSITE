# Handoff — Transitions & Polish Pass

**Date:** May 3, 2026
**Branch:** `feat/transitions-and-polish` (based on `main`)
**Status:** Pushed to GitHub, ready for PR or further work

---

## Philosophy

This branch takes a *restrained* approach to visual enhancement. The previous `feat/living-realm-visual-upgrade` branch (steampunk viewport frame, character portals, floating debris, aggressive 3D tilt) was deleted after feedback that it buried the art under decoration. This branch focuses on:

- **Smoother transitions** between states and routes
- **Scroll-driven reactivity** — existing elements respond to scroll rather than new elements being added
- **Micro-interactions** — hover/pull effects on buttons, spotlight cards
- **Themed iconography** — higher-quality SVG illustrations replacing emojis

The rule: *make what's there feel better, don't add more visual noise.*

---

## Changes Summary

### 1. Hero Scroll Parallax (`components/sections/hero-section.tsx`)

- **Poster background** now scales subtly as user scrolls: `scale(1 → 1.15)` over the hero's viewport lifetime
- **Hero content** exits with 3D perspective: `rotateX(0 → 10deg)`, `translateZ(0 → -120px)`, and opacity fade
- Uses `useReducedMotion` from framer-motion to disable for users who prefer reduced motion
- Scroll listener on the hero section itself (not global) — reads `getBoundingClientRect()` each frame via rAF-throttled handler

### 2. Magnetic Button Hover (`components/ui/motion-primitives.tsx`)

- `MagneticButton` wrapper — buttons subtly follow the cursor on hover via spring physics
- Applied to **hero CTAs** and **interactive quick-fact pills**
- Spring config: `SPRING_GENTLE` (`stiffness: 150, damping: 15, mass: 0.1`)
- Disabled when `prefers-reduced-motion` or `.a11y-reduce-motion` is active

### 3. Themed SVG Icons (`components/art/theme-icons.tsx`)

Replaced emoji icons in `QuickFactsStrip` with 6 custom steampunk-themed SVG mini-illustrations:

| Icon | Animation | Fact |
|------|-----------|------|
| `PocketWatchIcon` | Hour/minute hands tick | "Over 4 Decades" |
| `CompassRoseIcon` | Needle sways gently | "Hosted Across the Region" |
| `VintageTicketIcon` | Static (perforated edge) | "Conference Pricing" |
| `AntiqueKeyIcon` | Static | "Room Rates & Code" |
| `MasqueradeMaskIcon` | Static | "Get Involved" |
| `InterlockingGearsIcon` | Gears rotate CW/CCW | "Contact Us" |

All icons:
- Stroke-based, inherit `currentColor`
- Sized to `1.25em` for text-scale alignment
- Animations use CSS `@keyframes` with `prefers-reduced-motion` guards

### 4. Quick Facts Enhancement (`components/sections/quick-facts-strip.tsx`)

- Each fact wrapped in `SpotlightCard` — radial glow follows cursor on hover
- Spotlight color varies per fact (gold, amber, rose, violet, emerald, sky)
- Staggered entrance via framer-motion (`staggerContainer` / `staggerChild`)
- `MagneticButton` on interactive facts for subtle hover pull

### 5. Page Transitions (`components/ui/page-transition.tsx`)

- Smoother cubic-bezier easing: `cubic-bezier(0.16, 1, 0.3, 1)`
- Subtle scale entrance: `scale(0.98 → 1)` on route enter
- Fade + translateY(8px → 0) for directionality
- Duration: 350ms (was previously instant or un-tuned)

### 6. Scroll Reveal (`components/ui/scroll-reveal.tsx` + `globals.css`)

Zero-dependency scroll reveal using IntersectionObserver + CSS transitions:

```css
.sr-reveal {
  opacity: 0;
  transform: translateY(28px) scale(0.98);
  transition: opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.65s cubic-bezier(0.16, 1, 0.3, 1);
}
.sr-reveal.sr-revealed {
  opacity: 1;
  transform: translateY(0) scale(1);
}
```

- Respects `prefers-reduced-motion`
- Threshold: 0.1 (triggers when 10% visible)
- Stagger achieved by varying `transition-delay` on child elements

### 7. Header Scroll Performance (`components/site-header.tsx`)

- Scroll listener now rAF-throttled via `requestAnimationFrame` pattern
- Prevents multiple `setState` calls per scroll event
- Compression: 4.5rem → 3.5rem when scrolled

---

## Accessibility

All animations respect `prefers-reduced-motion` and the `.a11y-reduce-motion` class:
- Hero parallax disables transforms when reduced motion is preferred
- Magnetic buttons disable spring physics
- Scroll reveal applies instant opacity change (no transform)
- Gear/watch/compass animations pause

---

## Files Modified / Created

| File | Change |
|------|--------|
| `components/sections/hero-section.tsx` | Scroll parallax, 3D content exit, `MagneticButton` on CTAs |
| `components/sections/quick-facts-strip.tsx` | Themed icons, `SpotlightCard`, stagger, `MagneticButton` |
| `components/art/theme-icons.tsx` | **New** — 6 themed SVG icons with CSS animations |
| `components/ui/page-transition.tsx` | Smoother easing, scale entrance |
| `components/ui/scroll-reveal.tsx` | **New** — IntersectionObserver-based reveal |
| `components/ui/motion-primitives.tsx` | `MagneticButton`, `SpotlightCard`, spring configs, stagger variants |
| `components/site-header.tsx` | rAF-throttled scroll listener |
| `app/globals.css` | `.sr-reveal` / `.sr-revealed` CSS classes |
| `lib/stripe.ts` | Lazy init — missing env var no longer crashes build |

---

## What Was Left on Main (Not in This Branch)

The following decorative layers exist on `main` and were *enhanced* by this branch, not replaced:
- `MadRealmParticles` — very low opacity floating particles
- `MadRealmMazeBg` — subtle background maze pattern
- `OrnateDivider` — decorative section dividers
- `PageArtAccents` — page-level decorative flourishes

---

## Build & Test Status

- **Lint:** Clean (no ESLint warnings in modified files)
- **Build:** `pnpm build` passes
- **Typecheck:** No TypeScript errors

---

## Open Items / Next Ideas

- **Apply scroll reveal** to remaining sections (`events-preview`, `blog-preview`, `about-section`, etc.)
- **Page transitions** — could be extended to individual section entrances, not just route changes
- **More themed icons** — if other sections use emoji or generic icons, replace with themed SVGs
- **Scroll progress bar** — currently exists but could be styled to match the steampunk theme
- **Checkout/registration forms** — could benefit from `SpotlightCard` or `TiltCard` wrappers for tactile feel

---

## Production Notes

- **Stripe env var:** `STRIPE_SECRET_KEY` must be configured in Vercel dashboard for payment routes to work at runtime. Build no longer crashes without it (lazy init fix).
- **Payload storage adapter:** "Collections with uploads enabled require a storage adapter when deploying to Vercel" — non-blocking warning, but media uploads won't persist without configuring S3/R2/etc.
