# NECYPAA XXXVI — Comprehensive Codebase Review

**Date:** March 20, 2026
**Methodology:** Windsurf Skills — `a11y-audit`, `code-reviewer`, `senior-frontend`, `senior-security`, `senior-qa`, `stripe-integration-expert`
**Tools Used:** `a11y_scanner.py`, `code_quality_checker.py`, `secret_scanner.py`, targeted grep analysis, manual code review

---

## Executive Summary

| Skill Area                                     | Grade  | Score  | Critical Issues |
| ---------------------------------------------- | ------ | ------ | --------------- |
| Accessibility (a11y-audit)                     | **B+** | 85/100 | 2               |
| Code Quality (code-reviewer)                   | **C+** | 77/100 | 5               |
| Frontend (senior-frontend)                     | **C**  | 72/100 | 4               |
| Security (senior-security)                     | **A-** | 90/100 | 1               |
| QA / Testing (senior-qa)                       | **D**  | 40/100 | 3               |
| Stripe Integration (stripe-integration-expert) | **B**  | 82/100 | 2               |

**Overall Verdict:** Request changes — 17 findings require attention before this codebase meets the standard defined by the project's own accessibility-first mandate and the skill frameworks.

---

## 1. Accessibility Audit (a11y-audit skill)

### WCAG 2.2 Compliance Matrix

| Criterion                  | Status          | Notes                                                                                     |
| -------------------------- | --------------- | ----------------------------------------------------------------------------------------- |
| 1.1.1 Non-text Content     | ✅ Pass         | All `<Image>` components have `alt` props; decorative images use `alt=""` + `aria-hidden` |
| 1.3.1 Info & Relationships | ⚠️ Partial      | Semantic HTML used broadly; static IDs risk collision (see A11Y-003)                      |
| 1.4.3 Contrast (Minimum)   | ✅ Pass         | E2E tests with axe-core `color-contrast` rule; CSS variables respect high-contrast mode   |
| 2.1.1 Keyboard             | ✅ Pass         | No `<div onClick>` without role/tabIndex found; all ESLint disables justified             |
| 2.4.1 Bypass Blocks        | ✅ Pass         | Skip-to-content link in root layout                                                       |
| 2.4.7 Focus Visible        | ✅ Pass         | `:focus-visible` outlines never suppressed in globals.css                                 |
| 2.5.8 Target Size (2.2)    | ⚠️ Not verified | No automated check; manual audit recommended                                              |
| 4.1.2 Name/Role/Value      | ⚠️ Partial      | Emojis in content lack `aria-hidden` (see A11Y-002)                                       |
| 4.1.3 Status Messages      | ✅ Pass         | `aria-live` regions present in A11yProvider                                               |

### Findings

#### A11Y-001 — Decorative emojis missing `aria-hidden` [P1 / Major]

**WCAG:** 1.1.1 / 4.1.2
**Files:**

- `components/sections/quick-facts-strip.tsx` — Lines 22, 40, 47: `🎟️`, `🎉`, `🤝` emojis rendered without `aria-hidden="true"`
- `components/sections/purpose-section.tsx` — Lines 4, 14: `🤝`, `🎉` emojis in pillar data

**Impact:** Screen readers announce emoji names ("ticket", "party popper") disrupting the reading flow.
**Fix:** Wrap emojis in `<span aria-hidden="true">` or add `role="img" aria-label="..."` if semantically meaningful.

#### A11Y-002 — Static HTML `id` attributes risk collision [P2 / Moderate]

**WCAG:** 4.1.1 Parsing
**Files:**

- `components/registration-form.tsx` — 10 static IDs (`id="name"`, `id="email"`, etc.)
- `components/ct-state.tsx` — SVG filter IDs (`id="ct-border"`, `id="neon-glow"`)
- `components/art/hero-portal-frame.tsx` — `id="portalGrad"`
- `components/art/mad-realm-maze-bg.tsx` — `id="mad-realm-maze"`

**Impact:** If components render multiple times or on the same page, IDs collide → broken ARIA references and invalid HTML.
**Fix:** Use React `useId()` for form inputs. SVG IDs are less risky (scoped to `<svg>`) but should still use unique IDs if the component is reusable.

#### A11Y-003 — ESLint disables present with justification [P3 / Info]

**Files:** 12 `eslint-disable` comments across `flyer-with-modal.tsx`, `site-header.tsx`, `accessibility-panel.tsx`, game canvases, `policy-agreement.tsx`
**Status:** All have explanatory comments. Game canvases correctly use `role="application"`. Backdrop dismissals are supplementary to Escape key + close button.
**Action:** No fix needed — well-documented exceptions.

