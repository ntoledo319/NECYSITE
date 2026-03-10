# NECYPREAMBLE

> The planning document that exists before the website does. Like a preamble, but for code.

**Last updated:** 2026-03-04
**Owner:** Nikki, Website Chair
**Status:** Pre-theme. Preparing everything we can so the moment art drops, we ship.

---

## Table of Contents

1. [Project Vision](#1--project-vision)
2. [Current State](#2--current-state)
3. [Site Architecture](#3--site-architecture)
4. [What We Can Do Now](#4--what-we-can-do-now)
5. [What We Can Plan For Now](#5--what-we-can-plan-for-now)
6. [What We Need to Wait For](#6--what-we-need-to-wait-for)
7. [Content Dependencies (People We Need Things From)](#7--content-dependencies)
8. [Technical Architecture Decisions](#8--technical-architecture-decisions)
9. [Internationalization (Spanish)](#9--internationalization)
10. [Accessibility & ASL](#10--accessibility--asl)
11. [Security](#11--security)
12. [AI Agent & Contributor Rules](#12--ai-agent--contributor-rules)
13. [The Traditions (How They Affect Every Page)](#13--the-traditions)
14. [Design Philosophy](#14--design-philosophy)
15. [Member States & Resources](#15--member-states--resources)
16. [Open Questions](#16--open-questions)

---

## 1 · Project Vision

This website will be the digital home for NECYPAA XXXVI — the 36th North East Convention of Young People in Alcoholics Anonymous, hosted by Connecticut.

**The goal is not a website. The goal is art.**

The arts chair is creating the visual identity — theme, graphics, color palette, typography direction. The website will grow *out of* that art. Not slap a theme on a template. Not skin a Bootstrap site. The design, the interactions, the feeling of using this site should be an extension of whatever the arts chair creates. The website itself is a creative work.

It must also be:
- The most accessible convention website anyone's ever seen
- Fully available in Spanish (human-translated, not machine)
- Secure (people are paying us money through this)
- Mobile-first (most of our users are on phones)
- Tradition-compliant (see `AA_TRADITIONS_GUARDRAILS.md`)
- Fun to use
- Built with love

**Four-day convention. December 31, 2026 – January 3, 2027. Hartford Marriott Downtown.**

---

## 2 · Current State

### What Exists
- Next.js 14 app (App Router, TypeScript, Tailwind CSS)
- Single-page site with event listings, meeting schedules, flyer modals
- Working Stripe registration flow (regular, scholarship, breakfast tickets, free/cash)
- Policy agreement enforcement before payment
- Deployed on Vercel
- `AA_TRADITIONS_GUARDRAILS.md` — comprehensive traditions compliance doc
- `.windsurf/workflows/changelog.md` — changelog tone rules

### What Was Just Cleaned Up (2026-03-03)
See `CHANGELOG.md` for details:
- Duplicate config files removed
- React 19 types fixed
- Strict TypeScript builds enabled
- Centralized types and constants created
- Open Graph meta tags added
- Build passes clean

### What Needs to Change
**Everything visual.** The current site is a dark-mode gray/blue design inherited from v0.app scaffolding. It works, but it's not *ours*. The moment we have a theme, the entire visual layer gets rebuilt. The infrastructure, routing, and payment logic stay.

---

## 3 · Site Architecture

### Pages (Final Target)

```
/                           — Landing page (What is YPAA? What is NECYPAA?)
/register                   — Registration (existing, needs redesign)
/program                    — Convention program/schedule
/events                     — Events listing (fundraisers, pre-convention, etc.)
/accessibility              — Accessibility info, accommodations, requests
/blog                       — NECYBLOG (articles, updates, stories)
/blog/[slug]                — Individual blog post
/faq                        — Frequently Asked Questions
/merch                      — Merchandise (dropshipping store)
/bid                        — How to start a bid for future NECYPAAs
/get-involved               — Volunteering, service positions, committees
/journey                    — "The Journey Comes First" — archive of past events
/prayer                     — Prayer Chair resources and content
/alanon                     — Al-Anon information and resources
/states                     — Member states map with local resources
/asl                        — ASL flyer and signing resources
/breakfast                  — Breakfast ticket checkout (existing)
/cash                       — Free registration flow (existing)

--- Spanish parallel ---
/es                         — Spanish landing page
/es/register                — Spanish registration
/es/program                 — Spanish program
/es/[every-page]            — Full parallel Spanish site
```

### External Links (Not Pages We Build)
- https://necypaa.org/ — NECYPAA Advisory site
- https://www.marriott.com/event-reservations/reservation-link.mi?id=1770049957031&key=GRP&app=resvlink — Hotel booking

---

## 4 · What We Can Do Now

These items have **zero dependency on theme, art, or committee votes.** They are infrastructure, architecture, and content scaffolding.

### 4.1 Break Into Multi-Page App
- Set up the route structure from Section 3
- Create placeholder pages with consistent layout scaffolding
- Set up shared layout components (nav, footer, mobile menu) that can be re-skinned later
- Move existing registration, breakfast, and cash flows to their routes (already done)

### 4.2 Content Management System (Maybe)
**Exploring: Sanity CMS** (headless, pairs natively with Next.js, generous free tier, real-time preview, supports i18n)

**Status:** Not yet committed. A CMS is powerful but adds significant setup work. Still evaluating whether the benefits (non-technical editing, structured content) justify the investment at this stage. Building in a way that keeps the door open either way.

If we go this route, schemas would cover:
- **Blog posts** — title, slug, body (rich text), author (first name only per traditions), date, featured image, Spanish translation field
- **Events** — name, date, location, description, flyer image, Spanish translation
- **FAQ entries** — question, answer, category, Spanish translation
- **Program schedule** — day, time blocks, session titles, descriptions, Spanish translation
- **State resources** — state name, intergroup links, YPAA groups, meeting finder links

This *could* be built and populated before we have a theme. Content is content.

### 4.3 Internationalization (i18n) Setup
- Install and configure `next-intl` for locale routing (`/en/...`, `/es/...`)
- Set up message files structure for static UI strings
- Create translator-friendly content workflow (see Section 9)
- Build language switcher component (unstyled, ready to theme)

### 4.4 Security Hardening
- Audit Stripe integration (see Section 11)
- Add rate limiting to server actions
- Add CSRF protection
- Set up Content Security Policy headers
- Review env variable handling
- Add input validation/sanitization on all form fields

### 4.5 Accessibility Infrastructure
- Set up automated a11y testing (axe-core + Playwright)
- Ensure all existing components meet WCAG 2.1 AA minimum
- Add skip-to-content links, ARIA landmarks, focus management
- Set up a11y CI check in build pipeline
- Prepare template/prompt for Accessibilities Chair (see Section 7)

### 4.6 AI Agent Rules System
- Ensure `AA_TRADITIONS_GUARDRAILS.md` is referenced in all agent contexts
- Create `.windsurf/rules.md` or equivalent that points agents to all governing docs
- Build a `CONTRIBUTING.md` that covers human + AI contributor rules
- Create pre-commit or CI checks for tradition violations (see guardrails Section 7.2)

### 4.7 Code Quality & Architecture
- Set up ESLint + Prettier with consistent config
- Add Playwright for e2e tests on registration flow
- Add unit tests for processing fee calculation and other business logic
- Set up staging environment on Vercel (preview deployments)
- Clean up the `/testreg` test route (remove or protect behind auth)

### 4.8 Member States Data
- Build the data structure for all member states (see Section 15)
- Research and compile intergroup links, YPAA contacts, meeting finder URLs
- Compile per-state Al-Anon website URLs (for Al-Anon page state flag links)
- Compile per-state Alateen website URLs
- Collect state flag SVGs (public domain) for both the states page and the Al-Anon page
- Research AA Meeting Guide API (https://www.aa.org/meeting-guide-app) for embedded AA meeting finder on states page
- Research Al-Anon meeting finder embed/API options (al-anon.org/al-anon-meetings)
- This is pure data work — no design dependency

### 4.9 "The Journey Comes First" Archive
- Move existing past event data (Zombie Prom, NYE Meeting, Trivia Night, etc.) into a structured format
- Collect additional flyers, event names, dates from committee history
- Build data model for archived events (no faces, no full names per traditions)

### 4.10 Blog Infrastructure
- Set up Sanity blog schema
- Build markdown/rich-text rendering pipeline
- Set up draft/preview workflow
- No visual design needed yet — just the plumbing

---

## 5 · What We Can Plan For Now

These items need **design input, content from other chairs, or decisions** — but we can plan the architecture, write specs, and build unstyled scaffolding.

### 5.1 Program Page
**Needs:** Final convention program/schedule
**Can plan now:**
- Data schema (day → time blocks → sessions)
- Filtering UI spec (by day, by track, by accessibility features)
- Mobile-friendly schedule view (cards, not tables)
- Print-friendly version
- Spanish parallel content structure

### 5.2 FAQ Page
**Needs:** Final FAQ content (can start drafting common questions)
**Can plan now:**
- Accordion/search UI pattern
- Category grouping
- CMS schema for easy editing
- Spanish translation workflow

### 5.3 Bid Page ("How to Start a Bid")
**Needs:** Content from Nikki (raw content exists, needs to be websiteified)
**Can plan now:**
- Page structure and information architecture
- What sections are needed (requirements, timeline, process, past bids, contact)
- CMS or markdown-based content

### 5.4 Getting Involved Page
**Needs:** Better name (you flagged this), content about service positions
**Can plan now:**
- What service roles exist and how to describe them
- Contact methods (role-based emails per traditions, not personal)
- CMS schema

**Name ideas:** "Serve With Us" / "Join the Work" / "Get In Where You Fit In" / "Service" — your call.

### 5.5 Prayer Chair Page
**Needs:** Content from Prayer Chair
**Can plan now:**
- Page template and content structure
- What kind of content goes here (daily reflections? prayer requests? resources?)
- Per traditions: no endorsement of specific religious content, frame as spiritual resource

### 5.6 Al-Anon Page (CONFIRMED — Content Received)
**Status:** Have copy from Al-Anon chair. Rough design direction defined.
**Content:** Text-based — Al-Anon statement and resources, plus a unique combined graphic.
**Tone:** More professional than the rest of the site. This page speaks with Al-Anon's voice, not ours.

**Design vision:**
- Page borders/frame use our NECYPAA theme — colors, motifs, whatever the arts chair creates
- Those themed borders *bleed inward* toward the center, but the core content area transitions into Al-Anon's own traditional visual identity
- The effect: our convention wraps around and honors Al-Anon's space, rather than absorbing it into our brand
- Think of it like a gallery frame (ours) around their painting (theirs)
- The combined graphic lives here — unique to this page

**Features:**

1. **Al-Anon Meeting Finder (embedded)**
   - "Meetings Near You" feature with list view + interactive map
   - Ideally pull from Al-Anon's existing meeting finder (al-anon.org/al-anon-meetings) — embed or API integration if available, otherwise link prominently
   - Research: does Al-Anon have a public API like AA's Meeting Guide? If not, embed their search in an iframe or link out with a styled call-to-action
   - Must work well on mobile (map + list toggle)

2. **State Flag Grid — Al-Anon**
   - Visual grid of all 12 member states + DC using state flag graphics
   - Each flag links to that state's Al-Anon website
   - Should feel fun and inviting — not a boring link list

3. **State Flag Grid — Alateen**
   - Separate grid, same flag treatment, linking to each state's Alateen website
   - Some states may have a combined Al-Anon/Alateen site; link to the Alateen-specific page where possible
   - Consider a slightly different visual treatment or heading to distinguish from the Al-Anon grid while keeping the same design language

   *Both grids:* Per Tradition 6, these are outbound resource links, clearly framed as such ("you are leaving our site" pattern per guardrails Section 3.5)

**Can plan now:**
- Page layout with dual-identity border/content zone architecture
- Component that renders themed outer frame + clean inner content area
- State flag asset collection (public domain / official state flag SVGs)
- Meeting finder embed/API research
- State-by-state Al-Anon and Alateen URL compilation (see Section 4.8)
- Disclaimer language (Per Tradition 6: clear that NECYPAA is not affiliated with Al-Anon; this is a resource page, not an endorsement)
- Responsive behavior for the bleed effect and flag grid on mobile
- Content integration from Al-Anon chair's copy

**Tradition 6 compliance:**
- We cannot imply affiliation. Frame as "resources for friends and family"
- Link to al-anon.org — let them speak for themselves
- State flag links are outbound resources, not endorsements
- Our role: provide the space, not the message

### 5.7 ASL Content
**Needs:** ASL interpreters/signers to create video content, decision on scope
**Can plan now:**
- Video player component and embedding strategy
- Which pages get ASL versions (priority: landing, registration, accessibility, program)
- Where ASL toggle lives in the UI
- Captioning/transcript strategy for all video content
- Talk to Accessibilities Chair about this

### 5.8 Merch Page (CONFIRMED)
**Status:** Merch chair confirmed — we need merch page(s) for dropshipping.
**Blocked on:** Need from merch chair and/or treasury:
- What payment collection service to embed (Stripe? Shopify embed? Printful? Other?)
- What shipping collection/fulfillment service is being used
- Whether merch chair needs the ability to update the merch page themselves (add/remove items, update prices, mark sold out) — if so, CMS-based merch management is the move. If not, we update it manually.

**Can plan now:**
- Product card components (image, name, price, sizes/variants)
- Cart/checkout flow architecture
- Responsive product grid layout
- CMS schema for merch items (name, description, price, images, variants, availability)
- Per Tradition 7: all proceeds support the convention, not outside entities

### 5.9 Mobile Experience
**Needs:** Theme/design to implement
**Can plan now:**
- Mobile-first component architecture
- Touch-friendly interaction patterns
- Bottom navigation vs. hamburger menu evaluation
- Offline capability assessment (service worker for program/schedule?)
- Performance budget (target: <100kB JS, <3s LCP on 3G)

---

## 6 · What We Need to Wait For

These items are **blocked** until a specific dependency is resolved.

### 6.1 🎨 Theme & Art (Blocked on: Committee Vote)
**This is the big one.** Everything visual waits on this.

Once we receive from the arts chair:
- Color palette
- Typography direction
- Key graphics/illustrations
- Visual mood/feeling

We will:
- Build the entire Tailwind theme config
- Design and implement all page layouts
- Create component library (buttons, cards, modals, forms)
- Build animations and transitions that match the art's energy
- Style the mobile experience
- Create the visual identity for the Spanish site (same theme, localized)

**Preparation:** Have all infrastructure, routing, CMS, and content ready so that when art drops, we focus purely on design implementation. Zero time wasted on plumbing.

### 6.2 🇪🇸 Spanish Translation (Blocked on: Finding a Translator)
**Status:** Looking for a translator.
**What's needed:** A fluent Spanish speaker (ideally in recovery, familiar with AA terminology in Spanish) to translate all site content.
**Not acceptable:** Google Translate, DeepL, or any machine translation. This must be human.
**Why:** AA has specific Spanish terminology (La Viña, GSO Spanish resources). Machine translation gets this wrong and can be harmful.

**When translator is found:**
- Give them access to Sanity CMS (or a spreadsheet export)
- Establish review process (ideally two Spanish-speaking members review)
- Prioritize: Landing page → Registration → Program → FAQ → Everything else

### 6.3 ♿ Accessibilities Chair Guardrails (Blocked on: Email Response)
**Status:** Nikki is emailing the Accessibilities Chair.
**What we need from them:** A detailed and comprehensive rules/ideas/guardrails document for all programmers and AI agents covering:
- Minimum accessibility standards (WCAG level)
- Specific accommodations to support (screen readers, keyboard nav, color contrast, motion sensitivity, cognitive accessibility)
- ASL implementation guidance
- Interpretation services info
- Physical accessibility info for the venue
- Any accommodation request workflow

**Template prompt for the email (ready to send):**

> Hey [Name],
>
> I'm building out the convention website and I want to make sure accessibility is baked into every single page from the start — not bolted on later.
>
> Could you put together a document covering:
> 1. What accessibility standards we should meet (WCAG 2.1 AA? AAA for some things?)
> 2. Specific accommodations we should support on the website (screen readers, keyboard navigation, color contrast, reduced motion, cognitive accessibility, etc.)
> 3. ASL — what should be in ASL on the site? Video of someone signing? Which pages?
> 4. Any interpretation services we're offering and how to communicate them
> 5. Physical venue accessibility info we should include
> 6. How people should request accommodations (form? email? both?)
> 7. Anything else you think programmers and AI tools should know
>
> This will become a guardrails document that every person and AI agent working on the site has to follow. So the more detailed the better.
>
> Thank you for your service on this. It matters.

### 6.4 📦 Merch Implementation (Blocked on: Payment/Shipping Details)
**Status:** Merch page confirmed. Dropshipping model.
**Blocked on:** Merch chair / treasury need to tell us:
1. What payment service to embed (Stripe, Shopify Buy Button, Printful checkout, etc.)
2. What shipping/fulfillment service they're using (Printful, Printify, Gooten, etc.)
3. Whether merch chair wants self-service page editing access (add/remove products without a developer) — if yes, we set them up in Sanity CMS with a simple merch editor

**Note on non-technical edit access:** If merch chair needs to update products themselves, Sanity CMS gives them a visual editor — no code required. They log in, add a product with images/price/description, hit publish. We control the layout and design, they control the catalog. This is the recommended approach.

### 6.5 📝 Content From Various Chairs
| Content | Source | Status |
|---------|--------|--------|
| Convention program | Program Chair | Not yet available |
| Prayer page content | Prayer Chair | Not yet available |
| Al-Anon resources | Al-Anon Chair | Copy received, design pending theme |
| Bid guide content | Nikki | Has raw content, needs to websiteify |
| Blog posts | Various | No posts yet |
| ASL videos | Accessibilities Chair + interpreters | Not yet planned |

---

## 7 · Content Dependencies

### People We Need Things From

| Person/Role | What We Need | Priority | Status |
|-------------|-------------|----------|--------|
| **Arts Chair** | Theme, color palette, typography, graphics, illustrations | 🔴 Critical | Waiting on committee vote |
| **Accessibilities Chair** | Guardrails document (see 6.3 template) | 🔴 Critical | Email pending |
| **Spanish Translator** | Full site translation | 🟡 High | Need to find someone |
| **Merch Chair + Treasury** | Payment/shipping service for dropship merch, self-service edit access decision | � High | Contacted — awaiting details |
| **Program Chair** | Convention schedule | 🟡 High | Not yet available |
| **Prayer Chair** | Prayer page content | 🟢 Low | Not yet started |
| **Nikki** | Bid guide content, various editorial | 🟡 High | Ongoing |
| **ASL Interpreters** | Video content for ASL pages | 🟡 High | Need to identify people |

---

## 8 · Technical Architecture Decisions

### Stack (Confirmed)
- **Framework:** Next.js 14 (App Router) — staying
- **Language:** TypeScript (strict mode now enabled)
- **Styling:** Tailwind CSS — theme will be rebuilt entirely
- **UI Components:** Will need new component library matching theme (keep Radix primitives for accessibility, restyle everything)
- **Payments:** Stripe embedded checkout — staying, needs security audit
- **CMS:** Sanity (exploring, not yet committed) — for blog, events, FAQ, program, state resources
- **Hosting:** Vercel — staying
- **Analytics:** @vercel/analytics — staying
- **i18n:** next-intl (recommended) — for Spanish parallel site

### Why Sanity CMS (If We Go This Route)
- Native Next.js integration (official Sanity + Next.js toolkit)
- Free tier handles our scale easily
- Real-time content preview
- Built-in i18n support (document-level translations)
- Visual editing in Sanity Studio
- Committee members can edit content without touching code
- Structured content = easy to render in multiple layouts/languages
- **Alternative considered:** MDX files in repo. Simpler but harder for non-technical committee members to edit. If we want zero external dependencies, this works too.
- **Status:** CMS is a maybe — significant setup work. Still evaluating ROI.

### Performance Targets
- **Lighthouse:** 95+ across all categories
- **Core Web Vitals:** All green
- **First Load JS:** <100kB shared
- **LCP:** <2.5s on 4G
- **Mobile usability:** 100/100

---

## 9 · Internationalization

### Strategy: Full Parallel Spanish Site

**Route structure:**
```
/en/register  →  English registration
/es/register  →  Spanish registration
```

The root `/` will detect browser language or show a language selector.

### Translation Workflow
1. All static UI strings live in message files (`en.json`, `es.json`)
2. All CMS content has a Spanish translation field
3. Translator works in Sanity Studio (or receives spreadsheet exports)
4. Two-person review process for Spanish content
5. English is the source of truth — Spanish mirrors it

### AA-Specific Spanish Terminology
- The translator should be familiar with AA's Spanish-language resources
- La Viña (AA Grapevine's Spanish journal) uses established terminology
- GSO has Spanish-language literature and a Spanish section on aa.org
- Do NOT machine-translate AA terminology — terms like "Big Book" have specific Spanish equivalents ("El Libro Grande") that must be correct

### Priority Order for Translation
1. Landing page
2. Registration (people need to pay)
3. Accessibility page (people need accommodations)
4. Program
5. FAQ
6. Everything else

---

## 10 · Accessibility & ASL

### Minimum Standards
- WCAG 2.1 AA compliance (baseline)
- AAA for critical paths (registration, payment)
- Waiting on Accessibilities Chair for expanded requirements

### ASL Strategy (Preliminary)
**Known needs:**
- ASL version of the convention flyer
- Potentially ASL content on key pages

**Implementation options:**
- Embedded video (YouTube/Vimeo, privacy-respecting player)
- ASL toggle that shows/hides video panels alongside text content
- Dedicated `/asl` page as a hub

**Open questions for Accessibilities Chair:**
- Which pages need ASL?
- Do we have interpreters who can record?
- Pre-recorded vs. live interpretation for virtual content?
- Budget for ASL video production?

### Automated Accessibility Testing
- axe-core integration in CI pipeline
- Playwright a11y assertions on every page
- Manual testing with screen readers (VoiceOver, NVDA)
- Keyboard-only navigation testing
- Reduced motion preference support (`prefers-reduced-motion`)
- High contrast mode support

---

## 11 · Security

### Current State
- Stripe embedded checkout (client-side session creation via server actions)
- Environment variables for keys
- Basic server-side validation

### Improvements Needed
- **Rate limiting** on all server actions (prevent abuse of checkout session creation)
- **Input sanitization** on all form fields (registration, breakfast, free reg)
- **CSRF tokens** on form submissions
- **Content Security Policy** headers (restrict script sources, frame ancestors)
- **Stripe webhook verification** for payment confirmation (if not already implemented)
- **Dependency audit** — run `pnpm audit` regularly
- **Environment variable validation** at app startup (partially done in `lib/stripe.ts`)
- **Remove /testreg route** or protect behind authentication before production

---

## 12 · AI Agent & Contributor Rules

### Governing Documents
Every AI agent and human contributor working on this project must be aware of and follow:

| Document | Location | Purpose |
|----------|----------|---------|
| `AA_TRADITIONS_GUARDRAILS.md` | Project root | Traditions compliance — **non-negotiable** |
| `.windsurf/workflows/changelog.md` | Workflows dir | Changelog tone rules |
| `NECYPREAMBLE.md` | Project root | This planning document |
| `CONTRIBUTING.md` | Project root (TODO) | How to contribute (human + AI) |
| Accessibilities Guardrails | TBD | Accessibility standards (pending) |

### How to Ensure AI Agents Know the Rules
1. **Windsurf/Cascade:** `.windsurf/workflows/` and project-root `.md` files are automatically discoverable
2. **Other agents:** Must be given `AA_TRADITIONS_GUARDRAILS.md` in their system context
3. **CI checks:** Automated tradition-violation scanning (superlative language, full names, etc.)
4. **Pre-commit hooks:** Flag potential anonymity violations before code is committed

### The Cardinal Rules (For Agents and Humans)
1. **No full names** of AA members on any public page. Ever.
2. **No faces** of AA members identified as such. Ever.
3. **Attraction, not promotion.** We inform. We do not market.
4. **No endorsement** of outside entities. Link to Al-Anon, but we are not Al-Anon.
5. **Human review** before any content goes to production.
6. **Link to aa.org, don't copy.** Brief excerpts only, with credit lines.
7. **When in doubt, ask a human.** AI agents halt and escalate.

---

## 13 · The Traditions (How They Affect Every Page)

Every page on this site must respect the Twelve Traditions. See `AA_TRADITIONS_GUARDRAILS.md` for the full document. Here's the practical impact:

| Tradition | Impact on Website |
|-----------|-------------------|
| **1 (Unity)** | Site serves the group, not individuals. No personal spotlights. |
| **2 (Group Conscience)** | Major content decisions go through committee, not unilateral. |
| **4 (Autonomy)** | We make our own design choices, but nothing that harms AA as a whole. |
| **5 (Primary Purpose)** | The site's job is to help people find the convention and recovery resources. Not to be flashy for flashy's sake. |
| **6 (No Endorsement)** | No implied partnerships with the hotel, vendors, treatment centers, or other organizations. Link ≠ endorse. Al-Anon page needs clear disclaimer. |
| **7 (Self-Supporting)** | No ads. No sponsored content. Vercel free tier or self-funded. |
| **10 (No Outside Issues)** | No political content, no controversial opinions presented as AA positions. |
| **11 (Attraction, Not Promotion)** | SEO for access, not marketing. No "best convention ever" in meta tags. No superlatives. Informational tone. |
| **12 (Anonymity)** | No full names on public pages. No identifiable photos of members as AA members. Principles before personalities. |

### Footer Requirements
Every page must include the AA trademark acknowledgment:

> Alcoholics Anonymous®, A.A.®, and The Big Book® are registered trademarks of Alcoholics Anonymous World Services, Inc.

---

## 14 · Design Philosophy

### The Vision
The website is not a container for information. It is a creative work that happens to contain information.

When the arts chair delivers the theme:
- **Colors, typography, and visual language come from the art.** We don't pick colors from a design system and apply them. We extract the palette from whatever the arts chair creates.
- **Interactions should feel intentional.** Hover states, transitions, page loads — everything should feel like it belongs in the same world as the art.
- **The mobile experience is the primary experience.** Most attendees will interact with this on their phones. Design mobile-first, enhance for desktop.
- **Accessibility is not an afterthought.** Beautiful and accessible are not in conflict. Every animation has a `prefers-reduced-motion` fallback. Every image has meaningful alt text. Every interaction works with a keyboard.

### What This Means for Code
- Tailwind theme config will be entirely custom (colors, fonts, spacing, shadows)
- Component library will be built from scratch (using Radix primitives for a11y)
- Animations via Framer Motion or CSS (depending on complexity)
- All visual components are theme-able — a single config change ripples everywhere
- The Spanish site uses the same theme (not a separate design)

---

## 15 · Member States & Resources

### NECYPAA Region (Expanded 2025)

**Original New England states:**
- Maine
- New Hampshire
- Vermont
- Massachusetts
- Connecticut
- Rhode Island

**Newly added (2025 expansion):**
- New York
- New Jersey
- Pennsylvania
- Maryland
- Delaware
- Washington, D.C.

### States Page Content
The states page (single page, no individual state sub-pages for now) should surface:
- Local AA intergroup/central office links per state
- Area service committee links
- YPAA committee links (if they exist)
- Any active young people's groups
- How to connect with NECYPAA from each state

### AA Meeting Finder (Embedded on States Page)
- Interactive map + list view of AA meetings across the NECYPAA region
- **Primary approach:** Integrate with AA Meeting Guide API (https://www.aa.org/meeting-guide-app) — this is the official AA meeting data source, powers the Meeting Guide app, and has a public API
- Map centered on NECYPAA region with state boundaries
- Filter by state, day, time, meeting type (open/closed, speaker/discussion, young people's, etc.)
- Click a state on the map → zooms into that state's meetings and resources
- State flag graphics as visual navigation elements (same flag assets used on Al-Anon page)
- Mobile: map/list toggle, touch-friendly filters
- **Fallback:** If API integration isn't feasible, link to aa.org/find-aa with state-specific query params + embed Meeting Guide deep links
- Per traditions: meeting data only (day, time, format, location). No member names. No attendance info.

### Data Structure
```typescript
interface StateResource {
  name: string              // "Connecticut"
  abbreviation: string      // "CT"
  region: "new-england" | "expansion"
  flagSvg: string           // path to state flag SVG asset
  intergroups: Array<{
    name: string
    url: string
    area: string
  }>
  ypaaCommittee?: {
    name: string
    url: string
  }
  alanon: {
    url: string             // state Al-Anon website
    alateenUrl?: string     // state Alateen website (if separate)
  }
  meetingFinderUrl: string  // AA meeting finder link for this state
  notes?: string            // any state-specific info
}
```

---

## 16 · Open Questions

These need answers before or during implementation:

| # | Question | Who Decides | Status |
|---|----------|-------------|--------|
| 1 | What is the theme? | Committee vote → Arts Chair | Waiting |
| 2 | What payment/shipping service for merch dropshipping? | Merch Chair + Treasury | Contacted — awaiting details |
| 3 | Who is translating to Spanish? | Nikki / Committee | Looking |
| 4 | What are the accessibility standards? | Accessibilities Chair | Email pending |
| 5 | What goes on the Prayer Chair page? | Prayer Chair | Not started |
| 6 | How much ASL content and on which pages? | Accessibilities Chair | Not started |
| 7 | Better name for "Getting Involved" page? | Nikki / Committee | Open |
| 8 | CMS choice — Sanity or keep it in code? | Nikki (technical decision) | Recommended Sanity |
| 9 | Do we need auth for any member-only content? | Committee | Not discussed |
| 10 | Will there be a virtual/hybrid component to the convention? | Committee | Unknown |
| 11 | Budget for ASL video production? | Committee / Treasurer | Unknown |

### Resolved Questions
| # | Question | Answer |
|---|----------|--------|
| ~~6~~ | Al-Anon page content and design | Content received from Al-Anon Chair. Design concept defined (themed borders bleeding into Al-Anon traditional core). See Section 5.6. |
| ~~13~~ | Bid guide content | Yes, Nikki has raw content. See Section 5.3. |

---

## Execution Priority (When Theme Drops)

When the arts chair delivers, this is the order:

1. **Tailwind theme + component library** — Colors, fonts, buttons, cards, forms
2. **Landing page** — First impression. Must be art.
3. **Registration redesign** — People pay through this. Must work perfectly.
4. **Mobile navigation** — How people move around
5. **Program page** — Core utility
6. **Events page** — Active engagement
7. **All other pages** — Parallel workstream
8. **Spanish site** — As soon as translator is ready
9. **ASL content** — As soon as interpreters are ready
10. **Final polish** — Animations, transitions, performance

---

*This document is alive. Update it as decisions are made, content arrives, and the theme is revealed. The preamble ends when the website begins.*
