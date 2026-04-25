# NECYPREAMBLE

> The planning document that exists before the website does. Like a preamble, but for code.

**Last updated:** 2026-03-18
**Owner:** Nikki, Website Chair
**Status:** Theme landed ("Escaping the Mad Realm"). Full visual identity implemented. Homepage rebuilt with YPAA narrative. Content phase — filling placeholder pages.

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

The arts chair is creating the visual identity — theme, graphics, color palette, typography direction. The website will grow _out of_ that art. Not slap a theme on a template. Not skin a Bootstrap site. The design, the interactions, the feeling of using this site should be an extension of whatever the arts chair creates. The website itself is a creative work.

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

- Next.js 15 app (App Router, TypeScript strict mode, Tailwind CSS, React 19)
- **19 routes scaffolded** — all target pages exist (real content or placeholder)
- Working Stripe registration flow (regular, scholarship, breakfast tickets, free/cash)
- Policy agreement enforcement before payment
- **Payload CMS 3.79.1** proof of concept (SQLite, admin at `/admin`)
- Deployed on Vercel
- **87.3 kB shared JS** — under 100kB performance target
- **"Escaping the Mad Realm" theme fully implemented** — custom design tokens, Mad Realm palette (purple, pink, gold, cyan, navy), component library, ambient glow system

### Governing Documents (All Created)

| Document                           | Status                                                              |
| ---------------------------------- | ------------------------------------------------------------------- |
| `AA_TRADITIONS_GUARDRAILS.md`      | ✅ Comprehensive traditions compliance                              |
| `ACCESSIBILITY_GUIDELINES.md`      | ✅ Full guidelines from Accessibilities Chair (received 2026-03-13) |
| `CONTRIBUTING.md`                  | ✅ Human + AI contributor rules, escalation protocol                |
| `.windsurf/rules.md`               | ✅ AI agent quick-reference                                         |
| `.windsurf/workflows/changelog.md` | ✅ Changelog tone rules                                             |
| `NECYPREAMBLE.md`                  | ✅ This document                                                    |

### Infrastructure Built (2026-03-03 through 2026-03-18)

- Route scaffolding — all pages from Section 3 exist
- `PageShell` component for consistent placeholder pages
- Security hardening — rate limiting (`lib/rate-limit.ts`), Zod input validation (`lib/validation.ts`), CSP headers (`next.config.mjs`)
- ESLint + Prettier configured
- Vitest unit tests — 30/30 passing (`pnpm test`)
- i18n infrastructure — `next-intl` installed, `en.json`/`es.json` message files, language switcher component
- Accessibility settings panel — 6 user customization modes (dark/light, high-contrast, font size, dyslexia font, reduce motion, grayscale)
- Skip-to-content link, ARIA landmarks, focus-visible outlines (global `focus-visible` in `globals.css`)
- All modals have Escape key handlers and `role="dialog"` attributes
- Member states data (`lib/data/states.ts`) — all 12 states + DC with intergroup, YPAA, Al-Anon, Alateen, and meeting finder links
- FAQ data (`lib/data/faq.ts`) — cleared, awaiting new content from Nikki
- Accessibility statement in footer with report-a-problem link
- Anonymous feedback form (`components/anonymous-feedback-form.tsx`) on `/accessibility` page
- Content warning component (`components/content-warning.tsx`) — reusable click-to-expand for sensitive content
- AA trademark acknowledgment in footer
- All user-facing error messages audited for warm/inviting tone (per accessibility guidelines Section 2)

### Pages With Real Content

| Page                | Status                                                                                                                               |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `/` (Landing)       | ✅ Real — Mad Realm themed hero, "What is a YPAA?" narrative section, upcoming event, meetings, past events, registration CTA        |
| `/register`         | ✅ Real — multi-step form, Stripe checkout                                                                                           |
| `/breakfast`        | ✅ Real — breakfast ticket checkout                                                                                                  |
| `/cash`             | ✅ Real — free registration flow                                                                                                     |
| `/register/success` | ✅ Real — confirmation page                                                                                                          |
| `/events`           | ✅ Real — upcoming event featured + past events archive with flyer modals                                                            |
| `/faq`              | ⏳ Shell intact, content cleared — awaiting rewrite from Nikki                                                                       |
| `/journey`          | ✅ Real — past event archive from events.ts                                                                                          |
| `/alanon`           | ✅ Real — rebuilt with chair's content: info accordions, self-quiz banner, program teaser, Alateen paperwork, Mad Realm border bleed |
| `/accessibility`    | ✅ Real — digital/in-person features, accommodation request, report a problem                                                        |
| `/states`           | ✅ Real — all 12 states + DC with resource links                                                                                     |
| `/service`          | ✅ Real — service opportunities, Members-at-Large, how to get involved, Zoom CTA                                                     |