#### A11Y-004 — E2E accessibility test suite is strong [Info / Positive]

**File:** `e2e/accessibility.spec.ts`
**Coverage:** 10 content pages + 6 placeholder pages tested at AA level; AAA tests run as best-effort; keyboard nav, contrast, landmark, and form label tests present.
**Gap:** Missing E2E tests for: modal focus trap, `prefers-reduced-motion` behavior, high-contrast mode, dyslexia font mode.

---

## 2. Code Quality (code-reviewer skill)

### Automated Analysis Results

| Directory     | Avg Score | Grade | Files Analyzed | Code Smells |
| ------------- | --------- | ----- | -------------- | ----------- |
| `lib/`        | 93.1      | A     | 18             | 73          |
| `app/`        | 86.0      | B     | 29             | 200         |
| `components/` | 76.9      | C     | 59             | 653         |

### Failing Files (Score < 60)

| File                                             | Score | Lines | Primary Issue                                  |
| ------------------------------------------------ | ----- | ----- | ---------------------------------------------- |
| `components/necypaa-region-map.tsx`              | 0     | 408   | Massive SVG data + component logic in one file |
| `components/sections/ypaa-narrative-section.tsx` | 14    | 504   | Long file, inline SVG components, high nesting |
| `components/state-card.tsx`                      | 19    | 459   | Large component with inline SVGs               |
| `components/site-footer.tsx`                     | 20    | 249   | Long JSX tree, many inline styles              |
| `components/site-header.tsx`                     | 29    | 422   | Complex navigation with dropdown/drawer logic  |
| `app/[locale]/(frontend)/events/page.tsx`        | 32    | ?     | Page-level complexity                          |
| `app/[locale]/(frontend)/alanon/page.tsx`        | 40    | ?     | Large page component                           |
| `app/[locale]/(frontend)/states/page.tsx`        | 41    | ?     | Large data page                                |
| `app/[locale]/(frontend)/service/page.tsx`       | 42    | ?     | Large page                                     |
| `components/games/tetris.tsx`                    | 57    | 426   | Game logic complexity (acceptable)             |

### Findings

#### CQ-001 — 5 components exceed 400 lines [P1 / High]

**Threshold:** >500 lines = god class (code-reviewer skill)
**Files:** `ypaa-narrative-section.tsx` (504), `state-card.tsx` (459), `site-header.tsx` (422), `tetris.tsx` (426), `necypaa-region-map.tsx` (408)
**Fix:** Extract inline SVGs to dedicated art components. Split `site-header.tsx` into `DesktopNav`, `MobileDrawer`, `NavDropdown`. Extract `ypaa-narrative-section.tsx` SVGs (`DancingFigures`, `ConnectionWeb`, `SpeakerPodium`) into `art/` directory.

#### CQ-002 — `response.json()` cast without runtime validation [P1 / High]

**File:** `lib/issuer-client.ts` — Lines 62, 80
**Code:**

```typescript
const body = await response.json().catch(() => null) // line 62
const result = await response.json() // line 80
```

**Impact:** External API responses are trusted without Zod validation. Malformed data from the issuer service propagates unchecked.
**Fix:** Define a Zod schema for the issuer response and validate with `.safeParse()`.

#### CQ-003 — No `error.tsx` error boundaries at any route level [P1 / High]

**Impact:** Unhandled runtime errors show Next.js default error page instead of a branded, accessible error state.
**Fix:** Add `error.tsx` at minimum to `app/[locale]/(frontend)/error.tsx`.

#### CQ-004 — No `loading.tsx` loading states at any route level [P2 / Medium]

**Impact:** Route transitions show no visual feedback. Users on slow connections see blank screens.
**Fix:** Add `loading.tsx` with skeleton UI at `app/[locale]/(frontend)/loading.tsx` and heavy routes like `/register`, `/events`.

#### CQ-005 — 1 SOLID violation detected in `lib/` [P3 / Low]

**Details:** Single violation flagged by the code quality checker. Likely SRP concern in a data file.

---

## 3. Frontend Review (senior-frontend skill)

### Next.js Optimization Audit

