# Changelog

> Keeping track of what changed and when.

## [Unreleased] - 2026-03-18 (f)

*Full site accessibility sweep + luxury CSS polish. Every external link now tells screen readers it opens in a new tab. Every decorative icon is hidden from assistive tech. Every required field in the policy agreement actually announces "required." Inline JS hover handlers got fired and replaced with proper CSS. The selection color matches the theme now because we're not animals. Button hover transforms respect reduced motion. New styles got light mode, high contrast, and reduced motion overrides — because if you add a feature without adding the a11y override, did you really add it? — Nikki*

### Changed
- **globals.css** — Luxury polish pass: added `-moz-osx-font-smoothing: grayscale` and `text-rendering: optimizeLegibility` to body. Added themed `::selection` colors (purple tint in dark, purple tint in light). Heading `letter-spacing: -0.01em` for tighter, more refined typography. `.fact-pill-interactive` and `.zoom-link` now respond to `:focus-within` / `:focus-visible` (not just hover). Added `prefers-reduced-motion` and `.a11y-reduce-motion` overrides for `btn-primary` / `btn-secondary` hover transforms. Light mode overrides for `.fact-pill-interactive:hover`, `.zoom-link`, and `::selection`. High contrast override for `.zoom-link` border.
- **business-meeting-section.tsx** — Replaced inline JS `onMouseEnter`/`onMouseLeave` hover handlers on Zoom link with CSS class `.zoom-link`. Added `aria-hidden="true"` to decorative Calendar, Clock, Video icons. Added SR text "(opens in new tab)" to Zoom link.
- **quick-facts-strip.tsx** — Replaced inline JS hover handlers with CSS class `.fact-pill-interactive`. Added `aria-hidden="true"` to emoji icons. Increased sub-text and label text from 10px to 11px (WCAG minimum). Added SR text for external links.
- **policy-agreement.tsx** — Added `aria-required="true"` to all 7 checkboxes. Added `aria-hidden="true"` to visual asterisks. Added `<span class="sr-only">(required)</span>` to each label. Added "Required field" legend text with SR explanation.

### Fixed
- **Site-wide external link a11y** — Every `target="_blank"` link now has `<span class="sr-only"> (opens in new tab)</span>`. Affected: `site-header.tsx` (desktop + mobile nav), `site-footer.tsx`, `mobile-cta-bar.tsx`, `hero-section.tsx`, `cta-section.tsx`, `business-meeting-section.tsx`, `quick-facts-strip.tsx`, `meeting-card.tsx`, `expandable-meeting-row.tsx`, `registration-confirmation.tsx`, `state-card.tsx` (intergroup, YPAA, Al-Anon, Alateen, meeting finder, area service links), `register/page.tsx`.
- **Decorative icon a11y** — All Lucide icons used decoratively now have `aria-hidden="true"`. Affected: `site-header.tsx` (Menu/X), `site-footer.tsx` (ExternalLink, Mail), `hero-section.tsx` (ambient glow container), `cta-section.tsx` (glow divs, ArrowRight, ExternalLink, decorative emoji), `business-meeting-section.tsx` (Calendar, Clock, Video), `meetings-section.tsx` (Mail).
- **Semantic HTML** — `layout.tsx`: replaced wrapper `<div>` with `<main id="main-content">`. `mobile-cta-bar.tsx`: replaced `<div>` with `<nav aria-label="Quick actions">`.
- **WCAG minimum text size** — Increased 10px text to 11px in `hero-section.tsx`, `quick-facts-strip.tsx`, `site-footer.tsx` (trademark).

---

## [Unreleased] - 2026-03-18 (e)

*"Inventory in Progress." Five placeholder pages now have AA-themed classic arcade games hidden behind a Step 4 pun. Click the pulsing button and you get Space Invaders, Tetris, Breakout, Snake, or Pong — each themed with recovery slogans, character defects, spiritual principles, and the AA triangle. Because if you're going to have a coming soon page, it should at least be fun. — Nikki*

