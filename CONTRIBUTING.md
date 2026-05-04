# Contributing to NECYPAA XXXVI Website

> For humans and AI agents alike.

## Governing Documents

Before writing a single line of code or content, read these:

| Document                     | Location                           | Required                                                                          |
| ---------------------------- | ---------------------------------- | --------------------------------------------------------------------------------- |
| **AA Traditions Guardrails** | `AA_TRADITIONS_GUARDRAILS.md`      | **Non-negotiable**                                                                |
| **Accessibility Guidelines** | `ACCESSIBILITY_GUIDELINES.md`      | **Non-negotiable** — inclusion & accessibility rules (from Accessibilities Chair) |
| **This Document**            | `CONTRIBUTING.md`                  | How to contribute                                                                 |
| **NECYPREAMBLE**             | `NECYPREAMBLE.md`                  | Planning & architecture                                                           |
| **AI Agent Rules**           | `.windsurf/rules.md`               | AI agent quick-reference (references all docs above)                              |
| **Changelog Workflow**       | `.windsurf/workflows/changelog.md` | Tone & format                                                                     |

---

## The Cardinal Rules

These apply to every contributor — human or AI. No exceptions.

1. **No full names** of AA members on any public page. Ever.
2. **No faces** of AA members identified as such. Ever.
3. **Attraction, not promotion.** We inform. We do not market. No superlatives.
4. **No endorsement** of outside entities. Link to Al-Anon, but we are not Al-Anon. (Tradition 6)
5. **Human review** before any content goes to production.
6. **Link to aa.org, don't copy.** Brief excerpts only, with credit lines.
7. **When in doubt, ask a human.** AI agents halt and escalate.

---

## For Human Contributors

### Setup

```bash
# Clone the repo
git clone <repo-url>
cd NECYPASITE

# Install dependencies
pnpm install

# Start dev server
pnpm dev
```

### Code Standards

- **Language:** TypeScript (strict mode)
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS with custom design tokens in `app/globals.css`
- **Linting:** `pnpm lint` (ESLint + Next.js core web vitals)
- **Formatting:** `pnpm format` (Prettier with Tailwind plugin)
- **Build check:** `pnpm build` must pass clean before any PR

### Branch Naming

- `feat/description` — new features
- `fix/description` — bug fixes
- `chore/description` — maintenance, cleanup, config

### Commit Messages

Follow the format in `.windsurf/workflows/changelog.md`. Prefix with:

- `feat:` — new feature
- `fix:` — bug fix
- `chore:` — cleanup, config, docs
- `refactor:` — code restructuring
- `style:` — visual/CSS changes
- `docs:` — documentation only
- `test:` — tests only

### Before Submitting

1. `pnpm build` passes
2. `pnpm lint` passes (or only has pre-existing warnings)
3. No full names or identifying info in any public-facing content
4. Changelog updated per `.windsurf/workflows/changelog.md`
5. Tested on mobile viewport (most users are on phones)

---

## For AI Agents

### Required Context

Every AI agent working on this project **must** have access to:

1. `AA_TRADITIONS_GUARDRAILS.md` — loaded in system context
2. `NECYPREAMBLE.md` — for planning decisions and architecture
3. This file — for contribution rules

### What AI Agents Must NOT Do

- Generate full names of AA members
- Use superlative language ("best convention ever", "amazing", "incredible")
- Endorse or imply affiliation with outside organizations
- Machine-translate AA terminology into Spanish
- Make unilateral content decisions without human review
- Delete or weaken existing tests
- Bypass the traditions guardrails for any reason

### What AI Agents Should Do

- Follow existing code patterns and naming conventions
- Use design tokens from `app/globals.css` (never hardcode colors)
- Use shared types from `lib/types.ts`
- Use shared constants from `lib/constants.ts`
- Validate all form inputs with Zod schemas from `lib/validation.ts`
- Rate-limit server actions using `lib/rate-limit.ts`
- Write informational, non-promotional copy
- Flag potential tradition violations and ask for human review
- Update the changelog when making significant changes

### Escalation

If an AI agent encounters any of the following, it must **stop and ask a human**:

- Content that might identify an AA member
- Copy that could be interpreted as promotional
- Anything that implies affiliation with an outside entity
- Uncertainty about whether content complies with AA Traditions
- Changes to payment/financial logic
- Changes to security infrastructure

---

## Project Structure

```
app/                    # Next.js App Router pages
  actions/              # Server actions (Stripe, registration)
  [route]/page.tsx      # Individual pages (19 routes)
  globals.css           # Tailwind + custom design tokens + a11y CSS
  layout.tsx            # Root layout (A11yProvider, header, a11y panel)
components/             # React components
  sections/             # Homepage section components
  ui/                   # shadcn/ui primitives
  accessibility-panel.tsx   # 6-mode a11y settings panel
  anonymous-feedback-form.tsx # Anonymous feedback (no name/email required)
  content-warning.tsx   # Click-to-expand content warning wrapper
  language-switcher.tsx # i18n language switcher (visual placeholder)
  page-shell.tsx        # Consistent placeholder page scaffolding
  site-header.tsx       # Site header/nav
  site-footer.tsx       # Footer (a11y statement, AA trademark, report link)
lib/                    # Shared utilities
  __tests__/            # Vitest unit tests (30 passing)
  data/                 # Static data (events, meetings, states, FAQ)
  accessibility-context.tsx # A11y settings context + provider
  validation.ts         # Zod schemas for input validation
  rate-limit.ts         # Rate limiting for server actions
  constants.ts          # Shared URLs and constants
  types.ts              # Shared TypeScript interfaces
  registration-products.ts # Registration + breakfast product definitions
messages/               # i18n message files
  en.json               # English UI strings
  es.json               # Spanish UI strings
public/                 # Static assets (images, flags)
```

---

## Questions?

Email [info@necypaa.org](mailto:info@necypaa.org) or raise an issue.

---

_Alcoholics Anonymous®, A.A.®, and The Big Book® are registered trademarks of Alcoholics Anonymous World Services, Inc._