### Pages Still Placeholder (Coming Soon)

| Page                     | Blocker                                          |
| ------------------------ | ------------------------------------------------ |
| `/program`               | Needs final schedule from Program Chair          |
| `/blog` + `/blog/[slug]` | Payload CMS schema ready — needs first blog post |
| `/bid`                   | ⏳ Blocked on Nikki's raw content                |
| `/faq`                   | ⏳ Blocked on Nikki's new FAQ content            |
| `/prayer`                | Needs content from Prayer Chair                  |
| `/merch`                 | Needs payment/shipping decision from Merch Chair |
| `/asl`                   | Needs ASL interpreters/video content             |

### What Still Needs to Change

**Content.** The visual identity is done — "Escaping the Mad Realm" theme is fully implemented. Locale routing (`/en/...`, `/es/...`) is live. Automated a11y testing (axe-core + Playwright) is set up. Payload CMS has schemas for events, blog posts, and FAQ. What remains is filling placeholder pages with real content, security hardening (CSRF, Stripe webhooks), and finding a Spanish translator.

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
/service                    — Service opportunities, Members-at-Large, committees
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

### 4.1 Break Into Multi-Page App ✅ DONE

- ~~Set up the route structure from Section 3~~ — All 19 routes exist
- ~~Create placeholder pages with consistent layout scaffolding~~ — `PageShell` component
- ~~Set up shared layout components (nav, footer, mobile menu) that can be re-skinned later~~
- ~~Move existing registration, breakfast, and cash flows to their routes~~

### 4.2 Content Management System (Maybe)

**Exploring: Sanity CMS** (headless, pairs natively with Next.js, generous free tier, real-time preview, supports i18n)

**Status:** Not yet committed. A CMS is powerful but adds significant setup work. Still evaluating whether the benefits (non-technical editing, structured content) justify the investment at this stage. Building in a way that keeps the door open either way.

If we go this route, schemas would cover:

- **Blog posts** — title, slug, body (rich text), author (first name only per traditions), date, featured image, Spanish translation field
- **Events** — name, date, location, description, flyer image, Spanish translation
- **FAQ entries** — question, answer, category, Spanish translation
- **Program schedule** — day, time blocks, session titles, descriptions, Spanish translation
- **State resources** — state name, intergroup links, YPAA groups, meeting finder links

This _could_ be built and populated before we have a theme. Content is content.

### 4.3 Internationalization (i18n) Setup — MOSTLY DONE

- ~~Install and configure `next-intl`~~ ✅
- ~~Set up message files structure for static UI strings~~ ✅ (`messages/en.json`, `messages/es.json`)
- ~~Build language switcher component (unstyled, ready to theme)~~ ✅ (`components/language-switcher.tsx`)
- ~~Locale routing (`/en/...`, `/es/...`)~~ ✅ Active (2026-03-18) — `middleware.ts` handles detection/redirect, `app/[locale]/(frontend)/` directory structure, `i18n/routing.ts` + `i18n/navigation.ts` for locale-aware links
- ❌ Translator-friendly content workflow — blocked on finding a human translator

### 4.4 Security Hardening — PARTIAL

- ~~Add rate limiting to server actions~~ ✅ (`lib/rate-limit.ts`)
- ~~Add input validation/sanitization on all form fields~~ ✅ (`lib/validation.ts` — Zod schemas)
- ~~Set up Content Security Policy headers~~ ✅ (`next.config.mjs`)
- ❌ CSRF protection — not yet implemented
- ❌ Stripe webhook verification — not yet implemented
- ❌ Full env variable validation at startup — partial (only `lib/stripe.ts`)
- ❌ Stripe integration audit — not yet done

### 4.5 Accessibility Infrastructure ✅ DONE (expanded beyond original scope)

