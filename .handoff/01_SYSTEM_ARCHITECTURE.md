# System Architecture — NECYPAA XXXVI Website

> **Last Updated:** 2026-04-07
> **Maintainer:** Solo engineer (Bus Factor 1 — this document IS the contingency)
> **Live Site:** https://www.necypaact.com
> **Repository:** https://github.com/ntoledo319/NECYPASITE

---

## What Is This Project?

The official website for **NECYPAA XXXVI** (36th Northeast Convention of Young People in Alcoholics Anonymous), themed "Escaping the Mad Realm." The convention runs **December 31, 2026 – January 3, 2027** at the **Hartford Marriott Downtown, Hartford, CT**.

The site handles event information, online registration with Stripe payments, an interactive meeting directory, bilingual content (EN/ES), a CMS for blog/FAQ management, and comprehensive WCAG 2.1 AAA accessibility.

---

## Tech Stack

| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| **Framework** | Next.js (App Router) | 15.4.11 | Server-first rendering, React Server Components |
| **Language** | TypeScript | 5.7.3 | Strict mode, zero `any` types |
| **React** | React + ReactDOM | 19.2.4 | React 19 with Server Components |
| **Styling** | Tailwind CSS | 3.4.17 | Custom design tokens in `globals.css` |
| **UI Library** | Radix UI + shadcn/ui | Various | 30+ Radix primitives, 6 shadcn components |
| **CMS** | Payload CMS | 3.79.1 | Embedded in Next.js, admin at `/admin` |
| **Database** | SQLite | Embedded | File: `payload.db` — no external DB needed |
| **Payments** | Stripe | 20.0.0 | Embedded Checkout (not redirect) |
| **i18n** | next-intl | 4.8.3 | Middleware-based locale routing |
| **Validation** | Zod | 3.24.1 | 13 schemas, HTML sanitization built-in |
| **Testing** | Vitest + Playwright | 4.1.0 / 1.58.2 | 45 unit tests + WCAG e2e tests |
| **Linting** | ESLint 9 + Prettier | 9 / 3.8.1 | jsx-a11y strict mode |
| **Package Manager** | pnpm | 9+ | Lockfile: `pnpm-lock.yaml` |
| **Hosting** | Vercel | — | Auto-deploy on push to `main` |
| **Analytics** | Vercel Analytics + Web Vitals | — | Core Web Vitals tracking |

---

