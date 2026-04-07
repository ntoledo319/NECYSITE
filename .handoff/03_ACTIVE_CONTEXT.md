# Active Context — NECYPAA XXXVI Website

> **Last Updated:** 2026-04-07
> **Purpose:** Snapshot of exactly where this project stands right now. Updated before every push.

---

## Current Project State

**Phase:** Side-branch visual overhaul in progress. Core design-system and major shared-surface improvements remain on the branch, the recent page-sweep copy rewrites have been rolled back, and the current work is continuing as a visual-first refinement pass with selective functionality-alignment checks against `main` plus spacing / hierarchy normalization.

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

### 4. Visual-Only Route Differentiation Pass

This pass resumed work on unfinished routes without changing committee-approved wording.

**What changed in this pass:**
- `components/games/inventory-shell.tsx` now supports visual themes for unfinished routes while preserving the exact route copy
- `faq`, `program`, `merch`, `prayer`, `asl`, and `bid` now share the same approved words but no longer share the same presentation
- `service/page.tsx` was recomposed into a more structured two-column layout with stronger visual hierarchy, while keeping the existing text intact

**Design intent of this pass:**
- differentiate pages through composition, framing, imagery, and panel language
- avoid further editorialization of route copy
- keep future work inside the “visual-only unless approved” rule

### 5. Expanded Visual-Only Sweep Across Remaining Utility / Archive Pages

This follow-up pass continued the same constraint: redesign the page surfaces without changing approved wording.

**What changed in this pass:**
- `blog/page.tsx`, `blog/[slug]/page.tsx`, `blog-grid.tsx`, and `blog-card.tsx` were recomposed to feel more like a journal/archive system and less like generic content cards
- `journey/page.tsx` now uses flyer-led timeline composition instead of a plain stack of archive cards
- `register/success/page.tsx` and `breakfast/success/page.tsx` were rebuilt into more distinctive confirmation layouts while preserving the existing strings
- `error.tsx` and `not-found.tsx` now have stronger authored recovery states
- `accessibility/page.tsx` and `cash/page.tsx` were restructured for clearer hierarchy and less generic vertical card stacking

**Constraint maintained in this pass:**
- no intentional committee-copy rewrite
- route copy preserved, with changes focused on composition, grouping, imagery, and surface treatment

### 6. Final Visual-Only Refinement Pass Across Homepage + Destination Routes

This most recent pass stayed inside the same rule: no approved wording changes, only visual and interaction work.

**What changed in this pass:**
- `hero-section.tsx`, `quick-facts-strip.tsx`, `cta-section.tsx`, `business-meeting-section.tsx`, `events-preview-section.tsx`, and `ypaa-narrative-section.tsx` were recomposed so the homepage reads as a more authored sequence rather than a stack of similar cards
- `states/page.tsx`, `state-card.tsx`, and `meeting-directory.tsx` were polished away from the older dark-glass treatment and toward calmer framed surfaces with clearer hierarchy
- `alanon/page.tsx` and `alanon-info-accordion.tsx` got stronger route-specific framing and cleaner card treatment without changing the approved wording
- `breakfast/page.tsx` and `breakfast-checkout.tsx` were upgraded from a utility checkout feel into a more intentional ticket-purchase flow while preserving all existing text
- `events/page.tsx` received a final surface polish so it aligns more tightly with the newer homepage/event-preview language

**Constraint maintained in this pass:**
- no intentional committee-copy rewrite
- work limited to layout, framing, imagery emphasis, spacing, and control polish

### 7. `main` Functionality Alignment Pass

This pass explicitly audited `main` to confirm the branch still communicates the actual jobs of the website, not just its improved look.

**What changed in this pass:**
- `site-header.tsx` was updated so `Journey` and `Start a Bid` are reachable from the primary navigation again, matching important discoverability paths that existed on `main`
- `components/games/inventory-shell.tsx` now gives unfinished routes contextual exits to relevant working pages instead of generic placeholder-only guidance

**Intent of this pass:**
- preserve the current branch’s better visual system
- keep approved page copy intact
- restore route discoverability and practical navigation cues where `main` still communicated product intent better

### 8. YPAA + Spacing Normalization Pass

This pass stayed visual-only and focused on two specific issues raised in review.

**What changed in this pass:**
- `components/sections/ypaa-narrative-section.tsx` was adjusted to recover more of the original `What is a YPAA?` energy while keeping it aligned with the newer light-first system
- shared page-bottom rhythm was normalized through `globals.css`, `site-footer.tsx`, and repeated page wrappers so shorter and mid-length routes stop accumulating oversized dead space before the footer
- `page.tsx`, `hero-section.tsx`, `states/page.tsx`, `accessibility/page.tsx`, and `service/page.tsx` were tightened so section transitions feel more intentional and less padded-by-default
- `events/page.tsx`, `page-shell.tsx`, `inventory-shell.tsx`, `journey/page.tsx`, `blog/page.tsx`, `blog/[slug]/page.tsx`, and `alanon/page.tsx` were brought onto the same page-frame rhythm to reduce blank-space drift across the branch

**Intent of this pass:**
- keep the stronger redesign language
- restore a better emotional anchor for the homepage YPAA explanation
- make spacing feel systemic instead of page-by-page accidental

---

## Features: Current Status

### Strong / Review-Ready
- Homepage
- Registration flow
- Registration success flow
- Breakfast sales flow
- Breakfast success flow
- Events page
- States directory
- Al-Anon page
- Accessibility panel and public accessibility page
- Meetings browser
- Journey archive page
- Blog index and article presentation
- Shared homepage section system
- Primary route discoverability layer
- Shared page-spacing rhythm

### Present but Still Needing Final Content / Visual-Only Follow-Up
- Program
- Merch
- Prayer / meditation
- ASL
- Bid information
- Service
- Blog presentation pages

These routes should be treated as design surfaces only unless approved copy is supplied or explicitly cleared for change. Several of them now have stronger visual identities, but they still need final real content.

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
5922e67 Restore main route discoverability on redesign
1e8140f Refine remaining visual-only destination pages
73419b0 Differentiate unfinished routes visually
b9bd286 Update handoff after copy rollback
f499b88 Revert unapproved copy changes from page sweep
1fbca97 Polish NECYPAA UI across core flows
1b217e6 fix(deps): remove package-lock.json, enforce pnpm as sole package manager
a871bfb style(theme): replace hardcoded neon rgba values with CSS variable equivalents
4c0117d feat(events): populate past events + redesign homepage section
```

---

## What a New Developer Should Know Immediately

1. `main` is not the visual reference for the redesign branch.
2. Committee-approved wording is constrained. Do not rewrite user-facing copy unless the change is explicitly requested and approved.
3. The next design passes on unfinished routes should focus on layout, composition, hierarchy, art direction, and interaction without changing text.
4. Before pushing again, keep this file current. The pre-push hook expects it.