- ~~Add skip-to-content links, ARIA landmarks, focus management~~ ✅
- ~~Prepare template/prompt for Accessibilities Chair~~ ✅ — Guidelines received and implemented as `ACCESSIBILITY_GUIDELINES.md`
- ✅ Accessibility settings panel — 6 user customization modes (dark/light, high-contrast, font size, dyslexia font, reduce motion, grayscale)
- ✅ Real `/accessibility` page with digital/in-person features, accommodation request, report a problem
- ✅ Anonymous feedback form on `/accessibility` page (`components/anonymous-feedback-form.tsx`)
- ✅ Content warning component (`components/content-warning.tsx`) — reusable click-to-expand for sensitive content
- ✅ Accessibility statement in footer + report-a-problem link
- ✅ AA trademark acknowledgment in footer
- ✅ All modals have Escape key handlers and `role="dialog"` attributes
- ✅ Person-first language and banned language audit — clean
- ✅ All error messages audited for warm/inviting tone (no cold/technical messages)
- ✅ No auto-play media anywhere — all media opt-in
- ✅ Global `focus-visible` outline on all interactive elements
- ✅ WCAG target upgraded to AAA (AA as absolute floor) — per Website Chair directive
- ~~Automated a11y testing (axe-core + Playwright)~~ ✅ Set up (2026-03-18) — `playwright.config.ts` + `e2e/accessibility.spec.ts`. WCAG 2.1 AA enforced, AAA best-effort. `pnpm test:a11y`
- ❌ a11y CI check in build pipeline — not yet set up

### 4.6 AI Agent Rules System — MOSTLY DONE

- ~~Ensure `AA_TRADITIONS_GUARDRAILS.md` is referenced in all agent contexts~~ ✅
- ~~Create `.windsurf/rules.md`~~ ✅ — references all 5 governing docs
- ~~Build a `CONTRIBUTING.md` that covers human + AI contributor rules~~ ✅
- ❌ Pre-commit or CI checks for tradition violations — not yet set up

### 4.7 Code Quality & Architecture — PARTIAL

- ~~Set up ESLint + Prettier with consistent config~~ ✅
- ~~Add unit tests for processing fee calculation and other business logic~~ ✅ (30 tests passing — validation, rate-limit, registration products)
- ~~Add Playwright for e2e tests~~ ✅ Set up (2026-03-18) — `playwright.config.ts`, `e2e/accessibility.spec.ts`. `pnpm test:a11y`
- ❌ Set up staging environment on Vercel — not yet (preview deployments work natively)
- ~~`/testreg` test route~~ ✅ **Removed (2026-03-18)** — `app/(frontend)/actions/testreg.ts` + `components/testreg-checkout.tsx` deleted

### 4.8 Member States Data — MOSTLY DONE

- ~~Build the data structure for all member states~~ ✅ (`lib/data/states.ts` — all 12 states + DC)
- ~~Research and compile intergroup links, YPAA contacts, meeting finder URLs~~ ✅
- ~~Compile per-state Al-Anon website URLs~~ ✅
- ~~Compile per-state Alateen website URLs~~ ✅
- ❌ Collect state flag SVGs (public domain) — not yet collected
- ❌ Research AA Meeting Guide API — not yet done
- ❌ Research Al-Anon meeting finder embed/API options — not yet done

### 4.9 "The Journey Comes First" Archive ✅ DONE

- ~~Move existing past event data into a structured format~~ ✅ (`lib/data/events.ts`)
- ~~Build data model for archived events (no faces, no full names per traditions)~~ ✅
- `/journey` page renders real content from events data
- Additional flyers/event data can be added to `events.ts` as collected

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

### 5.2 FAQ Page ⏳ INFRASTRUCTURE DONE, CONTENT RESET

- ~~Accordion/search UI pattern~~ ✅ — Radix UI Accordion with category tabs (`components/faq-accordion.tsx`)
- ~~Category grouping~~ ✅ — typed interfaces `FAQItem` + `FAQCategory` in `lib/data/faq.ts`
- **Content cleared (2026-03-18)** — draft Q&As removed, `faqData` set to `[]`. Awaiting new content from Nikki.
- Page shell and accordion infrastructure intact — just needs data.
- CMS schema for easy editing — still open (depends on CMS decision)
- Spanish translation — blocked on translator

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

### 5.6 Al-Anon Page ✅ DONE (Content Received, Page Built)

**Status:** Page built with content from Al-Anon chair. Tradition 6 disclaimer, state grids (Al-Anon + Alateen), meeting finder link.
**Content:** Text-based — Al-Anon statement and resources. State flag grid links to each state's Al-Anon and Alateen sites.
**Tone:** More professional than the rest of the site. This page speaks with Al-Anon's voice, not ours.

**Design vision:**

