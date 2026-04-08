# Active Context — NECYPAA XXXVI Website

> **Last Updated:** 2026-04-07 (late evening)
> **Purpose:** Snapshot of exactly where this project stands right now. Updated before every push.

---

## Current Project State

**Phase:** Side-branch visual overhaul and micro-enhancement pass complete. Core design-system, shared-surface improvements, and a final round of UX polish (blog badges, 404 navigation, success-page warmth, footer additions, error-page contact, copy-fix sweep) are all on the branch. Ready for review/merge consideration.

**Branch:** `wave2/light-first-component-surgery` (branched from `main`; `main` still reflects the older visual design)
**Deployment:** Not merged to `main`. Vercel production still follows `main`.
**Verification status:** The branch now passes the end-to-end accessibility suite via `pnpm exec playwright test e2e/accessibility.spec.ts --workers=1` (`80` tests passed). The branch is expected to lint clean on staged TS/TSX files during commit. `pnpm exec tsc --noEmit` is still blocked by the same two pre-existing test files:
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

### 9. Design & UX Audit Implementation Pass

This pass implemented infrastructure and UX improvements identified by a comprehensive design and accessibility audit, filtered strictly through AA Traditions and WCAG guidelines. No content was fabricated. No promotional elements were added.

**What changed in this pass:**
- `breakfast/page.tsx` — **Bug fix:** Added missing `SiteFooter` and `MobileCtaBar`. The page was previously missing the accessibility statement and report-a-problem link required by `ACCESSIBILITY_GUIDELINES.md` Section 8.
- `register/page.tsx` — **Registration progress bar:** Added a `role="progressbar"` element at the top of the form card showing step progress visually with ARIA attributes for screen readers.
- `lib/calendar.ts` — **New utility:** Generates Google Calendar URLs from event data by parsing human-readable dates.
- `events/page.tsx` + `events-preview-section.tsx` — **Add-to-Calendar:** "Add to Calendar" button added to upcoming event cards, linking to Google Calendar with factual event data.
- `lib/event-jsonld.ts` — **New utility:** Generates schema.org Event JSON-LD from event data. Per `AA_TRADITIONS_GUARDRAILS.md` Section 5.1, structured data describing events factually is explicitly allowed.
- `events/page.tsx` — **Event JSON-LD:** All events now emit `<script type="application/ld+json">` structured data.
- `lib/reading-time.ts` — **New utility:** Estimates reading time at 200 WPM, returns "X min read" strings.
- `blog-card.tsx` — **Reading time:** Each blog card now shows a clock icon + reading time estimate next to the publication date.
- `app/robots.ts` — **New file:** robots.txt via Next.js Metadata API. Allows all crawlers, disallows `/admin/` and `/api/`.
- `app/feed.xml/route.ts` — **New route:** RSS 2.0 feed for blog posts, available at `/feed.xml`.
- `journey/page.tsx` — **Year grouping:** Events are now grouped by year with section headings (`h2`) and proper heading hierarchy (`h3` for event titles within groups).

**Items explicitly rejected in this pass (AA Traditions compliance):**
- Countdown component — promotional urgency mechanic (T11: attraction, not promotion)
- Email capture section — marketing tactic (T11)
- Testimonials section — `AA_TRADITIONS_GUARDRAILS.md` Section 5.2 explicitly bans testimonials/reviews
- Closing CTA section — redundant with existing CTA, would be obnoxious per user directive
- FAQ/program content fabrication — content requires committee approval

### 10. Accessibility Alignment Pass

This pass focused on bringing the branch back into line with the repo's own enforced accessibility floor rather than adding new visual scope.

