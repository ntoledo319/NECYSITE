# Operations & Deployment — NECYPAA XXXVI Website

> **Last Updated:** 2026-03-23
> **Purpose:** Step-by-step instructions for anyone inheriting this codebase.

---

## Prerequisites

| Tool    | Version | Install                                                      |
| ------- | ------- | ------------------------------------------------------------ |
| Node.js | 20+     | `nvm install 20 && nvm use 20`                               |
| pnpm    | 9+      | `corepack enable && corepack prepare pnpm@latest --activate` |
| Git     | 2.30+   | Pre-installed on macOS/Linux                                 |

---

## Local Development Setup (From Zero)

### 1. Clone the Repository

```bash
git clone https://github.com/ntoledo319/NECYPASITE.git
cd NECYPASITE
```

### 2. Install Dependencies

```bash
pnpm install
```

This installs ~1,100 packages. Takes 30–60 seconds on a fresh machine.

### 3. Create Environment File

Create `.env.local` in the project root:

```env
# REQUIRED — site will not start without these
PAYLOAD_SECRET=dev-secret-change-me-in-production
STRIPE_SECRET_KEY=sk_test_REPLACE_WITH_YOUR_STRIPE_TEST_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_REPLACE_WITH_YOUR_STRIPE_TEST_KEY
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# OPTIONAL — access code feature (safe to omit for general development)
# ISSUER_SERVICE_BASE_URL=http://localhost:4000
# ISSUER_SERVICE_API_KEY=your-issuer-api-key
```

**Where to get Stripe test keys:**

1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy "Publishable key" → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
3. Copy "Secret key" → `STRIPE_SECRET_KEY`

### 4. Start Development Server

```bash
pnpm dev
```

- **Site:** http://localhost:3000
- **CMS Admin:** http://localhost:3000/admin
- **First visit to /admin:** You'll be prompted to create an admin user

### 5. Verify Everything Works

```bash
pnpm lint          # Should exit 0 with no output
pnpm test          # Should show "45 passed"
pnpm build         # Should show "Compiled successfully"
```

---

## All Available Commands

| Command             | What It Does                                          | When to Use                      |
| ------------------- | ----------------------------------------------------- | -------------------------------- |
| `pnpm dev`          | Start dev server with hot reload                      | Daily development                |
| `pnpm build`        | Production build (TypeScript check + ESLint + bundle) | Before every push                |
| `pnpm start`        | Start production server from build output             | Testing production build locally |
| `pnpm lint`         | Run ESLint across all files                           | Before committing                |
| `pnpm lint:fix`     | Run ESLint with auto-fix                              | Fix formatting/import issues     |
| `pnpm format`       | Run Prettier on all files                             | Normalize whitespace/formatting  |
| `pnpm format:check` | Check Prettier compliance (no writes)                 | CI or pre-commit                 |
| `pnpm test`         | Run Vitest unit tests (45 tests)                      | Before every push                |
| `pnpm test:watch`   | Run Vitest in watch mode                              | During TDD                       |
| `pnpm test:a11y`    | Run Playwright accessibility tests                    | Before deploying a11y changes    |
| `pnpm test:a11y:ui` | Playwright with visual debugger                       | Debugging a11y failures          |

---

## Testing

### Unit Tests (Vitest)

```bash
pnpm test
```

**45 tests across 5 suites:**

- `lib/__tests__/validation.test.ts` — Zod schema validation + XSS sanitization
- `lib/__tests__/rate-limit.test.ts` — Sliding window rate limiter
- `lib/__tests__/registration-products.test.ts` — Fee calculation + product integrity
- `lib/__tests__/issuer-client.test.ts` — Access code redemption flows + error handling
- `lib/__tests__/accessibility-context.test.ts` — A11y provider state management

### E2E / Accessibility Tests (Playwright)

```bash
# First time: install browsers
npx playwright install

# Run tests
pnpm test:a11y
```

Tests WCAG 2.1 AA compliance on all 16 pages using axe-core, plus keyboard navigation, color contrast, ARIA semantics, and landmark structure.

### Pre-Commit Hook

Husky runs `lint-staged` on every commit, which ESLints all staged `.ts`/`.tsx` files. If lint fails, the commit is blocked.

---

## Deployment (Production)

### Platform: Vercel

The site is deployed on Vercel with auto-deploy on push to `main`.

**Current production URL:** https://www.necypaact.com

### To Deploy

```bash
# 1. Verify everything passes locally
pnpm lint && pnpm test && pnpm build

# 2. Push to main (Vercel auto-deploys)
git push origin main
```

### Vercel Environment Variables

These must be set in the Vercel dashboard (Settings > Environment Variables):