- Page borders/frame use our NECYPAA theme — colors, motifs, whatever the arts chair creates
- Those themed borders _bleed inward_ toward the center, but the core content area transitions into Al-Anon's own traditional visual identity
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

   _Both grids:_ Per Tradition 6, these are outbound resource links, clearly framed as such ("you are leaving our site" pattern per guardrails Section 3.5)

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

### 6.1 🎨 Theme & Art ✅ RESOLVED — "Escaping the Mad Realm"

**Status:** Theme delivered and fully implemented (2026-03-10 through 2026-03-18).

**What was delivered:** "Escaping the Mad Realm" — steampunk-wonderland aesthetic with calligraphic logo art.

**What was implemented:**

- ✅ Full Tailwind/CSS custom property theme (`globals.css`) — purple, pink, gold, cyan, navy palette
- ✅ Component library — `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.nec-card`, `.section-badge`, `.section-heading`, `.fact-pill`, glow utilities
- ✅ Ambient glow system — page-level radial gradient blobs (purple, pink, gold)
- ✅ Hero section with calligraphic theme logo, gradient text, vortex glow
- ✅ Homepage rebuilt with "What is a YPAA?" narrative section + timeline
- ✅ Mobile-first responsive design verified
- ✅ All placeholder pages use `PageShell` with Mad Realm styling
- ✅ Spanish site will share the same theme (when translator is found)

### 6.2 🇪🇸 Spanish Translation (Blocked on: Finding a Translator)

**Status:** Looking for a translator.
**What's needed:** A fluent Spanish speaker (ideally in recovery, familiar with AA terminology in Spanish) to translate all site content.
**Not acceptable:** Google Translate, DeepL, or any machine translation. This must be human.
**Why:** AA has specific Spanish terminology (La Viña, GSO Spanish resources). Machine translation gets this wrong and can be harmful.

**When translator is found:**

- Give them access to Sanity CMS (or a spreadsheet export)
- Establish review process (ideally two Spanish-speaking members review)
- Prioritize: Landing page → Registration → Program → FAQ → Everything else

### 6.3 ♿ Accessibilities Chair Guardrails ✅ RESOLVED

**Status:** Guidelines received (2026-03-13) and implemented as `ACCESSIBILITY_GUIDELINES.md`.
**What was delivered:** Comprehensive 10-section document covering visual/sensory a11y, language/tone, imagery, forms/identity, AI rules, events, emails, privacy, recovery-specific inclusion, and governance.
**What was implemented:**

- 6 user customization modes (dark/light, high-contrast, font size, dyslexia font, reduce motion, grayscale)
- Real `/accessibility` page with digital and in-person features
- Anonymous feedback form on `/accessibility` page (no name/email required)
- Content warning component for sensitive content (click-to-expand)
- Accessibility statement in site footer with report-a-problem link
- AA trademark acknowledgment in site footer
- All modals have Escape key handlers and ARIA dialog attributes
- Person-first language and banned language audit — clean
- All error messages audited for warm/inviting tone
- WCAG target upgraded to AAA (AA as absolute floor) — per Website Chair directive
- All 5 follow-up items resolved with highest-standard defaults
- Guidelines added as governing doc in `CONTRIBUTING.md` and `.windsurf/rules.md`

### 6.4 📦 Merch Implementation (Blocked on: Payment/Shipping Details)

**Status:** Merch page confirmed. Dropshipping model.
**Blocked on:** Merch chair / treasury need to tell us:

1. What payment service to embed (Stripe, Shopify Buy Button, Printful checkout, etc.)
2. What shipping/fulfillment service they're using (Printful, Printify, Gooten, etc.)
3. Whether merch chair wants self-service page editing access (add/remove products without a developer) — if yes, we set them up in Sanity CMS with a simple merch editor

**Note on non-technical edit access:** If merch chair needs to update products themselves, Sanity CMS gives them a visual editor — no code required. They log in, add a product with images/price/description, hit publish. We control the layout and design, they control the catalog. This is the recommended approach.

### 6.5 📝 Content From Various Chairs

| Content                  | Source                               | Status                               |
| ------------------------ | ------------------------------------ | ------------------------------------ |
| Convention program       | Program Chair                        | Not yet available                    |
| Prayer page content      | Prayer Chair                         | Not yet available                    |
| Al-Anon resources        | Al-Anon Chair                        | ✅ Page built with received content  |
| Accessibility guidelines | Accessibilities Chair                | ✅ Received and implemented          |
| Bid guide content        | Nikki                                | Has raw content, needs to websiteify |
| Blog posts               | Various                              | No posts yet                         |
| ASL videos               | Accessibilities Chair + interpreters | Not yet planned                      |