## High-Level Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                         VERCEL                                │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                 Next.js 15 (App Router)                   │  │
│  │                                                            │  │
│  │  ┌────────────────┐  ┌───────────────┐  ┌─────────────┐  │  │
│  │  │  19 Pages       │  │ Server        │  │ Payload CMS │  │  │
│  │  │  (SSR + Client) │  │ Actions (3)   │  │ Admin Panel │  │  │
│  │  │                 │  │               │  │ /admin      │  │  │
│  │  │ /register       │  │ registration  │  │             │  │  │
│  │  │ /breakfast      │  │ breakfast     │  │ REST API    │  │  │
│  │  │ /states         │  │ free-reg      │  │ GraphQL     │  │  │
│  │  │ /events ...     │  │               │  │             │  │  │
│  │  └───────┬─────────┘  └──────┬────────┘  └──────┬──────┘  │  │
│  │          │                   │                   │          │  │
│  │  ┌───────▼───────────────────▼───────────────────▼──────┐  │  │
│  │  │              Shared Library (lib/)                     │  │  │
│  │  │  validation.ts  rate-limit.ts  stripe.ts  types.ts    │  │  │
│  │  │  constants.ts   products.ts   issuer-client.ts        │  │  │
│  │  │  accessibility-context.tsx    data/*.ts                │  │  │
│  │  └──────────────────────┬────────────────────────────────┘  │  │
│  │                         │                                    │  │
│  │                  ┌──────▼──────┐                             │  │
│  │                  │   SQLite    │                             │  │
│  │                  │ payload.db  │                             │  │
│  │                  └─────────────┘                             │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────┬──────────────────────────────┬────────────────────┘
             │                              │
    ┌────────▼─────────┐          ┌────────▼─────────┐
    │   Stripe API     │          │ Issuer Service   │
    │                  │          │ (Access Codes)   │
    │ - Checkout       │          │                  │
    │ - Customers      │          │ POST /redeem     │
    │ - PaymentIntents │          │ (external)       │
    └──────────────────┘          └──────────────────┘
```

---

## Database Schema (Payload CMS Collections)

| Collection | Purpose | Key Fields |
|-----------|---------|-----------|
| **Users** | CMS admin auth | email, password, name, role (admin/editor) |
| **Events** | Convention events | title, date, location, description, schedule[], details[], flyer (Media) |
| **BlogPosts** | Blog articles | title, slug (unique), category, excerpt, body (richText/Lexical), featuredImage, publishedAt, status (draft/published), Spanish translations |
| **FAQ** | Frequently asked questions | question, answer (richText), category, sortOrder, Spanish translations |
| **Media** | Uploaded files | filename, alt (required), url, mimeType, width, height |

**Storage:** Single SQLite file at `payload.db` in project root. No external database server needed.

---

## Third-Party Integrations

### Stripe (Payments)
- **Purpose:** Convention registration ($40), breakfast tickets ($20 each), scholarship purchases
- **Mode:** Embedded Checkout (UI rendered inside the page, not a redirect)
- **Server module:** `lib/stripe.ts` — singleton client with `server-only` guard
- **Products:** Defined in `lib/registration-products.ts` (not Stripe Dashboard)
- **Fee calculation:** Gross-up formula in `calculateProcessingFee()` so the fee line item covers Stripe's 2.9% + $0.30 on itself
- **Metadata:** Full registration data stored on Stripe session + payment intent
- **CRITICAL GAP:** No webhook handler exists. See `docs/tech-debt-and-gaps.md` P0 #1.

### Issuer Service (Access Codes)
- **Purpose:** Redeem pre-issued registration codes (cash/scholarship flow)
- **Client:** `lib/issuer-client.ts`
- **Endpoint:** `POST {ISSUER_SERVICE_BASE_URL}/api/internal/redeem-registration-code`
- **Auth:** Bearer token via `ISSUER_SERVICE_API_KEY`
- **Timeout:** 10 seconds with `AbortSignal.timeout()`
- **Error codes:** `INVALID_CODE`, `EXPIRED_CODE`, `ALREADY_REDEEMED`, `SERVICE_ERROR`

### Vercel (Hosting + Analytics)
- **Deployment:** Auto-deploy on push to `main`
- **Analytics:** `@vercel/analytics` + `web-vitals` reporting
- **Edge:** Middleware runs at edge for i18n routing

---

## Environment Variables

### Required (site will not function without these)

| Variable | Where Used | Example |
|----------|-----------|---------|
| `PAYLOAD_SECRET` | `payload.config.ts` | Any random string (32+ chars for prod) |
| `STRIPE_SECRET_KEY` | `lib/stripe.ts` | `sk_test_...` or `sk_live_...` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Client-side checkout components | `pk_test_...` or `pk_live_...` |
| `NEXT_PUBLIC_BASE_URL` | Stripe success/return URLs | `https://www.necypaact.com` |

### Optional (features degrade gracefully)

| Variable | Where Used | Example |
|----------|-----------|---------|
| `ISSUER_SERVICE_BASE_URL` | `lib/issuer-client.ts` | `https://issuer.example.com` |
| `ISSUER_SERVICE_API_KEY` | `lib/issuer-client.ts` | Bearer token string |
| `DATABASE_URI` | `payload.config.ts` | `file:./payload.db` (default) |

---

## Security Architecture

| Layer | Implementation |
|-------|---------------|
| **Input validation** | Zod schemas strip HTML tags, enforce max lengths, validate email format |
| **Rate limiting** | Sliding window per email — 5/min checkout, 3/min free reg & code redemption |
| **CSP** | Strict Content-Security-Policy allowing only Stripe + Vercel domains |
| **HSTS** | `max-age=63072000; includeSubDomains; preload` |
| **Frame protection** | `X-Frame-Options: DENY` + `frame-ancestors: 'none'` |
| **Type safety** | TypeScript strict mode, zero `any` types in codebase |
| **Server isolation** | Stripe key guarded by `server-only` package — cannot be imported client-side |
| **CMS auth** | Payload admin requires authenticated user |
| **Permissions** | `camera=(), microphone=(), geolocation=()` |

---

## Key File Reference

| File | What It Does | Criticality |
|------|-------------|-------------|
| `payload.config.ts` | CMS + database configuration | Critical |
| `next.config.mjs` | Security headers, image formats, plugins | Critical |
| `middleware.ts` | i18n locale routing | Critical |
| `lib/stripe.ts` | Stripe client singleton | Critical |
| `lib/validation.ts` | All 13 Zod input validation schemas | Critical |
| `lib/rate-limit.ts` | Rate limiting for all server actions | Critical |
| `lib/registration-products.ts` | Product catalog + fee calculation | Critical |
| `actions/registration.ts` | Main registration + access code checkout | Critical |
| `actions/breakfast.ts` | Breakfast ticket checkout | Critical |
| `actions/free-registration.ts` | Free/cash registration | Critical |
| `lib/issuer-client.ts` | Access code redemption client | High |
| `lib/accessibility-context.tsx` | 6-mode a11y settings provider | High |
| `lib/constants.ts` | URLs, event slug, convention dates, start date, site URL | High |
| `lib/calendar.ts` | Google Calendar link generation from event data | Medium |
| `lib/event-jsonld.ts` | schema.org Event JSON-LD generation | Medium |
| `lib/reading-time.ts` | Blog post reading time estimate utility | Low |
| `app/robots.ts` | robots.txt generation (Next.js Metadata API) | Medium |
| `app/sitemap.ts` | XML sitemap generation (Next.js Metadata API) | Medium |
| `app/feed.xml/route.ts` | RSS 2.0 feed for blog posts | Low |
| `lib/types.ts` | Shared TypeScript interfaces | High |
| `AA_TRADITIONS_GUARDRAILS.md` | AA anonymity compliance rules | Non-negotiable |
| `ACCESSIBILITY_GUIDELINES.md` | WCAG 2.1 AAA requirements | Non-negotiable |

---

## Governing Documents (READ BEFORE TOUCHING CODE)

1. **`AA_TRADITIONS_GUARDRAILS.md`** — No full names, no faces, no promotion, no endorsement. Violations are blockers.
2. **`ACCESSIBILITY_GUIDELINES.md`** — WCAG 2.1 AAA target (AA absolute floor). Every component must be keyboard-accessible, screen-reader-friendly, and work in all 6 a11y modes.
3. **`CONTRIBUTING.md`** — Branch naming, commit format, escalation rules.
4. **`docs/tech-debt-and-gaps.md`** — Known issues ranked P0–P3 with T-shirt sizing.