**What changed in this pass:**
- `components/sections/business-meeting-section.tsx` now uses valid description-list structure so homepage meeting details no longer trip axe semantics errors
- `components/sections/events-preview-section.tsx` was adjusted so the homepage archive labels clear AA color contrast while preserving the section's visual direction
- `app/[locale]/(frontend)/layout.tsx` now makes `main#main-content` programmatically focusable, which restores reliable skip-link behavior for keyboard users
- `app/[locale]/(frontend)/alanon/page.tsx` now uses stronger, mode-safe heading and focus colors for the Al-Anon / Alateen state sections
- `components/breakfast-checkout.tsx` and `components/registration-checkout.tsx` now use semantic destructive text treatment for error states instead of low-contrast red utility text
- `components/mobile-cta-bar.tsx` now uses explicit high-contrast mobile CTA styling and a no-fade entrance so the fixed CTA bar does not dip into low-contrast intermediate states during fast page loads
- `e2e/accessibility.spec.ts` now includes `/blog`, `/journey`, and all blog detail routes in the enforced AA sweep so content routes already on the branch are covered by the suite

**Verification completed in this pass:**
- `pnpm exec playwright test e2e/accessibility.spec.ts --workers=1`
- result: `80 passed`
- remaining contrast notes surfaced during the run are AAA-only warnings on a few pages and do not fail the branch under current project policy

### 11. Micro-Enhancement & Copy-Fix Pass

This pass added small UX improvements and corrected leftover design-note copy that had leaked into user-facing pages. No new dependencies were added — all changes use existing Lucide icons and CSS variables.

**What changed in this pass:**

- `components/blog-card.tsx` — **"New" badge:** An `isRecentPost()` helper flags posts published within the last 14 days. Those cards render a cyan "New" badge with `aria-label="Recently published"`.
- `app/[locale]/(frontend)/not-found.tsx` — **Helpful navigation:** Added a `<nav aria-label="Helpful links">` with links to Blog, Events, FAQ, Get Involved, and Program, plus primary CTAs ("Back to the Portal" + "Register") and a contact-email fallback.
- `app/[locale]/(frontend)/register/success/page.tsx` — **Warm sign-off:** Added italic message "We can't wait to welcome you to Hartford. This is going to be special."
- `app/[locale]/(frontend)/breakfast/success/page.tsx` — **Warm sign-off:** Added italic message "Nothing beats starting the new year with good food and even better fellowship."
- `components/site-footer.tsx` — **RSS link + sign-off:** Added RSS Feed link (with `Rss` icon) in the Community column; added warm closing line "Built with love by people who get it."
- `app/[locale]/(frontend)/error.tsx` — **Contact link:** Added `mailto:` link with error digest in subject line so users can report issues directly.
- `app/[locale]/(frontend)/events/page.tsx` — **Copy fix:** Replaced leaked design-note headings ("The featured event should do the heavy lifting" → "What's next on the road to Hartford"; "Past events should still be easy to scan" → "Where we've been").
- `app/[locale]/(frontend)/register/page.tsx` — **Copy fix:** Replaced leaked design-note subtitle ("The registration flow should feel guided, calm, and obvious" → "Secure your spot at NECYPAA XXXVI in Hartford. A few quick steps and you're in.").

**Constraints maintained in this pass:**
- no new npm dependencies
- all new interactive elements are keyboard-accessible with proper ARIA attributes
- color contrast meets AA minimum (cyan badge on dark background verified)
- AA Traditions respected — no promotional urgency, no testimonials, no countdown mechanics
- person-first language maintained throughout

### 12. Detail Polish Pass

This pass extended the micro-enhancement work into blog detail pages, blog card date display, error recovery UX, and the journey archive closing.

**What changed in this pass:**

- `app/[locale]/(frontend)/blog/[slug]/page.tsx` — **"New" badge on detail page:** Added the same `isRecentPost()` helper and cyan "New" badge to individual blog post headers, matching the grid card treatment.
- `components/blog-card.tsx` — **Relative dates:** Added `formatRelativeDate()` helper. Posts less than 7 days old show "Today", "Yesterday", or "X days ago" instead of the full date. The absolute date remains accessible as a `title` attribute on hover.
- `app/[locale]/(frontend)/error.tsx` — **Auto-retry countdown:** Error page now counts down from 10 seconds and auto-retries via `reset()`. Countdown is announced to screen readers via `aria-live="polite"`. Users can cancel with an inline button.
- `app/[locale]/(frontend)/journey/page.tsx` — **Warm closing line:** Added "Every event on this timeline brought people together. That's the whole point." above the existing "More events to come" closer.

