# Accessibility QA Checklist — NECYPAA XXXVI

> **Target:** WCAG 2.1 AA minimum, AAA where feasible.
> **Last updated:** 2026-04-25

## Automated checks

- [ ] Run `pnpm test:a11y` (Playwright + axe-core) — all pages must pass.
- [ ] Run Lighthouse accessibility audit — score ≥ 95.
- [ ] Verify no color-contrast failures on any page.
- [ ] Verify every `<img>` has alt text (including dynamic CMS images).
- [ ] Verify form inputs have associated labels.

## Keyboard navigation

- [ ] Tab through every page. Focus order must be logical.
- [ ] All interactive elements must be reachable and operable by keyboard.
- [ ] Modals/drawers must:
  - [ ] Trap focus while open.
  - [ ] Close on `Escape`.
  - [ ] Return focus to the trigger element when closed.
- [ ] Skip-to-content link works on every page.

## Screen reader

- [ ] Landmark regions (`<main>`, `<nav>`, `<header>`, `<footer>`, `<aside>`) are present and correct.
- [ ] Heading hierarchy is logical (no skipped levels).
- [ ] ARIA labels are meaningful, not redundant.
- [ ] Dynamic content changes are announced (e.g., form errors, checkout state).

## Motion & animation

- [ ] `prefers-reduced-motion` is respected site-wide.
- [ ] No auto-playing animations that cannot be paused.
- [ ] Canvas games do not interfere with page usability.

## Accessibility panel (6 modes)

- [ ] Font-size toggle (1× → 2×) applies correctly without breaking layout.
- [ ] High-contrast mode is coherent (no invisible text or broken borders).
- [ ] Dyslexia-friendly font loads and applies.
- [ ] Reduce-motion disables Framer Motion transitions.
- [ ] Grayscale mode applies to all content (including images where appropriate).
- [ ] Color mode (dark/light) toggle works.
- [ ] Settings persist across tabs (via `StorageEvent` or re-check on focus).

## Responsive & touch

- [ ] All interactive targets ≥ 44 × 44 px on mobile.
- [ ] No horizontal scroll at 320 px viewport width.
- [ ] Mobile menu opens/closes with keyboard and touch.

## Known gaps (as of 2026-04-25)

- [ ] `localStorage` a11y settings do not sync across tabs in real time (minor).
- [ ] Dynamic images (blog featured images, event flyers) are not covered by existing Playwright alt-text tests.
- [ ] Some `console.error` statements in server actions could be replaced with structured logging for better observability.

## Sign-off

| Date | Tester | Result |
|------|--------|--------|
| | | |