| Pattern                   | Status     | Impact                                                                    |
| ------------------------- | ---------- | ------------------------------------------------------------------------- |
| Server Components default | ✅         | Only 3 of 83 `.tsx` files use `'use client'` — excellent                  |
| `optimizePackageImports`  | ❌ Missing | `lucide-react ^0.454.0` ships entire icon set without tree-shaking config |
| Dynamic imports           | ❌ None    | No `next/dynamic` usage for heavy below-fold components                   |
| `<Suspense>` streaming    | ❌ None    | No streaming boundaries for non-critical content                          |
| `loading.tsx`             | ❌ None    | No route-level loading states                                             |
| `error.tsx`               | ❌ None    | No error boundaries                                                       |
| Image optimization        | ✅         | `formats: ["image/avif", "image/webp"]` configured; `alt` on all images   |
| React Strict Mode         | ✅         | `reactStrictMode: true`                                                   |
| ESLint/TS on build        | ✅         | `ignoreDuringBuilds: false` for both                                      |

### Findings

#### FE-001 — Missing `optimizePackageImports` for `lucide-react` [P1 / Critical for bundle]

**File:** `next.config.ts`
**Impact:** `lucide-react` is one of the largest icon libraries. Without `optimizePackageImports`, the full library may be bundled even if only a few icons are used.
**Fix:**

```typescript
experimental: {
  optimizePackageImports: ['lucide-react'],
}
```

#### FE-002 — No dynamic imports for heavy components [P2 / Medium]

**Candidates for `next/dynamic`:**

- `components/necypaa-region-map.tsx` (408 lines, SVG-heavy)
- `components/games/*.tsx` (4 game canvases, only shown on interaction)
- `components/art/mad-realm-art-layer.tsx` (decorative, below fold)
- `components/art/steampunk-gears.tsx` (decorative SVGs)

**Fix:** Use `dynamic(() => import(...), { ssr: false })` for game components and `{ loading: () => <Skeleton /> }` for art components.

#### FE-003 — No `<Suspense>` boundaries for streaming [P2 / Medium]

**Impact:** Entire page blocks on slowest data/component. Non-critical sections (events preview, blog grid, footer art) could stream in.
**Fix:** Wrap non-critical sections in `<Suspense fallback={<Skeleton />}>`.

#### FE-004 — Server component usage is excellent [Info / Positive]

Only 3 files use `'use client'`: `theme-provider.tsx`, `ui/label.tsx`, `ui/checkbox.tsx`. Most interactive components correctly use client-side hooks where needed while the page-level components remain server components.

---

## 4. Security Review (senior-security skill)

### Security Headers Checklist

| Header                    | Required                                 | Configured                                   | Status                                     |
| ------------------------- | ---------------------------------------- | -------------------------------------------- | ------------------------------------------ |
| Content-Security-Policy   | ✅                                       | ✅                                           | ⚠️ Has `'unsafe-inline'` + `'unsafe-eval'` |
| X-Frame-Options           | DENY                                     | DENY                                         | ✅                                         |
| X-Content-Type-Options    | nosniff                                  | nosniff                                      | ✅                                         |
| Strict-Transport-Security | max-age=31536000                         | max-age=63072000; includeSubDomains; preload | ✅ Better than required                    |
| Referrer-Policy           | strict-origin-when-cross-origin          | strict-origin-when-cross-origin              | ✅                                         |
| Permissions-Policy        | geolocation=(), microphone=(), camera=() | Same                                         | ✅                                         |
| X-DNS-Prefetch-Control    | —                                        | on                                           | ✅ Bonus                                   |

### Secret Scanning Results

| Finding                                                 | Severity | Real?             | Notes                                              |
| ------------------------------------------------------- | -------- | ----------------- | -------------------------------------------------- |
| 191 "secrets" in `pnpm-lock.yaml` / `package-lock.json` | HIGH     | ❌ False positive | Package integrity hashes matching Twilio key regex |
| 7 "secrets" in `claude-skills/`                         | CRITICAL | ❌ False positive | Example code in skill reference files              |
| Source code (app/, components/, lib/, actions/)         | —        | ✅ Clean          | Zero actual secrets in source                      |

### Secure Code Review Checklist

| Category           | Check                        | Status | Notes                                                |
| ------------------ | ---------------------------- | ------ | ---------------------------------------------------- |
| Input Validation   | All user input validated     | ✅     | Zod schemas for all server actions                   |
| Output Encoding    | Context-appropriate encoding | ✅     | React's default JSX escaping                         |
| Secrets            | No hardcoded credentials     | ✅     | All keys via `process.env`                           |
| Dependencies       | `.env` files gitignored      | ✅     | `.env*` in `.gitignore`                              |
| Rate Limiting      | Server action protection     | ✅     | Sliding window rate limiter on checkout/registration |
| Input Sanitization | HTML tag stripping           | ✅     | `sanitize()` function strips tags                    |