**Constraints maintained in this pass:**
- no new npm dependencies
- auto-retry countdown is functional error recovery, not promotional urgency
- relative dates preserve absolute date via `title` attribute for accessibility
- warm closing line is factual (events bring people together) without making recovery-outcome claims

### 13. Registration Payment Verification

This pass closed a critical security and UX gap: the registration success page was purely cosmetic. It rendered "You're Registered!" unconditionally — the `session_id` query parameter from Stripe was completely ignored, and anyone could visit `/register/success` directly without having paid.

**What changed in this pass:**

- `app/[locale]/(frontend)/register/success/page.tsx` — **Rewritten as a server component.** Now reads `session_id` from `searchParams`, calls `stripe.checkout.sessions.retrieve()` with `expand: ['line_items']`, and verifies `payment_status === 'paid'` and `session.status === 'complete'` before rendering the success UI. Three unverified states are handled: `unpaid` (payment pending), `error` (Stripe API unreachable), and `missing` (no session_id / direct navigation). Each state has its own clear messaging, a "Back to Registration" link, and a contact email fallback.
- `app/[locale]/(frontend)/register/success/registration-confirmed.tsx` — **New client component** extracted from the old `page.tsx`. Contains all the animated success UI (framer-motion) but now accepts a `VerifiedRegistration` prop with real data: customer name, email, line items with amounts, and total paid. Displays a "Payment Verified" or "Access Code Accepted" badge, a real order summary with line items and total, and personalizes the heading with the registrant's name.
- `components/checkout/access-code-checkout.tsx` — Redirect changed from `/register/success` to `/register/success?flow=access-code` so the success page can distinguish a legitimate access-code registration from unauthenticated direct navigation.

**Verification states:**
- **Verified (paid):** Shows personalized "You're in, [Name]!" heading, ShieldCheck icon, "Payment Verified" badge, real order summary with line items and total, receipt email confirmation, full next-steps content.
- **Verified (access code):** Shows KeyRound icon, "Access Code Accepted" badge, no payment details, same next-steps content.
- **Unpaid:** Clock icon, "Payment not yet confirmed", guidance to refresh or check bank statement.
- **Error:** AlertCircle icon, "Verification temporarily unavailable", guidance to check email for Stripe receipt.
- **Missing:** AlertCircle icon, "We couldn't verify your registration", guidance to check email or re-register.

**Security improvement:** Direct navigation to `/register/success` without a valid `session_id` or `flow=access-code` no longer shows a false "You're Registered!" confirmation.

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
bedaf59 Align redesign branch with accessibility standards
f25b2bd Refine YPAA section and spacing rhythm
5922e67 Restore main route discoverability on redesign
1e8140f Refine remaining visual-only destination pages
4a8020d Extend visual-only page differentiation
73419b0 Differentiate unfinished routes visually
b9bd286 Update handoff after copy rollback
f499b88 Revert unapproved copy changes from page sweep
1fbca97 Polish NECYPAA UI across core flows
1b217e6 fix(deps): remove package-lock.json, enforce pnpm as sole package manager
a871bfb style(theme): replace hardcoded neon rgba values with CSS variable equivalents
```

---

## What a New Developer Should Know Immediately

1. `main` is not the visual reference for the redesign branch.
2. Committee-approved wording is constrained. Do not rewrite user-facing copy unless the change is explicitly requested and approved.
3. The next design passes on unfinished routes should focus on layout, composition, hierarchy, art direction, and interaction without changing text.
4. The blog "New" badge (`isRecentPost()` in `blog-card.tsx`) uses a 14-day window with `Date.now()` — it will work correctly once CMS data is live via Payload.
5. Before pushing again, keep this file current. The pre-push hook expects it.
