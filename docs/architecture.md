# Architecture Overview

> High-level system design for the NECYPAA XXXVI website.

## System Diagram

```
┌─────────────────────────────────────────────────────────┐
│                        Vercel                            │
│  ┌───────────────────────────────────────────────────┐  │
│  │              Next.js 15 (App Router)               │  │
│  │                                                     │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌──────────┐  │  │
│  │  │   Pages      │  │ Server       │  │ Payload  │  │  │
│  │  │ (19 routes)  │  │ Actions      │  │ CMS      │  │  │
│  │  │              │  │              │  │ (Admin)  │  │  │
│  │  │ SSR + Client │  │ registration │  │ /admin   │  │  │
│  │  │ Components   │  │ breakfast    │  │          │  │  │
│  │  │              │  │ free-reg     │  │ REST API │  │  │
│  │  └──────┬───────┘  └──────┬───────┘  └────┬─────┘  │  │
│  │         │                 │               │         │  │
│  │         │     ┌───────────┼───────────────┘         │  │
│  │         │     │           │                          │  │
│  │  ┌──────▼─────▼───┐ ┌────▼─────────┐               │  │
│  │  │ Shared Lib     │ │ SQLite       │               │  │
│  │  │ validation.ts  │ │ (payload.db) │               │  │
│  │  │ rate-limit.ts  │ │              │               │  │
│  │  │ types.ts       │ │ Collections: │               │  │
│  │  │ constants.ts   │ │  Users       │               │  │
│  │  │ products.ts    │ │  BlogPosts   │               │  │
│  │  │ stripe.ts      │ │  Events      │               │  │
│  │  └────────────────┘ │  FAQ         │               │  │
│  │                      │  Media       │               │  │
│  │                      └──────────────┘               │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────┬───────────────────────┬───────────────────┘
              │                       │
     ┌────────▼────────┐    ┌────────▼────────┐
     │   Stripe API    │    │ Issuer Service  │
     │                 │    │ (Access Codes)  │
     │ Checkout        │    │                 │
     │ Customers       │    │ POST /redeem    │
     │ Payment Intents │    │                 │
     └─────────────────┘    └─────────────────┘
```

## Layers

### 1. Presentation Layer — `app/[locale]/(frontend)/`

All user-facing pages live under the `[locale]` dynamic segment, enabling next-intl locale routing (`/en/register`, `/es/register`). The `(frontend)` route group applies a shared layout with the header, footer, accessibility provider, and skip-to-content link.

**18 routes:** Homepage, Register, Breakfast, FAQ, Events, Blog, States, Al-Anon, ASL, Bid, Program, Merch, Prayer, Service, Journey, Accessibility, plus success confirmation pages.

Pages are server-rendered by default. Client components are used only where interactivity is required (forms, checkout, accessibility panel, games).

### 2. Server Actions — `actions/`

Two server action modules handle all mutating operations:

| Action                         | File              | Purpose                                               |
| ------------------------------ | ----------------- | ----------------------------------------------------- |
| `startRegistrationCheckout`    | `registration.ts` | Creates Stripe Checkout session for paid registration |
| `submitAccessCodeRegistration` | `registration.ts` | Redeems access code + creates Stripe customer record  |
| `startBreakfastCheckout`       | `breakfast.ts`    | Creates Stripe Checkout session for breakfast tickets |

All actions follow the same pattern:

1. Validate inputs via Zod schemas (`lib/validation.ts`)
2. Check rate limit (`lib/rate-limit.ts`)
3. Compute pricing/fees (`lib/registration-products.ts`)
4. Call external service (Stripe or Issuer)
5. Return client secret or success/error result

### 3. Content Management — Payload CMS

Payload CMS runs as an embedded Next.js plugin (not a separate server). The admin panel is at `/admin`, and the REST/GraphQL APIs are at `/api/*`.

**Collections:**

- `Users` — Admin authentication
- `BlogPosts` — Blog articles with rich text (Lexical editor), drafts, versioning, bilingual fields
- `Events` — Convention events with schedule, location, and flyer images
- `FAQ` — Frequently asked questions with categories and sort order
- `Media` — Uploaded images and files

**Storage:** SQLite file (`payload.db`) — lightweight, no external database dependency.

### 4. Shared Library — `lib/`