| Variable                             | Value                                   |
| ------------------------------------ | --------------------------------------- |
| `PAYLOAD_SECRET`                     | Strong random string (32+ chars)        |
| `STRIPE_SECRET_KEY`                  | `sk_live_...` (LIVE key for production) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` (LIVE key for production) |
| `NEXT_PUBLIC_BASE_URL`               | `https://www.necypaact.com`             |
| `ISSUER_SERVICE_BASE_URL`            | Production issuer service URL           |
| `ISSUER_SERVICE_API_KEY`             | Production issuer API key               |

### Rolling Back a Deploy

1. Go to https://vercel.com/dashboard → select the project
2. Click "Deployments" tab
3. Find the last known-good deployment
4. Click the three-dot menu → "Promote to Production"

This is instant and does not require a new build.

---

## CMS Administration

### Accessing the Admin Panel

- **Local:** http://localhost:3000/admin
- **Production:** https://www.necypaact.com/admin

### Managing Content

| Content Type   | How to Edit                                                                                            |
| -------------- | ------------------------------------------------------------------------------------------------------ |
| **Blog Posts** | CMS admin → BlogPosts collection. Supports drafts, rich text (Lexical), featured images, EN/ES fields. |
| **Events**     | CMS admin → Events collection. Title, date, location, schedule, flyer image.                           |
| **FAQ**        | CMS admin → FAQ collection. Categories, sort order, EN/ES fields.                                      |
| **Media**      | CMS admin → Media collection. Upload images/files, alt text required.                                  |
| **Meetings**   | Edit `lib/data/ypaa-meetings.ts` directly (static data, not in CMS). Requires code change + deploy.    |
| **States**     | Edit `lib/data/states.ts` directly (static data). Requires code change + deploy.                       |

### Database

SQLite file at `payload.db` in the project root. Payload auto-migrates the schema on startup. No manual migrations needed.

**To reset the database:** Delete `payload.db` and restart the dev server. Payload will recreate it with empty collections.

---

## Monitoring & Observability

### Current Setup

- **Vercel Analytics:** Built-in, tracks page views and Web Vitals
- **Web Vitals:** CLS, INP, FCP, LCP, TTFB reported to Vercel via `lib/web-vitals.ts`
- **Error logging:** `console.error` in server actions (visible in Vercel function logs)

### Viewing Logs

1. Vercel Dashboard → Project → "Logs" tab
2. Filter by function name (e.g., `registration`, `breakfast`)
3. Or use Vercel CLI: `vercel logs --follow`

### Health Check

There is no dedicated health endpoint. Verify the site is up by loading the homepage.

---

## Domain & DNS

- **Domain:** necypaact.com
- **DNS Provider:** Managed via Vercel (or wherever the domain is registered)
- **SSL:** Automatic via Vercel (Let's Encrypt)
- **HSTS:** Enabled with 2-year max-age, includeSubDomains, preload

---

## Emergency Procedures

### Site is Down

1. Check Vercel status: https://www.vercel-status.com/
2. Check Vercel dashboard for failed deploys
3. If a bad deploy caused it: roll back (see "Rolling Back a Deploy" above)
4. If DNS issue: check domain settings in Vercel

### Stripe Payments Not Working

1. Check Stripe dashboard for errors: https://dashboard.stripe.com/
2. Verify env vars are set correctly in Vercel
3. Check Vercel function logs for `"Stripe session creation failed"` errors
4. Test with Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

### CMS Admin Locked Out

1. Delete `payload.db` (WARNING: this deletes all CMS content)
2. Restart the server — Payload will prompt to create a new admin user
3. Re-enter blog posts, events, and FAQ content

### Need to Change Stripe Keys (Compromised)

1. Go to Stripe Dashboard → Developers → API Keys
2. Roll the keys
3. Update in Vercel dashboard (Settings > Environment Variables)
4. Redeploy: `git commit --allow-empty -m "chore: trigger redeploy" && git push`

---

## Branching & Release Strategy

| Branch    | Purpose                                     |
| --------- | ------------------------------------------- |
| `main`    | Production. Auto-deploys to Vercel on push. |
| `feat/*`  | New features                                |
| `fix/*`   | Bug fixes                                   |
| `chore/*` | Maintenance, config, docs                   |

### Workflow

```bash
git checkout -b feat/your-feature
# ... make changes ...
pnpm lint && pnpm test && pnpm build
git add -A && git commit -m "feat: description"
git push -u origin feat/your-feature
# Create PR on GitHub → merge to main → auto-deploys
```

### Commit Message Format

```
feat: new feature description
fix: bug fix description
chore: maintenance task
refactor: code restructuring
style: visual/CSS changes
docs: documentation only
test: tests only
perf: performance improvements
```