### Added
- **`components/games/inventory-shell.tsx`** — Shared wrapper for placeholder pages. Shows character portal art + "Inventory in Progress" button (pulsing, accessible, `aria-expanded`). Click reveals the arcade game with `aria-live` region. Back button returns to portal view. Step 4 quote at bottom.
- **`components/games/space-invaders.tsx`** — **Defect Invaders** (`/bid`). AA triangle ship fires spiritual principles at character defects (FEAR, ANGER, PRIDE, EGO, etc.). Purple/pink/gold/cyan themed enemies. Win message: "We were reborn." — Big Book p. 63.
- **`components/games/tetris.tsx`** — **Recovery Blocks** (`/program`). Standard tetromino gameplay with recovery slogans on each piece (ODAAT, LET GO, EASY DOES IT, etc.). Ghost piece, wall kicks, increasing speed. Game over: "Progress, not perfection."
- **`components/games/breakout.tsx`** — **Wall of Denial** (`/merch`). Break through rows of denial bricks (DENIAL, FEAR, PRIDE, BLAME, LIES, etc.). Paddle = Willingness, Ball = The Message. Mouse/touch + keyboard. Win quote from The Promises.
- **`components/games/snake.tsx`** — **The Journey** (`/prayer`). Collect serenity tokens (☮ SERENITY, ♥ COURAGE, ✦ WISDOM, △ UNITY, ◇ SERVICE, ★ HOPE). Snake head has AA triangle. Score tracks "days." Wrapping edges. "One day at a time."
- **`components/games/pong.tsx`** — **Carry the Message** (`/asl`). Left paddle = Speaker (you), Right = Newcomer (AI). Ball = The Message. Rally counter shows rotating AA slogans. AA triangle watermark at center. First to 7. Win: "We carry the message."

### Changed
- **`/bid`** — Now uses `InventoryShell` + `SpaceInvadersGame` instead of `PageShell`.
- **`/program`** — Now uses `InventoryShell` + `TetrisGame` instead of `PageShell`.
- **`/merch`** — Now uses `InventoryShell` + `BreakoutGame` instead of `PageShell`.
- **`/prayer`** — Now uses `InventoryShell` + `SnakeGame` instead of `PageShell`.
- **`/asl`** — Now uses `InventoryShell` + `PongGame` instead of `PageShell`.

---

## [Unreleased] - 2026-03-18 (d)

*Full art pass. The three Mad Realm characters (Mad Hatter, Cheshire Cat, Caterpillar) and their portal scenes were sitting unused in `/public/images/` — now they're woven across every page. Character dividers on the homepage, portal art on placeholder pages, subtle accents on every content page, steampunk gear SVGs, maze floor patterns, and the theme logo in the footer. The site is built around the art now. — Nikki*

### Added
- **`components/character-divider.tsx`** — Reusable character-enhanced section divider. Shows a Mad Realm character centered between gradient lines with ambient glow. Supports all 3 characters + horizontal flip. Used between every homepage section.
- **`components/art/steampunk-gears.tsx`** — Reusable SVG art components: `Gear` (configurable teeth/size/color), `GearCluster` (3 interlocking gears in purple/pink/gold), `MazePattern` (concentric maze rectangles referencing the portal floor art). Used in business meeting card, service page, CTA section.

