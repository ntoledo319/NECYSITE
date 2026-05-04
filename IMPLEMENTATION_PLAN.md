# NECYPAA XXXVI — Implementation Plan

**Source:** `SITE_AUDIT.md` findings
**Date:** March 2026
**Alterations Applied:**

1. ~~Email newsletter/capture~~ — Removed. Not happening.
2. ~~"Add social media links"~~ — Replaced with **Anonymity-Safe Share Menu** (DM-only platforms per AA Tradition 11/12). Platform list sourced from the necysite landing page.
3. **Inventory shell text** — Verified universal. The inner shell text ("The committee is working on this…" / "In the meantime, why not get to work on that fourth step?") is consistent across all 5 placeholder pages. Each page has a unique `subtitle` prop describing what content will eventually live there — this is intentional and correct.

---

## Phase 1 — Quick Wins (Low Effort, High Impact)

These can each be done in a single sitting. No dependencies between them.

### 1.1 Active Page Indicator in Navigation

**Audit ref:** §3, §10 — "No active/current page indicator in nav links"
**What:** Highlight the current page in both desktop and mobile nav using `usePathname()` from `next/navigation`. Add an underline/dot/background color to the matching nav item.
**Files:** `components/site-header.tsx`
**Effort:** ~30 min

### 1.2 Bump `--nec-muted` for AAA Small-Text Compliance

**Audit ref:** §7 — "`--nec-muted` (#9b8cb8) passes AA but not AAA for small text"
**What:** Change `--nec-muted` from `#9b8cb8` to `#b8a8d0` (or similar) to hit 7:1 contrast ratio against `--nec-navy`. Update high-contrast and light mode overrides accordingly.
**Files:** `app/[locale]/(frontend)/globals.css`
**Effort:** ~15 min

### 1.3 Audit & Remove Pacifico Font (If Unused)

**Audit ref:** §6 — "Pacifico (`--font-script`) is loaded but appears unused"
**What:** Grep the entire codebase for `font-script` or `pacifico` usage. If zero hits, remove the import from `app/[locale]/(frontend)/layout.tsx` and the CSS variable declaration. Saves ~20KB.
**Files:** `app/[locale]/(frontend)/layout.tsx`, `globals.css`
**Effort:** ~10 min

### 1.4 Add JSON-LD Structured Data

**Audit ref:** §17 — "No JSON-LD schema"
**What:** Add `Event`, `Organization`, `FAQPage`, and `BreadcrumbList` schemas. The `Event` schema goes in the root layout or homepage. `FAQPage` goes on `/faq`. Can be implemented as a `<script type="application/ld+json">` in the page's metadata export.
**Files:** `app/[locale]/(frontend)/page.tsx`, `app/[locale]/(frontend)/faq/page.tsx`, `app/[locale]/(frontend)/layout.tsx`
**Effort:** ~45 min

### 1.5 Add `sitemap.xml` Generation

**Audit ref:** §17 — "Add a sitemap.xml"
**What:** Create `app/sitemap.ts` using Next.js built-in sitemap generation. List all public routes.
**Files:** `app/sitemap.ts` (new)
**Effort:** ~15 min

### 1.6 Cross-Sell Breakfast on Registration Success Page

**Audit ref:** §4 — "Breakfast ticket page has no cross-sell from registration flow"
**What:** Add a "Don't forget breakfast!" card on `/register/success` with a link to `/breakfast`. Style as a secondary CTA below the hotel booking card.
**Files:** `app/[locale]/(frontend)/register/success/page.tsx`
**Effort:** ~20 min

### 1.7 Show At-Door vs Online Price Comparison

**Audit ref:** §4, §13 — "No indication of what the at-door price will be"
**What:** If the at-door price is known, update the hero section, CTA section, and quick facts strip to show "$40 online / $X at the door" or "Save $Y". If the at-door price isn't set yet, add a "Price increases at the door" note.
**Files:** `components/sections/hero-section.tsx`, `components/sections/cta-section.tsx`, `components/sections/quick-facts-strip.tsx`
**Effort:** ~20 min
**Depends on:** Knowing the at-door price (ask the committee)

### 1.8 Add "Add to Calendar" Buttons

**Audit ref:** §4, §13 — "No 'Add to Calendar' buttons"
**What:** Create an `AddToCalendar` component that generates `.ics` download for the convention dates (Dec 31 2026 – Jan 3 2027, Hartford Marriott Downtown). Add to hero section and/or register success page. Can reference the calendar logic from the necysite project (platform-aware iOS/Android/desktop detection).
**Files:** `components/add-to-calendar.tsx` (new), `components/sections/hero-section.tsx`, `app/[locale]/(frontend)/register/success/page.tsx`
**Effort:** ~1 hr

---

## Phase 2 — Anonymity-Safe Share Menu (Medium Effort, High Impact)

### 2.1 Create `ShareMenu` Component