| Module                      | Responsibility                                                                        |
| --------------------------- | ------------------------------------------------------------------------------------- |
| `validation.ts`             | 13 Zod schemas — HTML sanitization, email validation, input bounds                    |
| `rate-limit.ts`             | Sliding-window rate limiter (Upstash Redis in production, in-memory fallback locally) |
| `registration-products.ts`  | Product catalog + processing fee gross-up calculation                                 |
| `stripe.ts`                 | Stripe client singleton (server-only)                                                 |
| `issuer-client.ts`          | Access code redemption client (external service)                                      |
| `types.ts`                  | Shared TypeScript interfaces                                                          |
| `constants.ts`              | URLs, event slug, convention dates                                                    |
| `accessibility-context.tsx` | React context for 6-mode accessibility settings                                       |
| `utils.ts`                  | `cn()` utility (clsx + tailwind-merge)                                                |
| `data/`                     | Static data files (events, meetings, states, blog posts)                              |

### 5. Static Data — `lib/data/`

Several features use static TypeScript data files rather than the CMS:

- **Meetings** (`ypaa-meetings.ts`, 48KB) — YPAA meetings across 13 states
- **States** (`states.ts`) — Member state info, intergroups, committees
- **Events** (`events.ts`) — Convention events (upcoming + past)
- **Blog Posts** (`blog-posts.ts`) — Safe fallback posts if CMS is empty
- **Events** (`events.ts`) — Safe fallback events if CMS is empty

This is a deliberate trade-off: meeting/state data changes infrequently and doesn't need CMS overhead. Blog posts and events are now primarily served from the CMS via `lib/data/fetch-utils.ts`, with static files as intentional fallbacks.

## Data Flows

### Registration (Paid)

```
User fills form → RegistrationForm (client)
  → Validates locally
  → Calls startRegistrationCheckout() server action
    → Zod validation
    → Rate limit check
    → Compute line items + processing fee
    → stripe.checkout.sessions.create()
    → Returns client_secret
  → EmbeddedCheckout renders Stripe form
  → User completes payment
  → Stripe redirects to /register/success?session_id=...
```

### Registration (Access Code)

```
User enters code + form → RegistrationForm (client)
  → Calls submitAccessCodeRegistration() server action
    → Zod validation
    → Rate limit check
    → Generate idempotency key (SHA-256 of email + code)
    → POST to Issuer Service /api/internal/redeem-registration-code
    → On success: create/update Stripe customer with metadata
    → Returns { success: true }
  → Client shows confirmation
```

## Security Architecture

| Layer            | Mechanism                                                                         |
| ---------------- | --------------------------------------------------------------------------------- |
| Input Validation | Zod schemas strip HTML, enforce max lengths, validate email format                |
| Rate Limiting    | Sliding window per email — 5/min for checkout, 3/min for free reg/code redemption |
| CSP Headers      | Strict Content-Security-Policy allowing only Stripe and Vercel domains            |
| Transport        | HSTS with 2-year max-age, includeSubDomains, preload                              |
| Frame Protection | X-Frame-Options: DENY + frame-ancestors: 'none'                                   |
| Type Safety      | TypeScript strict mode — no `any` types in codebase                               |
| Server-Only      | Stripe secret key isolated via `server-only` package                              |
| CMS Auth         | Payload admin requires authenticated user                                         |

## Internationalization

```
middleware.ts
  → next-intl createMiddleware(routing)
  → Detects locale from URL prefix (/en/, /es/)
  → Falls back to "en"

messages/en.json — English UI strings
messages/es.json — Spanish UI strings (human-translated)

i18n/routing.ts — Locale config (["en", "es"], default "en")
i18n/navigation.ts — Locale-aware Link, useRouter, usePathname
i18n/request.ts — Server-side message loading
```

All user-facing text should use `useTranslations()` from next-intl. Static data files (meetings, states) are English-only.

## Accessibility Architecture

The site targets WCAG 2.1 AAA compliance (AA as absolute floor).

**Runtime:** `A11yProvider` (React context) manages 6 settings — persisted in localStorage, applied as CSS classes/variables on `<html>`:

- Font size (1x–2x)
- High contrast
- Dyslexia-friendly font
- Reduce motion
- Grayscale
- Color mode (dark/light)

**Testing:** Playwright + axe-core tests run against all 10 content pages and 6 placeholder pages. Tests check WCAG 2.1 AA/AAA compliance, keyboard navigation, color contrast, alt text, form labels, and landmark structure.

**CSS:** Design tokens in `globals.css` use CSS custom properties (`--nec-*`) that respond to accessibility class toggles.

## Deployment

- **Platform:** Vercel (auto-deploy on push to `main`)
- **Build:** `next build` with Payload CMS plugin
- **Database:** SQLite file deployed with the build
- **Analytics:** Vercel Analytics + Web Vitals reporting
- **Pre-commit:** Husky + lint-staged (ESLint on .ts/.tsx files)