### Changed
- **`PageShell`** — Transformed from generic "Coming Soon" with 🚧 emoji to themed portal experience. Each placeholder page now shows a Mad Realm character escaping through portal doors, steampunk gear SVG accents, ambient character-colored glow, "Still Escaping the Mad Realm…" heading, and themed "Back to the Portal" CTA. Accepts `character` prop for page-specific assignment.
- **Homepage** — All 4 `SectionDivider` components replaced with `CharacterDivider` components: Mad Hatter → YPAA narrative, Cheshire Cat → business meeting, Caterpillar → meetings, Mad Hatter (flipped) → past events.
- **Footer** — Added "Escaping the Mad Realm" theme logo above identity column. Three character silhouettes (Mad Hatter, Cheshire Cat, Caterpillar) as ultra-subtle background watermarks.
- **Events page** — Mad Hatter + Cheshire Cat character accents flanking the page header (lg screens).
- **Service page** — Cheshire Cat character accent in Members-at-Large card. `GearCluster` in "How to Get Involved" card.
- **Registration page** — Mad Hatter portal watermark behind header.
- **FAQ page** — Cheshire Cat character accent in header.
- **Journey page** — Caterpillar + Mad Hatter character accents flanking header.
- **Accessibility page** — Caterpillar character accent in header.
- **States page** — Mad Hatter character accent in header.
- **Business meeting section** — `GearCluster` accent in card.
- **CTA section** — `MazePattern` texture in register card.
- **Placeholder pages** — Each assigned a specific character: Bid → Mad Hatter, Program → Cheshire Cat, Merch → Mad Hatter, Prayer → Caterpillar, ASL → Cheshire Cat, Blog → Caterpillar.

---

## [Unreleased] - 2026-03-18 (c)

*Infrastructure blitz. Locale routing is live, the test checkout route is gone forever, automated a11y testing exists, the events page has real content, and Payload CMS now has schemas for blog posts and FAQ. Also restructured the entire app directory under `[locale]` and moved server actions out of the route tree. Nothing caught fire. — Nikki*

### Added
- **Automated a11y testing** — `@playwright/test` + `@axe-core/playwright`. WCAG 2.1 AA enforced on all pages, AAA best-effort logged. Keyboard navigation tests, color contrast checks, ARIA/landmark validation. Config: `playwright.config.ts`, tests: `e2e/accessibility.spec.ts`. Scripts: `pnpm test:a11y` / `pnpm test:a11y:ui`.
- **Locale routing** — `middleware.ts` handles locale detection/redirect (`/` → `/en`). `i18n/routing.ts` defines `en`/`es` locales. `i18n/navigation.ts` exports locale-aware `Link`, `useRouter`, `usePathname`, `redirect`. `NextIntlClientProvider` wraps the app in layout. `/en/...` and `/es/...` both resolve.
- **`/events` page** — Full page with upcoming event (featured, glow effects, flyer modal) + past events archive grid. Replaces `PageShell` placeholder. Uses existing `events.ts` data.
- **`/service` page** — New route replacing `/get-involved`. Sections: open service opportunities, Members-at-Large explainer (featured card with glow effects), "Why Get Involved" list, "How to Get Involved" with numbered steps and Zoom + Register CTAs. Copy provided by Nikki.
- **Payload CMS collections** — `collections/BlogPosts.ts` (title, slug, category, excerpt, richText body, featured image, first-name-only author, publish date, Spanish translation fields). `collections/FAQ.ts` (question, richText answer, category, sort order, Spanish fields). Both registered in `payload.config.ts`.
- **`i18n/navigation.ts`** — Locale-aware navigation exports from `next-intl/navigation`.

### Changed
- **App directory restructured** — `app/(frontend)/` moved under `app/[locale]/(frontend)/` for locale routing. All pages now live under the `[locale]` dynamic segment.
- **Server actions relocated** — `app/(frontend)/actions/` → `actions/` (top-level). Server actions can't live under a dynamic route segment. Imports updated in `breakfast-checkout.tsx`, `registration-checkout.tsx`, `registration-confirmation.tsx`.
- **Layout updated** — `app/[locale]/(frontend)/layout.tsx` now accepts `params.locale`, sets `<html lang={locale}>` dynamically, wraps children in `NextIntlClientProvider`.
- **`i18n/request.ts`** — Now reads locale from `requestLocale` instead of hardcoding `"en"`.