**Audit ref:** §13 — Previously "Add social media links" → now AA Tradition-compliant DM-only sharing
**What:** Build a React bottom-sheet share menu with 10 anonymity-safe platforms. No public social feeds (no Twitter, Facebook, Instagram). Direct-message or private-channel only.

**Platforms (from necysite):**
| Platform | Method | URL Scheme |
|----------|--------|-----------|
| WhatsApp | Direct link | `https://wa.me/?text=` |
| iMessage / SMS | Direct link | `sms:&body=` |
| Email | Direct link | `mailto:?subject=&body=` |
| Telegram | Direct link | `https://t.me/share/url?url=&text=` |
| FB Messenger | Direct link | `fb-messenger://share/?link=` |
| Signal | Copy to clipboard | Toast: "Copied — paste in Signal" |
| Discord | Copy to clipboard | Toast: "Copied — paste in Discord" |
| Snapchat | Copy to clipboard | Toast: "Copied — paste in Snapchat" |
| GroupMe | Copy to clipboard | Toast: "Copied — paste in GroupMe" |
| Kik | Copy to clipboard | Toast: "Copied — paste in Kik" |

**Requirements:**

- Bottom sheet slides up from bottom (mobile) / modal (desktop)
- `role="dialog"`, `aria-modal="true"`, `aria-label="Share this page"`
- `useFocusTrap` for keyboard accessibility
- Escape key to close
- Backdrop click to close
- Each platform button has SVG icon + label
- Clipboard platforms show toast notification via `aria-live="polite"` region
- Reduced motion: no slide animation when `.a11y-reduce-motion` active
- Light mode + high contrast style overrides

**Files:** `components/share-menu.tsx` (new), `components/ui/toast.tsx` (new or existing)
**Effort:** ~2–3 hrs

### 2.2 Add Share Buttons to Key Pages

**What:** Add a "Share" button that triggers the `ShareMenu` on:

- Event detail cards on `/events`
- Registration success page (`/register/success`) — "Tell your friends!"
- Homepage (in CTA section or as a floating action)
- Individual blog posts (if/when blog has content)

**Files:** `app/[locale]/(frontend)/events/page.tsx`, `app/[locale]/(frontend)/register/success/page.tsx`, `components/sections/cta-section.tsx`
**Effort:** ~1 hr (after ShareMenu component exists)

---

## Phase 3 — UX & Navigation Polish (Medium Effort, Medium Impact)

### 3.1 Homepage Anchor Link Indicator

**Audit ref:** §2 — "Nav items that scroll to homepage sections could confuse users"
**What:** Add a subtle visual cue (↓ arrow or "(on this page)" tooltip) to "What is YPAA?" and "Business Meeting" dropdown items to indicate they scroll to a section on the homepage rather than navigating to a new page.
**Files:** `components/site-header.tsx`
**Effort:** ~30 min

### 3.2 FAQ Search/Filter

**Audit ref:** §10 — "No search/filter on FAQ"
**What:** Add a search input at the top of the FAQ page that filters questions in real-time as the user types. Filter on both question text and answer text. Announce result count via `aria-live`.
**Files:** `app/[locale]/(frontend)/faq/page.tsx` (or the `FAQAccordion` component)
**Effort:** ~1 hr

### 3.3 Default to List View on Mobile for States Page

**Audit ref:** §11 — "SVG map may be cramped on mobile"
**What:** Use a media query or `useMediaQuery` hook to default to the list view on screens < 768px. The map toggle button stays available for users who want it.
**Files:** `app/[locale]/(frontend)/states/page.tsx`
**Effort:** ~20 min

### 3.4 Dynamic Import Game Components

**Audit ref:** §16 — "Game components are chunky bundles for otherwise server-rendered pages"
**What:** Wrap each game import in `next/dynamic` with `{ ssr: false }` to code-split them out of the initial page bundle. They only load when the user clicks "Inventory in Progress."
**Files:** `app/[locale]/(frontend)/program/page.tsx`, `merch/page.tsx`, `prayer/page.tsx`, `bid/page.tsx`, `asl/page.tsx`
**Effort:** ~30 min

### 3.5 Increase Minimum Text Size

**Audit ref:** §6 — "Some text uses `text-xs` (12px) which may be too small"
**What:** Audit all `text-xs` usage in card descriptions and secondary content. Replace with `text-sm` (14px) where the text is meant to be read (not decorative labels). Keep `text-xs` for labels, badges, and metadata.
**Files:** Multiple components
**Effort:** ~45 min

### 3.6 Extract Inline Card Styles into CSS Classes

**Audit ref:** §5, §9 — "CTA, Event, and Narrative card variants use unique inline styles"
**What:** Create 2–3 accent card CSS classes (e.g., `.nec-card--purple`, `.nec-card--gold`, `.nec-card--pink`) in `globals.css` that handle the gradient backgrounds and borders. Replace inline `style={{}}` in `cta-section.tsx`, `events-preview-section.tsx`, and `ypaa-narrative-section.tsx`.
**Files:** `globals.css`, `components/sections/cta-section.tsx`, `components/sections/events-preview-section.tsx`, `components/sections/ypaa-narrative-section.tsx`
**Effort:** ~1 hr

