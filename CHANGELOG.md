# Changelog

> Keeping track of what changed and when.

## [Unreleased] - 2026-03-10

*Full site polish, UX overhaul, and brand pass — with full art integration. Branch: `feat/site-polish-ux-brand-pass`. — Nikki*

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