### Removed
- **`/testreg` route** — `app/(frontend)/actions/testreg.ts` + `components/testreg-checkout.tsx` deleted. Test checkout route is gone. Should have been removed ages ago.

### Housekeeping
- `.gitignore` updated with Playwright artifacts (`/test-results/`, `/playwright-report/`, `/blob-report/`, `/playwright/.cache/`).
- Cleared `.next` cache after directory restructure.
- FAQ and Bid pages moved to "blocked" status — awaiting content from Nikki.

---

## [Unreleased] - 2026-03-18 (b)

*Homepage gets a soul. The "What is a YPAA?" section is no longer a bulleted list of pillar cards — it's a narrative that walks you through showing up at your first convention. Also: upcoming events, Al-Anon page rebuild, Easter Sunday logic, and a FAQ reset because we're rewriting those from scratch. — Nikki*

### Added
- **`components/sections/ypaa-narrative-section.tsx`** — Two-part homepage section replacing `PurposeSection`. Part 1: "What is a YPAA?" explainer card with 3 inline SVG graphics (dancing figures, connection web, speaker podium), 6 experience highlight chips, and 3 themed question cards. Part 2: 16-step narrative timeline with glowing vertical line (purple→pink→cyan→gold), color-cycling dots, emphasis moments ("You experience connection." / "A Vision for You"), and a "Welcome to YPAA. Welcome home." finale with Register + FAQ CTAs.
- **Upcoming event data** — `upcomingEvent` object added to `lib/data/events.ts` for "The Ultimate Cool Down" ice cream social fundraiser (April 25, 2 PM, CCAR Willimantic). `EventData` interface + `PastEvent` backward-compat alias.
- **`components/alanon-info-accordion.tsx`** — Radix UI accordion with Al-Anon chair's informational content for the Al-Anon page.
- **Easter Sunday skip logic** — `components/sections/business-meeting-section.tsx` now computes Easter Sunday (Anonymous Gregorian algorithm) and skips business meetings that land on it.
- **Flyer image** — `public/images/ultimate-cool-down-flyer.png` added for the upcoming event.

### Changed
- **Homepage rebuilt** — `PurposeSection` (4 pillar cards + first-timer callout) replaced by `YpaaNarrativeSection` (narrative-driven, emotionally compelling, same Mad Realm visual language). Homepage import and section slot updated in `app/(frontend)/page.tsx`.
- **Al-Anon page rebuilt** — `app/(frontend)/alanon/page.tsx` completely rebuilt with chair's content: Al-Anon logo, info accordions, self-quiz banner, NECYPAA program teaser with pre-reg and hotel CTAs, Alateen paperwork placeholder. Mad Realm border bleed preserved.
- **Past Events section rebuilt** — `components/sections/past-events-section.tsx` now features the upcoming event prominently with flyer modal, gradient border, and glow effects, followed by the past events archive grid. Uses `@headlessui/react` Dialog for accessible flyer modal.
- **Nav link updated** — `#purpose` → `#what-is-ypaa` in `site-header.tsx` and `site-footer.tsx`.
- **FAQ data cleared** — `lib/data/faq.ts` emptied (array set to `[]`). Page shell and accordion infrastructure intact, awaiting new content from Nikki.

### Housekeeping
- ESLint `--max-warnings=0` — all new components pass clean.
- All SVGs use `aria-hidden="true"`, decorative emojis use `aria-hidden="true"`.
- Semantic `<section>` with `aria-label` on YPAA narrative section.
- Person-first language throughout all new content (no banned terms).
- Responsive verified: desktop 1280px + mobile 390px.

---

## [Unreleased] - 2026-03-18

*Debug pass + a11y enhancement pass. ESLint was literally crashing, imports were pointing at ghosts, and React thought our layout was lying about its type. All fixed now. — Nikki*