---

## Phase 4 — Content & Marketing (Depends on Committee Input)

These items require content or decisions from committee members.

### 4.1 Complete Placeholder Pages

**Audit ref:** §2, §10 — "5 of 17 pages are placeholder"
**Status:** Content must come from respective committee chairs:

- **Program** — Program Chair (convention schedule)
- **Merch** — Merch Chair (store/catalog)
- **Prayer** — Prayer Chair (spiritual resources)
- **Bid** — Advisory liaison (bidding process docs)
- **ASL** — Accessibilities Chair (ASL interpreter info)

**Current state:** Each page has a unique, descriptive subtitle and the universal "committee is working on this" shell text. The InventoryShell component and inner messaging are consistent. Games are a fun placeholder. No code changes needed — just content.

### 4.2 Add Testimonials / Attendee Quotes

**Audit ref:** §13 — "No testimonials/quotes from past convention attendees"
**What:** Collect 3–5 short quotes from past NECYPAA attendees. Create a `TestimonialsSection` component for the homepage (between YPAA narrative and business meeting sections). Anonymous attribution is fine ("— First name, State").
**Depends on:** Collecting quotes from the fellowship
**Effort (code):** ~1 hr once content exists

### 4.3 Past Event Photo Gallery

**Audit ref:** §12 — "No photo gallery from past events"
**What:** Add a photo gallery section to `/journey` or create a `/gallery` page. Use `next/image` with blur placeholders. Ensure all photos have descriptive alt text and respect anonymity (no full names on faces without consent).
**Depends on:** Collecting and curating photos
**Effort (code):** ~2 hrs once photos exist

### 4.4 Add Countdown Timer to Hero

**Audit ref:** §13 — "No countdown timer"
**What:** Create a `CountdownTimer` component showing days/hours/minutes until Dec 31, 2026 at 6:00 PM ET. Place in hero section below the dates. Respect reduced motion (no ticking animation). Show static "X days away" in reduced-motion mode.
**Files:** `components/countdown-timer.tsx` (new), `components/sections/hero-section.tsx`
**Effort:** ~1 hr

### 4.5 i18n — Complete Spanish Translations

**Audit ref:** §18 — "Spanish translations appear incomplete"
**What:** Audit all message bundle files. Identify missing Spanish translations. Either complete them or remove the `es` locale from routing config until ready.
**Depends on:** Spanish-speaking committee member or translator
**Effort:** Variable (depends on translation volume)

---

## Execution Order (Recommended)

```
Week 1: Phase 1 quick wins (1.1–1.6, 1.8)
         └─ All independent, can be done in parallel or series
         └─ 1.7 if at-door price is known

Week 2: Phase 2 share menu (2.1–2.2)
         └─ Biggest new feature, do it as a focused block

Week 3: Phase 3 UX polish (3.1–3.6)
         └─ All independent, can be done in any order

Ongoing: Phase 4 content items as committee provides material
```

---

## Items Explicitly Removed from Audit Recommendations

| Recommendation                              | Reason Removed                                                                                                                           |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Email newsletter / capture                  | Committee decision — not doing this                                                                                                      |
| Social media links (Instagram, etc.)        | AA Tradition 11 — anonymity at the level of press, radio, and films. Public social feeds violate this. Replaced with DM-only share menu. |
| "Notify me when ready" on placeholder pages | Removed because no email infrastructure. Placeholder pages have descriptive subtitles.                                                   |

---

## Inventory Shell Verification

The inner text of `InventoryShell` (lines 161–226 of `components/games/inventory-shell.tsx`) is **universal** across all 5 pages:

- **Heading:** "The committee is working on this…"
- **Body:** "This page is being put together by the host committee. In the meantime, why not get to work on that fourth step?"
- **Button:** "Inventory in Progress"
- **Quote:** "Made a searching and fearless moral inventory…" — Step 4

Each page passes a **unique `subtitle` prop** describing the specific content that will live there:

| Page       | Subtitle                                                                                                                          |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `/program` | "Four days of speakers, workshops, meetings, and fellowship. The full schedule will be posted here as the convention approaches." |
| `/merch`   | "Official NECYPAA XXXVI gear is on the way. All proceeds support the convention."                                                 |
| `/prayer`  | "Spiritual resources and reflections. Content from the Prayer Chair coming soon."                                                 |
| `/bid`     | "Interested in hosting a future NECYPAA? Here's everything you need to know about the bidding process."                           |
| `/asl`     | "American Sign Language interpretation and signing resources for the convention. Details coming soon."                            |

This is correct and intentional — no changes needed.
