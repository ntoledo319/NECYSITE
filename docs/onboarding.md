# Developer Onboarding Guide

Welcome to the NECYPAA XXXVI codebase. This guide will get you from zero to productive.

## Required Reading (Before You Write Code)

These are non-negotiable:

1. **`AA_TRADITIONS_GUARDRAILS.md`** — Anonymity and traditions compliance rules. Violating these is a blocker.
2. **`ACCESSIBILITY_GUIDELINES.md`** — WCAG 2.1 AAA target. Accessibility is a first-class requirement.
3. **`CONTRIBUTING.md`** — Contribution rules, branch naming, commit format.

**The Cardinal Rules:**

- No full names of AA members. Ever.
- No identifiable faces of AA members. Ever.
- Attraction, not promotion. Informational tone only.
- When in doubt, ask a human.

## Environment Setup

### 1. Install Prerequisites

```bash
# Node.js 20+ (via nvm or fnm)
nvm install 20
nvm use 20

# pnpm 9+
corepack enable
corepack prepare pnpm@latest --activate
```

### 2. Clone & Install

```bash
git clone <repo-url>
cd NECYPASITE
pnpm install
```

### 3. Configure Environment

Create `.env.local` in the project root:

```env
# Required
PAYLOAD_SECRET=any-random-string-for-local-dev
STRIPE_SECRET_KEY=sk_test_your_stripe_test_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_test_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Optional (access code feature)
ISSUER_SERVICE_BASE_URL=http://localhost:4000
ISSUER_SERVICE_API_KEY=your-issuer-api-key
```

Get Stripe test keys from the [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys).

### 4. Start Development

```bash
pnpm dev
```

- **Site:** http://localhost:3000
- **CMS Admin:** http://localhost:3000/admin (create an admin user on first visit)

## Project Layout

```
app/[locale]/(frontend)/    ← All user-facing pages
  page.tsx                  ← Homepage
  register/page.tsx         ← Registration flow
  breakfast/page.tsx        ← Breakfast ticket checkout
  states/page.tsx           ← Interactive state map + meeting directory
  ...

actions/                    ← Server actions (mutations)
  registration.ts           ← Stripe checkout + access code redemption
  breakfast.ts              ← Breakfast checkout

components/                 ← React components
  sections/                 ← Homepage section components
  ui/                       ← shadcn/ui primitives (Button, Input, etc.)
  checkout/                 ← Stripe checkout sub-components
  site-header.tsx           ← Main navigation
  site-footer.tsx           ← Footer
  accessibility-panel.tsx   ← 6-mode a11y settings

lib/                        ← Shared code
  validation.ts             ← Zod schemas (THE source of truth for input validation)
  rate-limit.ts             ← Per-email rate limiting
  registration-products.ts  ← Product definitions + fee calculation
  types.ts                  ← Shared TypeScript interfaces
  constants.ts              ← URLs and event constants
  data/                     ← Static data (meetings, states, events)

collections/                ← Payload CMS collection schemas
messages/                   ← i18n strings (en.json, es.json)
```

## How Things Work

### Adding a New Page

1. Create `app/[locale]/(frontend)/your-page/page.tsx`
2. The page automatically gets the shared layout (header, footer, a11y provider)
3. For i18n, add keys to `messages/en.json` and `messages/es.json`
4. Add the page to the navigation in `components/site-header.tsx`
5. Add the page to accessibility tests in `e2e/accessibility.spec.ts`

### Modifying Forms

All form inputs are validated server-side by Zod schemas in `lib/validation.ts`. If you add a field:

1. Add the field to the interface in `lib/types.ts`
2. Add the field to the Zod schema in `lib/validation.ts`
3. Add the field to the server action metadata object
4. Update the component form UI

### Working with Payments

- **Never** commit real Stripe keys. Use `sk_test_` / `pk_test_` keys only.
- The Stripe client is in `lib/stripe.ts` (server-only — cannot be imported in client components).
- All pricing is in cents (e.g. `4000` = $40.00).
- Processing fees use a gross-up formula in `calculateProcessingFee()`.

### Working with the CMS

Payload CMS collections are defined in `collections/`. To add a new collection:

1. Create the schema file in `collections/YourCollection.ts`
2. Register it in `payload.config.ts`
3. Run `pnpm dev` — Payload auto-migrates the SQLite schema

### Styling

- Use Tailwind utility classes. Never hardcode colors — use CSS custom properties from `globals.css`:
  - `var(--nec-purple)`, `var(--nec-cyan)`, `var(--nec-pink)`, `var(--nec-gold)`
  - `var(--nec-bg)`, `var(--nec-surface)`, `var(--nec-border)`, `var(--nec-muted)`
- Responsive: mobile-first. Most users are on phones.
- Accessibility: design tokens respond to a11y class toggles (high contrast, grayscale, etc.)

## Quality Checks

Run these before every PR:

```bash
pnpm lint          # Must pass (zero new warnings)
pnpm format:check  # Must pass
pnpm build         # Must pass clean
pnpm test          # 58 unit tests must pass
```

### Pre-commit Hook

Husky runs `lint-staged` on commit, which ESLints all staged `.ts`/`.tsx` files. If lint fails, the commit is rejected — fix the issues before committing.

### Running Accessibility Tests

```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run accessibility tests
pnpm test:a11y

# Run with UI for debugging
pnpm test:a11y:ui
```

These tests use axe-core to check every page against WCAG 2.1 AA/AAA rules.

## Common Tasks

### "I need to add a new meeting to the directory"

Edit `lib/data/ypaa-meetings.ts`. Add the meeting to the appropriate state's array, following the existing `MeetingInfo` interface.

### "I need to add a new event"

Add the event via the Payload CMS admin at `/admin` (Events collection). The static fallback in `lib/data/events.ts` is only used if the CMS is empty.

### "I need to update the FAQ"

FAQs can be managed via the Payload CMS admin at `/admin`. The `FAQ` collection supports categories, sort order, and bilingual content.

### "I need to add a new blog post"

Add the post via the Payload CMS admin at `/admin` (BlogPosts collection). The static fallback in `lib/data/blog-posts.ts` is only used if the CMS is empty.

## Architecture Docs

For deeper understanding, see:

- `docs/architecture.md` — System design, data flows, security model
- `docs/tech-debt-and-gaps.md` — Known issues and prioritized backlog
- `docs/testing.md` — Testing strategy and coverage