### Fixed
- **4 broken action imports** — When the app was restructured into `(frontend)`/`(payload)` route groups, nobody updated the import paths in `breakfast-checkout.tsx`, `registration-checkout.tsx`, `registration-confirmation.tsx`, and `testreg-checkout.tsx`. They all pointed at `@/app/actions/...` instead of `@/app/(frontend)/actions/...`. TypeScript was screaming. Now it's quiet.
- **ESLint config crash** — `eslint-config-next` uses `@rushstack/eslint-patch` internally, which is incompatible with ESLint 9. Rewrote `eslint.config.mjs` as proper flat config using individual plugins (`eslint-plugin-react`, `eslint-plugin-react-hooks`, `@next/eslint-plugin-next`, `@typescript-eslint/*`, `eslint-plugin-jsx-a11y`). Installed missing plugin packages as direct devDependencies.
- **Payload layout TS2786** — `RootLayout` from `@payloadcms/next` returns `Promise<JSX.Element>` (async server component), but `@types/react@18` doesn't know about RSCs. Added `@ts-ignore` with explanation. This is the documented workaround until `@types/react@19` ships proper RSC types.
- **12 ESLint warnings** — Unused imports (`ExternalLink`, `Type`, `AdminViewProps`), unused validated variables (prefixed with `_`), debug `console.log` statements removed from registration action, `selectedBreakfasts` memoized with `useMemo` to fix `react-hooks/exhaustive-deps`.
- **`testreg-checkout.tsx`** — Still had "Payment Error" heading and raw "Failed to create checkout session" / "Stripe publishable key not found" messages. Rewritten to warm tone matching rest of site.

### Changed (Accessibility)
- **Required field indicators** — Registration form asterisks (`*`) now have `aria-hidden="true"` + sr-only `(required)` text so screen readers announce required fields. Inputs also get `aria-required="true"`.
- **Error states** — All error displays across `registration-confirmation.tsx`, `breakfast-checkout.tsx`, `registration-checkout.tsx`, and `testreg-checkout.tsx` now use `role="alert"` + `aria-live="assertive"` so screen readers announce errors immediately.
- **Loading states** — All "Loading payment form..." states now use `role="status"` + `aria-live="polite"`.
- **Success states** — `registration-confirmation.tsx` success view now uses `role="status"` + `aria-live="polite"`.
- **Decorative SVGs** — Added `aria-hidden="true"` to decorative check/building SVGs in `registration-confirmation.tsx`.
- **Scholarship quantity controls** — +/- buttons now have `aria-label="Increase scholarship quantity"` / `aria-label="Decrease scholarship quantity"`. Quantity display uses `aria-live="polite"` + `aria-atomic="true"`.

### Housekeeping
- Installed `eslint-plugin-react`, `eslint-plugin-react-hooks`, `@next/eslint-plugin-next` as direct devDependencies (were previously only transitive deps of `eslint-config-next`).
- Removed debug `console.log` statements from `app/(frontend)/actions/registration.ts` (product name, price, processing fee, session ID). `console.error` for actual failures remains.
- Removed unused `AdminViewProps` import from Payload-generated admin page.
- Build verified: 0 TS errors, 0 ESLint warnings, 30/30 tests passing, 22 routes built.

---

## [Unreleased] - 2026-03-16

*Accessibility deep dive, doc audit, highest-standard directive. — Nikki*

