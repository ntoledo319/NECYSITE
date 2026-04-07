# Active Context — NECYPAA XXXVI Website

> **Last Updated:** 2026-04-07
> **Purpose:** Snapshot of exactly where this project stands right now. Updated before every push.

---

## Current Project State

**Phase:** Side-branch visual overhaul in progress. Core design-system and major shared-surface improvements remain on the branch, but the recent page-sweep copy rewrites have been rolled back because committee-approved wording must remain untouched.

**Branch:** `wave2/light-first-component-surgery` (branched from `main`; `main` still reflects the older visual design)
**Deployment:** Not merged to `main`. Vercel production still follows `main`.
**Verification status:** The branch is expected to lint clean on staged TS/TSX files during commit. `pnpm exec tsc --noEmit` is still blocked by the same two pre-existing test files:
- `lib/__tests__/accessibility-context.test.ts`
- `lib/__tests__/issuer-client.test.ts`

---

## Latest Changes

### 1. Shared Visual System Overhaul Remains

The branch still contains the broader visual redesign work that moved the site away from the older dark neon treatment:
- light-first warm color tokens
- calmer shared surfaces and controls
- typography overhaul
- reduced glow/blob noise
- stronger homepage and core-flow presentation
- cleaner navigation and shared interaction chrome

### 2. Core Flow Polish Remains

The branch still includes the earlier visual polish across major surfaces, including:
- homepage sections
- meetings browser and cards
- events preview treatment
- share sheet and utility controls
- registration and breakfast flow polish

### 3. Copy-Rollback Correction

The recent page-by-page sweep introduced user-facing copy changes on multiple routes. Those wording changes were not approved content changes, so they have been rolled back.

**Rollback intent:**
- preserve committee-approved copy
- remove unapproved rewritten text
- keep the branch aligned with visual design work rather than content authoring

This means the branch no longer includes the copy-heavy versions of:
- FAQ
- Program
- Merch
- Prayer
- ASL
- Bid
- Blog index/detail
- Journey
- Service
- Accessibility
- Cash registration
- Registration success
- Breakfast success
- Error / not-found rewrite

Any future sweep on those pages should be visual-only unless content approval is explicit.

---

## Features: Current Status

### Strong / Review-Ready
- Homepage
- Registration flow
- Breakfast sales flow
- Events page
- States directory
- Al-Anon page
- Accessibility panel and public accessibility page
- Meetings browser

### Present but Still Needing Final Content / Visual-Only Follow-Up
- Program
- Merch
- Prayer / meditation
- ASL
- Bid information
- Service
- Blog presentation pages

These routes should be treated as design surfaces only unless approved copy is supplied or explicitly cleared for change.

---

## Known Bugs / Technical Constraints

### Active Known Constraint

`pnpm exec tsc --noEmit` is not fully green because of existing top-level `await` usage in:
- `lib/__tests__/accessibility-context.test.ts`
- `lib/__tests__/issuer-client.test.ts`

This is not introduced by the visual design work on this branch.

### High-Priority Product Gaps Still Unrelated to This Visual Pass

1. No Stripe webhook handler for authoritative post-payment reconciliation.
2. No persistent registration storage beyond Stripe metadata.
3. Rate limiting is still in-memory and not durable across production instances.

See `docs/tech-debt-and-gaps.md` for the broader backlog.

---

## Recent Commits On Branch

```
1fbca97 Polish NECYPAA UI across core flows
1b217e6 fix(deps): remove package-lock.json, enforce pnpm as sole package manager
a871bfb style(theme): replace hardcoded neon rgba values with CSS variable equivalents
4c0117d feat(events): populate past events + redesign homepage section
3bf7aa5 fix(meta): use badge image for social sharing preview
```

---

## What a New Developer Should Know Immediately

1. `main` is not the visual reference for the redesign branch.
2. Committee-approved wording is constrained. Do not rewrite user-facing copy unless the change is explicitly requested and approved.
3. The next design passes on unfinished routes should focus on layout, composition, hierarchy, art direction, and interaction without changing text.
4. Before pushing again, keep this file current. The pre-push hook expects it.
