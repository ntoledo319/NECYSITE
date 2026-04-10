# NECYPAA XXXVI — Escaping the Mad Realm

Convention website for the 36th Northeast Convention of Young People in Alcoholics Anonymous.

**Dates:** December 31, 2026 – January 3, 2027
**Venue:** Hartford Marriott Downtown, Hartford, CT
**Live site:** [necypaact.com](https://www.necypaact.com)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, React 19) |
| Language | TypeScript 5.7 (strict mode) |
| CMS | Payload CMS 3 (SQLite) |
| Styling | Tailwind CSS 3.4 + custom design tokens |
| Payments | Stripe (Embedded Checkout) |
| i18n | next-intl (English + Spanish) |
| UI | Radix UI primitives + shadcn/ui |
| Validation | Zod |
| Testing | Vitest (unit) + Playwright (e2e/a11y) |
| Hosting | Vercel |

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 10+
- A Stripe account (test keys for development)

### Setup

```bash
git clone <repo-url>
cd NECYPASITE
pnpm install
```

Create a `.env.local` file:

```env
PAYLOAD_SECRET=any-random-string-for-local-dev
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Development

```bash
pnpm dev          # Start dev server at http://localhost:3000
pnpm build        # Production build (must pass clean)
pnpm lint         # ESLint
pnpm format       # Prettier
pnpm test         # Vitest unit tests (45 tests)
pnpm test:a11y    # Playwright accessibility tests
```

The Payload CMS admin panel is at `/admin`.

## Project Structure

```
app/[locale]/(frontend)/    Next.js pages (19 routes)
app/(payload)/              Payload CMS admin + API
actions/                    Server actions (Stripe checkout flows)
components/                 React components
  sections/                 Homepage sections
  ui/                       shadcn/ui primitives
  checkout/                 Stripe checkout sub-components
  games/                    Easter egg retro games
  art/                      Decorative visual components
collections/                Payload CMS collection schemas
lib/                        Shared utilities
  data/                     Static data (events, meetings, states)
  __tests__/                Unit tests
messages/                   i18n message files (en.json, es.json)
i18n/                       next-intl configuration
e2e/                        Playwright e2e + accessibility tests
docs/                       Architecture, onboarding, tech debt docs
public/                     Static assets (images, fonts)
```

## Key Features

- **Registration** — 3-step flow (info → policy → payment) with Stripe Embedded Checkout
- **Scholarship & Access Codes** — Free registration pathways with issuer service integration
- **Breakfast Tickets** — Standalone meal purchases
- **Accessibility** — WCAG 2.1 AAA target with 6-mode accessibility panel (font size, contrast, motion, dyslexia font, grayscale, color mode)
- **Bilingual** — English + human-translated Spanish via next-intl
- **Interactive States Map** — Meeting directory across 13 NECYPAA member states + DC
- **Events & Blog** — Convention schedule and blog with CMS backend
- **Security** — CSP headers, Zod input sanitization, rate limiting, HSTS

## Governing Documents

| Document | Purpose |
|----------|---------|
| `AA_TRADITIONS_GUARDRAILS.md` | AA Traditions compliance rules (non-negotiable) |
| `ACCESSIBILITY_GUIDELINES.md` | WCAG 2.1 AAA accessibility requirements |
| `CONTRIBUTING.md` | Contribution rules for humans and AI agents |
| `NECYPREAMBLE.md` | Project vision, architecture decisions, roadmap |

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm lint:fix` | Run ESLint with auto-fix |
| `pnpm format` | Format with Prettier |
| `pnpm format:check` | Check formatting |
| `pnpm test` | Run unit tests |
| `pnpm test:watch` | Run unit tests in watch mode |
| `pnpm test:a11y` | Run Playwright accessibility tests |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PAYLOAD_SECRET` | Yes | Secret for Payload CMS encryption |
| `STRIPE_SECRET_KEY` | Yes | Stripe secret key (server-side) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Yes | Stripe publishable key (client-side) |
| `NEXT_PUBLIC_BASE_URL` | Yes | Base URL for callback URLs |
| `GOOGLE_CALENDAR_API_KEY` | No | Google Calendar API key (for live calendar) |
| `ISSUER_SERVICE_BASE_URL` | No | Access code redemption service URL |
| `ISSUER_SERVICE_API_KEY` | No | Access code redemption service API key |

---

*Alcoholics Anonymous, A.A., and The Big Book are registered trademarks of Alcoholics Anonymous World Services, Inc.*