### Added
- `ACCESSIBILITY_GUIDELINES.md` — comprehensive 10-section inclusion & accessibility document from the Accessibilities Chair. Now a governing document.
- `components/accessibility-panel.tsx` — slide-out settings panel with 6 user customization modes: dark/light, high-contrast, font size, dyslexia font, reduce motion, grayscale. Persists to localStorage.
- `lib/accessibility-context.tsx` — React context + provider for accessibility settings state.
- `app/accessibility/page.tsx` — real accessibility page with digital features grid, in-person accommodations, accommodation request, anonymous feedback form, and accessibility statement.
- `components/anonymous-feedback-form.tsx` — anonymous feedback form (no name/email required) on the accessibility page. Category selector + freeform text.
- `components/content-warning.tsx` — reusable click-to-expand content warning component for sensitive topics.
- `components/language-switcher.tsx` — i18n language switcher component (visual placeholder, ready to theme).
- `messages/en.json` + `messages/es.json` — i18n message files for static UI strings.
- `i18n/request.ts` — next-intl request configuration.
- `lib/data/states.ts` — all 12 NECYPAA member states + DC with intergroup, YPAA, Al-Anon, Alateen, and meeting finder links.
- `lib/data/faq.ts` — 6 categories, 16 draft Q&As for the FAQ page.
- `components/faq-accordion.tsx` — Radix UI accordion with category tabs for the FAQ page.
- AA trademark acknowledgment added to site footer.
- Accessibility statement + report-a-problem link added to site footer.
- Skip-to-content link and global `focus-visible` outline in `globals.css`.
- Escape key handlers + `role="dialog"` + `aria-modal="true"` on all modals (`flyer-modal.tsx`, `flyer-with-modal.tsx`, `accessibility-panel.tsx`).

### Changed
- WCAG target upgraded from AA to **AAA wherever achievable** (AA as absolute floor) — per Website Chair directive.
- All user-facing error messages rewritten for warm/inviting tone. No more "Payment Error" or "Failed to create checkout session." Now: "Hmm, something went wrong" with helpful next steps.
- `ACCESSIBILITY_GUIDELINES.md` follow-up items — all 5 resolved with highest-standard defaults (maximum anonymity, maximum sensitivity, AAA compliance, anonymous reporting, Chair sign-off before launch).
- `CONTRIBUTING.md` — added `.windsurf/rules.md` and `ACCESSIBILITY_GUIDELINES.md` to governing docs table, expanded project structure to reflect current codebase.
- `.windsurf/rules.md` — added `ACCESSIBILITY_GUIDELINES.md` as required reading.
- `NECYPREAMBLE.md` — full audit against codebase. Updated Sections 2, 4, 5, 6, 7, 11, 12, 16 to reflect current state. Marked completed items, flagged remaining work.

### Housekeeping
- Person-first language and banned language audit — clean across all source files.
- No auto-play media anywhere — confirmed clean.
- Vitest unit tests: 30/30 passing (`pnpm test`).
- Build: 21 routes, 87.3 kB shared JS — under 100kB target.

### Known follow-up items
- `/testreg` route still exists (`app/actions/testreg.ts`, `components/testreg-checkout.tsx`) — must remove before production.
- CSRF protection not yet implemented.
- Stripe webhook verification not yet implemented.
- Automated a11y testing (axe-core + Playwright) not yet set up.
- Locale routing (`/en/...`, `/es/...`) not yet active.
- Schedule pre-launch review meeting with Accessibilities Chair before anything goes live.

---

## [Unreleased] - 2026-03-10

*Full site polish, UX overhaul, and brand pass — with full art integration. Branch: `feat/site-polish-ux-brand-pass`. — Nikki*

### Changed
- **Full site visual makeover** — Nuked every last `slate-` and `amber-` Tailwind class across the entire codebase. Replaced with NECYPAA brand palette (navy, cyan, pink, orange, gold). Every card, button, border, checkbox, input, and summary block now speaks the same visual language. Components hit: `registration-checkout`, `registration-confirmation`, `registration-form`, `policy-agreement`, `breakfast-checkout`, `breakfast-ticket-selector`, `testreg-checkout`, `breakfast/page`, `cash/page`. No more "default Next.js starter kit" energy.
- **Glassmorphic card surfaces everywhere** — All form containers, summary blocks, and attribution sections upgraded to `rounded-2xl` with `rgba(26,34,54,0.6)` backgrounds, `var(--nec-border)` borders, and subtle `backdrop-blur`. Consistent depth across all pages.
- **CTA buttons unified** — All primary action buttons now use `var(--nec-pink)` with glow shadows. Back buttons use transparent outline with brand border. No more random `bg-amber-600` or `bg-blue-600`.

