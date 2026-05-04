# NECYPAA XXXVI — Agent Rules

Every AI agent working on this project must follow these governing documents.

## Required Reading (In Order of Priority)

1. **`AA_TRADITIONS_GUARDRAILS.md`** — Traditions compliance. Non-negotiable. Read this first.
2. **`ACCESSIBILITY_GUIDELINES.md`** — Inclusion & accessibility rules from the Accessibilities Chair. Non-negotiable.
3. **`CONTRIBUTING.md`** — Human and AI contributor rules, escalation protocol.
4. **`NECYPREAMBLE.md`** — Project vision, architecture, planning, and what we can/cannot do now.
5. **`.windsurf/workflows/changelog.md`** — Changelog tone and format rules.

## Quick Rules

- **No full names** of AA members on any public page.
- **No faces** of AA members identified as such.
- **No superlatives** ("best", "greatest", "amazing") in any public content or metadata.
- **No endorsement** of outside entities. We link, we do not affiliate.
- **Attraction, not promotion.** Informational tone only.
- **Human review required** before content goes to production.
- **When in doubt, stop and ask.**

## Code Conventions

- Use TypeScript strict mode.
- Use design tokens from `app/globals.css` — never hardcode colors.
- Use shared types from `lib/types.ts` and constants from `lib/constants.ts`.
- Validate all server action inputs with Zod schemas (`lib/validation.ts`).
- Rate-limit all server actions (`lib/rate-limit.ts`).
- Follow existing component patterns (see `components/page-shell.tsx` for page scaffolding).
- Keep shared JS bundle under 100kB.
- Mobile-first design — test at 375px width minimum.

## Escalation Triggers

Stop and ask a human if you encounter:

- Content that might identify an AA member
- Promotional or superlative language
- Implied affiliation with outside entities
- Changes to payment/financial logic
- Changes to security infrastructure
- Uncertainty about Traditions compliance