### Findings

#### SEC-001 — CSP allows `'unsafe-inline'` and `'unsafe-eval'` for scripts [P2 / Medium]

**File:** `next.config.ts` — `script-src 'self' 'unsafe-inline' 'unsafe-eval'`
**Impact:** XSS vectors remain partially open despite CSP.
**Context:** Next.js requires `'unsafe-inline'` for its inline scripts in production, and `'unsafe-eval'` may be needed for dev. Consider using nonces (`'nonce-{random}'`) in production or removing `'unsafe-eval'` in production builds.
**Risk Score (DREAD):** Damage: 6, Reproducibility: 4, Exploitability: 5, Affected Users: 8, Discoverability: 3 → **5.2 / Medium**

#### SEC-002 — External API response not validated [P1 / High]

**File:** `lib/issuer-client.ts` — Lines 62, 80
**Impact:** `response.json()` result is cast directly to `RedemptionResult` without runtime validation. A compromised or buggy issuer service could inject unexpected data.
**Fix:** Validate with Zod schema before casting.

#### SEC-003 — No Stripe webhook handler [P2 / Medium]

**Observation:** No `app/api/webhooks/stripe/route.ts` found. Only Payload CMS API routes exist (`app/(payload)/api/`).
**Impact per stripe-integration-expert skill:** Without webhook handling, the app cannot:

- Confirm payment completion server-side
- Handle failed payments
- Track subscription status changes
- Ensure idempotent event processing
  **Context:** If using Stripe Checkout embedded mode with redirect, the success page URL with `session_id` may be sufficient for one-time payments. However, this is fragile — the user could close the browser before redirect.

---

## 5. QA / Testing (senior-qa skill)

### Current Test Inventory

| Type                   | Count   | Coverage                                                    |
| ---------------------- | ------- | ----------------------------------------------------------- |
| Unit tests (Vitest)    | 3 files | `lib/` only — rate-limit, validation, registration-products |
| E2E tests (Playwright) | 1 file  | Accessibility only (188 lines, very thorough)               |
| Component tests        | 0       | ❌ None                                                     |
| Integration tests      | 0       | ❌ None                                                     |
| Visual regression      | 0       | ❌ None                                                     |

### Test Runner Configuration

- **Vitest:** `vitest.config.ts` present, `npm test` configured
- **Playwright:** Configured, `test:a11y` and `test:a11y:ui` scripts present
- **Coverage reporting:** Not configured (no `coverageThreshold` in vitest config)

### Findings

#### QA-001 — Zero component tests [P0 / Critical]

**Impact:** 59 components have zero test coverage. Critical user-facing components untested:

- `registration-checkout.tsx` — handles payment flow
- `registration-form.tsx` — collects PII
- `policy-agreement.tsx` — legal compliance gate
- `breakfast-checkout.tsx` — payment flow
- `accessibility-panel.tsx` — a11y settings

**Priority test targets:**

1. `registration-form.tsx` — form validation, required fields, submission
2. `registration-checkout.tsx` — price calculation, Stripe loading, error states
3. `policy-agreement.tsx` — all checkboxes required before continue
4. `accessibility-panel.tsx` — settings persist, modes apply correctly
5. `expandable-meeting-row.tsx` — keyboard interaction, aria-expanded state

#### QA-002 — No coverage thresholds configured [P1 / High]

**Fix:** Add to `vitest.config.ts`:

```typescript
coverage: {
  provider: 'v8',
  thresholds: {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80,
  },
}
```

#### QA-003 — Missing E2E tests for critical user flows [P1 / High]

**Missing flows:**

1. Registration → checkout → success (happy path)
2. Free registration flow
3. Access code redemption
4. Breakfast ticket purchase
5. Mobile CTA bar navigation
6. Accessibility panel toggle all 6 modes
7. Modal focus trap + Escape key behavior

---

## 6. Stripe Integration Review (stripe-integration-expert skill)

### Checkout Session Checklist

| Check                             | Status | Notes                                                  |
| --------------------------------- | ------ | ------------------------------------------------------ |
| Metadata includes user identifier | ✅     | Email, name, homegroup in metadata                     |
| `success_url` includes session_id | ✅     | Uses `{CHECKOUT_SESSION_ID}`                           |
| `cancel_url` configured           | ✅     | Returns to register page                               |
| Rate limiting on checkout         | ✅     | 5/min by email                                         |
| Processing fee calculation        | ✅     | `calculateProcessingFee()` handles Stripe's 2.9% + 30¢ |

