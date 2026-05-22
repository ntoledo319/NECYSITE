# NECYPAA XXXVI Website

## Taste Standards

This project operates under active taste enforcement. Every code change,
UI element, copy block, and architectural decision must pass taste review.

### The Taste Hierarchy

- GENERIC: Could appear on any similar project unchanged. UNACCEPTABLE.
- SAFE-GOOD: Competent but predictable. UNACCEPTABLE.
- CONTEXTUAL: Specific to this project. MINIMUM VIABLE TASTE.
- DISTINCTIVE: Could only exist in this project. THE TARGET.

### Hard Rules

1. No statistical-average output. If it looks like a default template, rewrite.
2. Every UI component must answer: "Why does THIS project need THIS to
   look/work THIS way?"
3. Copy must have a point of view. Swap test: replace product name with
   competitor's. If it still works, the copy is dead.
4. No decoration-driven design. Every visual choice serves meaning.
5. Elimination before addition. Try removing elements first.

### Project Identity

- This project believes: Recovery is not sterile. A convention website for
  young people in AA should feel like the energy of the rooms — alive,
  welcoming, a little chaotic in the best way.
- This project is for: Young people (18-35) in recovery or recovery-curious
  across 13 New England states. Skeptical of institutions, fluent in internet
  culture, used to beautiful digital experiences.
- This project should feel like: A Patagonia catalog (earnest, text-dense),
  a Criterion Collection page (curated, intelligent), a good coffee shop
  lobby in a recovery neighborhood (warm, real, zero corporate).
- This project should NEVER feel like: A hospital website, a tech startup
  landing page, an Eventbrite default template, a treatment center funnel.
- Must-word: ALIVE
- Never-word: CLINICAL

### Taste Verification

Before any task is complete, run the Specificity Test:
"Could this element exist in any other project without modification?"
If yes → rewrite.

---

## Handoff Sync Protocol (non-negotiable)

This project has a hard bus-factor problem. The owner may not be the one
maintaining it in the future. The folder `HANDOFF/` exists so that a
non-technical inheritor — paired with a coding agent — can keep the site
running. If `HANDOFF/` ever drifts from the real codebase, the inheritor
will trust the wrong information in a real emergency.

**Read `HANDOFF/AI_BRIEFING.md` at the start of any session where you will
edit code.** It contains the operating posture (plan-first, PR-not-push,
build-before-done, escalate-on-danger-zones) that overrides anything else.

**Run `/handoff-sync` whenever a change touches any of these surfaces:**

- `lib/constants.ts` (dates, venue, contact email, URLs)
- `lib/registration-products.ts`, `lib/pricing.ts` (default prices)
- `lib/env.ts`, `.env.example` (environment variables)
- `actions/registration.ts`, `actions/breakfast.ts`, `actions/claim-gift.ts`
- `app/api/webhooks/stripe/**`
- `collections/Registrations.ts`, `collections/Donations.ts`,
  `collections/GroupRegistrations.ts`, `collections/GiftCodes.ts`
- The admin panel structure (Payload globals, new collections)
- Any file path referenced by `HANDOFF/MANUAL.md` Appendix A
- Anything that would change one of the four "scenarios" in
  `HANDOFF/QUICKSTART.md`

The `/handoff-sync` command (defined at `.claude/commands/handoff-sync.md`)
audits the HANDOFF docs against the current code and proposes updates.
Run it **before opening any PR that touches the above** and include the
resulting HANDOFF edits in the same PR.

**Never commit secrets.** `.env`, `.env.local`, anything with a key in it.
The `.gitignore` already excludes them — keep it that way.

**Never push directly to `main`.** Always open a pull request. The operator
is the only one who can approve a merge.

If you are unsure whether a change qualifies for `/handoff-sync`, run it
anyway — the command is cheap and idempotent. Drift is expensive.