### Fixed
- **Build crash on static generation** — `quick-facts-strip.tsx` used `onMouseEnter`/`onMouseLeave` event handlers without `"use client"` directive. Next.js rightfully yelled about serializing event handlers in a Server Component. Added the directive, build passes clean.

### Art Integration (New)
- Image optimization: All upscaled art assets compressed (14MB → 68KB, 22MB → 81KB, etc.)
- `components/section-divider.tsx` — branded gradient dividers with neon glow and CSS splatter effects
- **Hero rebuilt** — Composed from individual art pieces: graffiti logo, Hartford CT text, dates strip, CT state art. No banner image, no QR code. Desktop: two-column layout with floating CT state accent. Mobile: stacked composition. Ambient glow blobs + CSS paint splatter texture.
- **Art throughout sections** — CT state art as watermark in Purpose section (III Points highlight bubble style), logo watermark in CTA cards, logo watermark in footer, CT watermark on success page
- **Page-level ambient glow** — BLINK-inspired radial gradient glow blobs (cyan, pink, orange) at fixed positions sitewide
- **Neon glow CSS utilities** — `.art-watermark`, `.ambient-glow`, `.nec-card-hover` for consistent art integration patterns

### Added
- `components/site-header.tsx` — new sticky, fully consistent header replaces the old split desktop/mobile nav. Same links on both breakpoints, Register CTA in nav at all times. Backdrop blur, scroll-aware border.
- `components/site-footer.tsx` — proper 3-column footer with event identity, quick links, and contact. Gradient accent bar at top.
- `components/mobile-cta-bar.tsx` — sticky bottom CTA bar on mobile. Register and Book Hotel always visible.
- `components/sections/hero-section.tsx` — rebuilt hero with clear hierarchy: NECYPAA → XXXVI → location → dates → price → CTAs. Flyer alongside. Ambient glow + paint-splatter energy from flyer palette. No more competing for attention.
- `components/sections/quick-facts-strip.tsx` — 6-pill scannable facts band: dates, location, hotel, price, convention type, register. Directly below hero.
- `components/sections/cta-section.tsx` — dedicated Register + Book Hotel dual-card CTA block. Impossible to miss. Branded gradient cards.
- `components/sections/purpose-section.tsx` — What is NECYPAA? 4-pillar cards + first-timer callout block. Warm, clear, not an essay wall.
- `components/sections/business-meeting-section.tsx` — extracted, componentized. Next date auto-calculated. Cleaner card presentation.
- `components/sections/meetings-section.tsx` — extracted from page.tsx, uses data from `/lib/data/meetings.ts`, consistent table styling.
- `components/sections/past-events-section.tsx` — extracted, uses data from `/lib/data/events.ts`. Archive framing, properly lower on page.
- `lib/data/meetings.ts` — all CT young people's meeting data extracted from page.tsx into a typed, maintainable config.
- `lib/data/events.ts` — all past event data extracted from page.tsx into structured typed objects.
- `app/register/success/page.tsx` — **actual registration success page** at `/register/success`. Has: confirmation message, next steps, hotel booking CTA, homepage link, contact fallback. Feels like part of the site.
- `app/globals.css` — full design token system derived from the NECYPAA flyer. CSS custom properties for cyan, pink, orange, gold, navy, card, border, text. Component classes: `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.nec-card`, `.section-badge`, `.section-heading`, `.fact-pill`, `.glow-*`. One coherent system.

