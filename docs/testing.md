# Testing Strategy

> Current state and roadmap for the NECYPAA XXXVI test suite.

## Test Infrastructure

| Tool                   | Purpose                    | Command                               |
| ---------------------- | -------------------------- | ------------------------------------- |
| Vitest 4               | Unit tests                 | `pnpm test`                           |
| Playwright 1.58        | E2E + accessibility        | `pnpm test:a11y`                      |
| axe-core               | WCAG 2.1 AA/AAA compliance | Integrated via `@axe-core/playwright` |
| @testing-library/react | React component tests      | Used by Vitest for hooks/context      |

## Current Coverage

### Unit Tests — 45 passing

| Suite                 | File                                          | Tests | What's Covered                                                                                                                                          |
| --------------------- | --------------------------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Validation schemas    | `lib/__tests__/validation.test.ts`            | 11    | All Zod schemas — registration data, policy agreements, breakfast attendee, IDs, product ID, scholarship qty. Includes XSS sanitization and edge cases. |
| Rate limiter          | `lib/__tests__/rate-limit.test.ts`            | 4     | Sliding window enforcement, key independence, reset timing.                                                                                             |
| Registration products | `lib/__tests__/registration-products.test.ts` | 8     | Processing fee gross-up formula (single, combined, zero-amount), product catalog integrity, Stripe fee coverage proof.                                  |
| Issuer client         | `lib/__tests__/issuer-client.test.ts`         | 8     | Access code masking, code redemption success/failure paths, HTTP error codes (400/404/500), network failures, request headers/body verification.        |
| Accessibility context | `lib/__tests__/accessibility-context.test.ts` | 4     | Provider defaults, partial updates, reset, error on missing provider.                                                                                   |

### E2E / Accessibility Tests — Playwright

| Suite                 | Tests                                  | What's Covered                                                   |
| --------------------- | -------------------------------------- | ---------------------------------------------------------------- |
| WCAG 2.1 AA per page  | 10 content pages + 6 placeholder pages | Full axe-core scan against AA ruleset                            |
| WCAG 2.1 AAA per page | 10 content pages                       | Best-effort AAA scan (non-blocking)                              |
| Keyboard navigation   | 2                                      | Skip-to-content link, tab reachability                           |
| Color contrast        | 1                                      | Homepage contrast violations                                     |
| ARIA & semantics      | 4                                      | Image alt text, form labels, landmark structure, nav aria-labels |

## What's Not Tested

### Critical Gaps (Should Address)

1. **Server actions (integration)** — `startRegistrationCheckout`, `startBreakfastCheckout`, `submitFreeRegistration`, and `submitAccessCodeRegistration` have no integration tests. The validation layer is tested via unit tests, but the full flow (validate → rate limit → Stripe API → return) is untested. This requires mocking the Stripe SDK.

2. **Stripe webhook handler** — Does not exist yet (see `docs/tech-debt-and-gaps.md` P0 #1). When implemented, it will need tests for signature verification, idempotent event processing, and error handling.

3. **React component rendering** — No snapshot or interaction tests for key components like `RegistrationForm`, `BreakfastCheckout`, `AccessibilityPanel`, or `StateCard`. These rely on manual QA and Playwright's axe-core scans.

4. **i18n message completeness** — No automated check that `es.json` has all the keys that `en.json` has. Missing keys would cause runtime fallback to English without warning.

### Lower Priority

5. **Game components** — Seven retro games in `components/games/` have no tests. They are Easter eggs and non-critical.

6. **Blog post rendering** — No tests for the blog index or dynamic `[slug]` page. Content comes from static data currently.

7. **Sitemap generation** — `app/sitemap.ts` has no tests verifying it returns valid XML with correct URLs.

## How to Run Tests

```bash
# Unit tests (fast, no browser needed)
pnpm test

# Unit tests in watch mode
pnpm test:watch

# Accessibility / E2E tests (requires Playwright browsers)
npx playwright install    # First time only
pnpm test:a11y

# Accessibility tests with UI debugger
pnpm test:a11y:ui
```

## Writing New Tests

### Unit Tests

Place in `lib/__tests__/` with the naming convention `<module>.test.ts`.

```typescript
import { describe, it, expect } from "vitest"
import { myFunction } from "../my-module"

describe("myFunction", () => {
  it("does the expected thing", () => {
    expect(myFunction("input")).toBe("output")
  })
})
```

For React hooks/context tests, add the jsdom pragma:

```typescript
// @vitest-environment jsdom
import { renderHook } from "@testing-library/react"
```

### E2E Tests

Place in `e2e/` with the naming convention `<feature>.spec.ts`. These use Playwright's test runner (separate from Vitest).

### Testing Principles

1. **Test behavior, not implementation.** Validate what the function returns or what the user sees, not internal state.
2. **Server actions are trust boundaries.** All inputs must pass through Zod schemas — test the schemas thoroughly.
3. **Accessibility is not optional.** Every new page must be added to the Playwright accessibility test suite.
4. **Don't mock what you don't own** — except at system boundaries (Stripe SDK, external APIs). For those, mock at the fetch/SDK level.

## CI Integration

Tests run via:

- **Pre-commit hook:** Husky + lint-staged runs ESLint on staged `.ts`/`.tsx` files
- **Build:** `pnpm build` enforces TypeScript type checking and ESLint (both configured to fail on errors)
- **Manual:** `pnpm test` for unit tests, `pnpm test:a11y` for accessibility

Recommended CI pipeline addition:

```yaml
- pnpm test # Unit tests
- pnpm build # Type check + lint + build
- pnpm test:a11y # Accessibility (requires Playwright browsers)
```