---

## 7 · Content Dependencies

### People We Need Things From

| Person/Role                | What We Need                                                                   | Priority        | Status                       |
| -------------------------- | ------------------------------------------------------------------------------ | --------------- | ---------------------------- |
| **Arts Chair**             | Theme, color palette, typography, graphics, illustrations                      | 🔴 Critical     | Waiting on committee vote    |
| **Accessibilities Chair**  | ~~Guardrails document~~                                                        | ~~🔴 Critical~~ | ✅ Received and implemented  |
| **Spanish Translator**     | Full site translation                                                          | 🟡 High         | Need to find someone         |
| **Merch Chair + Treasury** | Payment/shipping service for dropship merch, self-service edit access decision | 🟡 High         | Contacted — awaiting details |
| **Program Chair**          | Convention schedule                                                            | 🟡 High         | Not yet available            |
| **Prayer Chair**           | Prayer page content                                                            | 🟢 Low          | Not yet started              |
| **Nikki**                  | Bid guide content, various editorial                                           | 🟡 High         | Ongoing                      |
| **ASL Interpreters**       | Video content for ASL pages                                                    | 🟡 High         | Need to identify people      |

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

### Standards (Highest Path — Per Website Chair Directive)

- **WCAG 2.1 AAA compliance** wherever achievable (AA as absolute floor — never below)
- AAA required for critical paths (registration, payment, accessibility page)
- Guidelines received from Accessibilities Chair — see `ACCESSIBILITY_GUIDELINES.md`
- When any accessibility decision is unclear or unset: **choose the highest standard**

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

### Current State (as of 2026-03-16)

- Stripe embedded checkout (client-side session creation via server actions)
- Environment variables for keys
- ~~Basic server-side validation~~ → Full Zod schema validation on all server action inputs (`lib/validation.ts`)
- ~~No rate limiting~~ → Rate limiting on all checkout/registration server actions (`lib/rate-limit.ts`)
- ~~No CSP~~ → Content Security Policy headers configured (`next.config.mjs`)
- All user-facing error messages use warm/inviting tone (no technical jargon)

### Done ✅

- **Rate limiting** on all server actions ✅ (`lib/rate-limit.ts`)
- **Input validation/sanitization** on all form fields ✅ (`lib/validation.ts` — Zod schemas)
- **Content Security Policy** headers ✅ (`next.config.mjs`)

### Still Needed

- **CSRF tokens** on form submissions — not yet implemented
- **Stripe webhook verification** for payment confirmation — not yet implemented
- **Dependency audit** — run `pnpm audit` regularly (not automated)
- **Environment variable validation** at app startup — partial (only `lib/stripe.ts`)
- ~~**Remove /testreg route**~~ ✅ Removed (2026-03-18)

---

## 12 · AI Agent & Contributor Rules

### Governing Documents

Every AI agent and human contributor working on this project must be aware of and follow:

| Document                           | Location               | Purpose                                              |
| ---------------------------------- | ---------------------- | ---------------------------------------------------- |
| `AA_TRADITIONS_GUARDRAILS.md`      | Project root           | Traditions compliance — **non-negotiable**           |
| `ACCESSIBILITY_GUIDELINES.md`      | Project root           | Inclusion & accessibility — **non-negotiable**       |
| `CONTRIBUTING.md`                  | Project root           | How to contribute (human + AI)                       |
| `NECYPREAMBLE.md`                  | Project root           | This planning document                               |
| `.windsurf/rules.md`               | `.windsurf/`           | AI agent quick-reference (references all docs above) |
| `.windsurf/workflows/changelog.md` | `.windsurf/workflows/` | Changelog tone rules                                 |

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