### Changed
- `app/layout.tsx` — proper title, meta description, Open Graph, Twitter card metadata. Removed `generator: 'v0.app'`. SiteHeader now rendered globally.
- `app/page.tsx` — completely refactored. Down from 968 lines of inline everything to ~60 lines of clean composition. Homepage IA now follows: Hero → Quick Facts → CTA → Purpose → Business Meeting → Meetings → Past Events.
- `app/actions/registration.ts` — fixed `return_url` from hotel booking URL to `/register/success?session_id={CHECKOUT_SESSION_ID}`. Stripe now returns to our site, not a Marriott page. Reads `NEXT_PUBLIC_BASE_URL` env var with fallback to production domain.

### Fixed
- **"Your Not Alone" → "You're Not Alone"** — corrected in meetings data.
- **"New England Conference..." → "Northeast Convention..."** — corrected in footer.
- **"North East" → "Northeast"** — normalized across all new copy.
- **"Young Peoples" → "Young People's"** — corrected in all new components.
- **"UConn Young Peoples" → "UConn Young People's"** — corrected in meetings data.
- **"Y.A.N.A. Young Peoples Group" → "Y.A.N.A. Young People's Group"** — corrected.
- **"Coventry Young Peoples Group" → "Coventry Young People's Group"** — corrected.
- **"Wolcott Activ & Learning Center" → "Wolcott Activity & Learning Center"** — typo corrected.
- Desktop nav was missing "Events" that mobile nav had. Nav is now fully consistent.
- Registration Stripe return URL was pointing to Marriott hotel page, bypassing any post-payment UX.
- Footer said "New England" instead of "Northeast" — fixed.
- `generator: 'v0.app'` removed from public-facing metadata. We are not a v0.app project.

### Removed
- All inline meeting data from `app/page.tsx` (moved to `lib/data/meetings.ts`)
- All inline event data from `app/page.tsx` (moved to `lib/data/events.ts`)
- Old `components/mobile-menu.tsx` usage (replaced by `site-header.tsx` which handles both desktop and mobile in one consistent component)
- Business logic (`getNextBusinessMeetingDate`, `formatMeetingDate`) moved out of `app/page.tsx` into `business-meeting-section.tsx`

### Housekeeping
- page.tsx: 968 lines → ~60 lines
- Component tree is now meaningful and maintainable
- Design tokens live in one place (`:root` in globals.css)
- All new components are typed and use shared constants from `lib/constants.ts`

### Cleanup
- Deleted `components/mobile-menu.tsx` — superseded by `site-header.tsx`
- Deleted `styles/globals.css` — orphaned duplicate; `app/globals.css` is active
- Deleted `app/testreg/` — leftover dev/test route
- Deleted unused image files: `site-url-text.png`, `necypaa-logo-alt.png`, `necypaa-banner-alt.jpg`
- Updated `package.json` name: `"my-v0-project"` → `"necypaa-ct"`
- Added `openart-download/` to `.gitignore` (raw source assets, not needed in repo)

### Known follow-up items
- `NEXT_PUBLIC_BASE_URL` should be set in your `.env.local` and production env (default fallback: `https://www.necypaact.com`)
- `app/cash/page.tsx` and `app/breakfast/page.tsx` were not in scope for this pass — review separately
- Meeting data should be periodically audited against ct-aa.org for accuracy
- Social share image (`/images/necypaa-xxxvi-flyer.png`) is used for OG — ensure it is 1200×630 or close for best display

## [Unreleased] - 2026-03-03

*Initial cleanup after inheriting the project. Thank you to everyone who built this.*

### Housekeeping
- Consolidated config files to `.mjs` format
- Updated `@types/react` to v19 to match runtime
- Enabled strict TypeScript builds
- Fixed typo: "Your Not Alone" → "You're Not Alone"
- Added env validation for Stripe key
- Removed unused props and stale comments

### Added
- `lib/types.ts` — shared interfaces
- `lib/constants.ts` — shared URLs
- Open Graph meta tags for social sharing
- `NECYPREAMBLE.md` — comprehensive planning doc for the full site rebuild

### Technical Notes
- Build passes, all routes compile
- 87.3 kB shared JS