### Webhook Handling Checklist

| Check                               | Status | Notes                    |
| ----------------------------------- | ------ | ------------------------ |
| Signature verification              | ❌     | No webhook handler found |
| Idempotency table                   | ❌     | No webhook handler found |
| Re-fetch from Stripe API            | ❌     | No webhook handler found |
| Handle `checkout.session.completed` | ❌     | No webhook handler found |
| Handle `invoice.payment_failed`     | N/A    | One-time payments only   |

### Findings

#### STRIPE-001 — No webhook handler [P2 / Medium]

**Per skill pitfall:** "Webhook delivery order not guaranteed — always re-fetch from Stripe API, never trust event data alone for DB updates."
**Impact:** Payment confirmation relies entirely on client-side redirect. If user closes browser mid-payment, registration may be lost.
**Fix:** Add `app/api/webhooks/stripe/route.ts` with at minimum `checkout.session.completed` handler.

#### STRIPE-002 — Processing fee calculation should be server-side only [P3 / Low]

**File:** `lib/registration-products.ts`
**Observation:** `calculateProcessingFee()` is in a shared lib, potentially importable by client components.
**Risk:** Fee calculation logic leaking to client isn't a security risk per se, but fee amounts should be validated server-side regardless of what the client sends.
**Status:** Server actions do recalculate server-side ✅

---

## 7. Previously Fixed Issues (from prior session)

These issues were identified and resolved in the previous review session:

| Issue                                   | File                                        | Fix Applied                |
| --------------------------------------- | ------------------------------------------- | -------------------------- |
| Static `id` collision in ContentWarning | `components/content-warning.tsx`            | Switched to `useId()`      |
| Homegroup validation mismatch           | `lib/validation.ts`                         | Added `.min(1)`            |
| Decorative emoji missing aria-hidden    | `components/sections/purpose-section.tsx`   | Added `aria-hidden="true"` |
| customerId leaked to client             | `actions/free-registration.ts`              | Removed from return value  |
| Footer/MobileCtaBar only on homepage    | `app/[locale]/(frontend)/layout.tsx`        | Moved to layout            |
| Misleading interactive class on pills   | `components/sections/quick-facts-strip.tsx` | Conditional class          |

---

## 8. Priority Action Plan

### P0 — Fix before next deploy

1. **QA-001:** Write component tests for registration-checkout, registration-form, policy-agreement
2. **CQ-003:** Add `error.tsx` error boundary at frontend layout level

### P1 — Fix within current sprint

3. **FE-001:** Add `optimizePackageImports: ['lucide-react']` to next.config.ts
4. **SEC-002 / CQ-002:** Add Zod validation to `issuer-client.ts` response parsing
5. **A11Y-001:** Add `aria-hidden="true"` to remaining decorative emojis
6. **QA-002:** Configure coverage thresholds in vitest.config.ts
7. **QA-003:** Scaffold E2E tests for registration and checkout flows

### P2 — Fix within next 2 sprints

8. **FE-002:** Add dynamic imports for game components and heavy art components
9. **FE-003:** Add `<Suspense>` boundaries for non-critical sections
10. **CQ-004:** Add `loading.tsx` skeleton UIs
11. **STRIPE-001:** Implement Stripe webhook handler for `checkout.session.completed`
12. **SEC-001:** Tighten CSP by removing `'unsafe-eval'` in production
13. **A11Y-002:** Migrate static form IDs to `useId()`

### P3 — Backlog

14. **CQ-001:** Refactor oversized components (region map, narrative section, state card)
15. **STRIPE-002:** Ensure fee calculation is server-authoritative (already is)

---

## 9. Windsurf Workflows Created

The following workflows are now available as slash commands for future reviews:

| Workflow           | Command                                  | Description                           |
| ------------------ | ---------------------------------------- | ------------------------------------- |
| `/a11y-audit`      | `.windsurf/workflows/a11y-audit.md`      | WCAG 2.2 scan → fix → verify cycle    |
| `/code-review`     | `.windsurf/workflows/code-review.md`     | Code quality + SOLID + PR analysis    |
| `/security-review` | `.windsurf/workflows/security-review.md` | STRIDE threat model + secret scan     |
| `/frontend-review` | `.windsurf/workflows/frontend-review.md` | Next.js optimization + React patterns |
| `/qa-review`       | `.windsurf/workflows/qa-review.md`       | Test generation + coverage analysis   |
| `/stripe-review`   | `.windsurf/workflows/stripe-review.md`   | Stripe integration checklist          |