| Tradition                          | Impact on Website                                                                                                                                |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **1 (Unity)**                      | Site serves the group, not individuals. No personal spotlights.                                                                                  |
| **2 (Group Conscience)**           | Major content decisions go through committee, not unilateral.                                                                                    |
| **4 (Autonomy)**                   | We make our own design choices, but nothing that harms AA as a whole.                                                                            |
| **5 (Primary Purpose)**            | The site's job is to help people find the convention and recovery resources. Not to be flashy for flashy's sake.                                 |
| **6 (No Endorsement)**             | No implied partnerships with the hotel, vendors, treatment centers, or other organizations. Link ≠ endorse. Al-Anon page needs clear disclaimer. |
| **7 (Self-Supporting)**            | No ads. No sponsored content. Vercel free tier or self-funded.                                                                                   |
| **10 (No Outside Issues)**         | No political content, no controversial opinions presented as AA positions.                                                                       |
| **11 (Attraction, Not Promotion)** | SEO for access, not marketing. No "best convention ever" in meta tags. No superlatives. Informational tone.                                      |
| **12 (Anonymity)**                 | No full names on public pages. No identifiable photos of members as AA members. Principles before personalities.                                 |

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
  name: string // "Connecticut"
  abbreviation: string // "CT"
  region: "new-england" | "expansion"
  flagSvg: string // path to state flag SVG asset
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
    url: string // state Al-Anon website
    alateenUrl?: string // state Alateen website (if separate)
  }
  meetingFinderUrl: string // AA meeting finder link for this state
  notes?: string // any state-specific info
}
```

---

## 16 · Open Questions

These need answers before or during implementation:

| #     | Question                                                       | Who Decides                     | Status                                 |
| ----- | -------------------------------------------------------------- | ------------------------------- | -------------------------------------- |
| ~~1~~ | ~~What is the theme?~~                                         | ~~Committee vote → Arts Chair~~ | ✅ Resolved — see below                |
| 2     | What payment/shipping service for merch dropshipping?          | Merch Chair + Treasury          | Contacted — awaiting details           |
| 3     | Who is translating to Spanish?                                 | Nikki / Committee               | Looking                                |
| 5     | What goes on the Prayer Chair page?                            | Prayer Chair                    | Not started                            |
| 6     | How much ASL content and on which pages?                       | Accessibilities Chair           | Not started                            |
| 7     | Better name for "Getting Involved" page?                       | Nikki / Committee               | Open                                   |
| 8     | CMS choice — Payload (PoC exists), Sanity, or keep it in code? | Nikki (technical decision)      | Payload PoC built (SQLite), evaluating |
| 10    | Will there be a virtual/hybrid component to the convention?    | Committee                       | Unknown                                |
| 11    | Budget for ASL video production?                               | Committee / Treasurer           | Unknown                                |

### Resolved Questions

| #      | Question                                     | Answer                                                                                                              |
| ------ | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| ~~1~~  | What is the theme?                           | ✅ "Escaping the Mad Realm" — delivered by Arts Chair, fully implemented. See Section 6.1.                          |
| ~~4~~  | What are the accessibility standards?        | ✅ Received from Accessibilities Chair (2026-03-13). Implemented as `ACCESSIBILITY_GUIDELINES.md`. See Section 6.3. |
| ~~6~~  | Al-Anon page content and design              | ✅ Content received. Page rebuilt (2026-03-18) with info accordions, quiz banner, program teaser. See Section 5.6.  |
| ~~9~~  | Do we need auth for any member-only content? | **No.** This is a convention website — no user accounts, no logins, no profiles.                                    |
| ~~13~~ | Bid guide content                            | Yes, Nikki has raw content. See Section 5.3.                                                                        |

---

## Execution Priority (Current — Theme Landed)

Theme is implemented. Infrastructure is solid. Content phase. Priority order:

1. ~~**Tailwind theme + component library**~~ ✅ Done
2. ~~**Landing page**~~ ✅ Done — YPAA narrative, hero, upcoming events
3. ~~**Locale routing**~~ ✅ Done — `/en/...` and `/es/...` live, middleware, `NextIntlClientProvider`
4. ~~**Events page**~~ ✅ Done — upcoming event + past events archive
5. ~~**Automated a11y testing**~~ ✅ Done — axe-core + Playwright, `pnpm test:a11y`
6. ~~**Remove `/testreg`**~~ ✅ Done
7. ~~**Payload CMS collections**~~ ✅ Done — Events, BlogPosts, FAQ schemas
8. **Security hardening** — CSRF protection, Stripe webhook verification
9. **FAQ content** — ⏳ Blocked on Nikki's rewrite
10. **Bid page** — ⏳ Blocked on Nikki's raw content
11. **Get Involved page** — Needs content + name decision
12. **Program page** — When schedule arrives from Program Chair
13. **Blog first post** — Payload schema ready, needs content
14. **Spanish site** — As soon as translator is ready
15. **ASL content** — As soon as interpreters are ready
16. **Final polish** — Performance audit, pre-launch a11y review with Accessibilities Chair

---

_This document is alive. Update it as decisions are made, content arrives, and the theme is revealed. The preamble ends when the website begins._
