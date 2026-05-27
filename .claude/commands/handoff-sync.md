Audit and update the operator-facing handoff documentation in `HANDOFF/` so it accurately reflects the current state of the codebase. This command runs before commits to `main`, before merging PRs that touch documented surfaces, and whenever the operator explicitly asks ("run handoff-sync").

The audience for `HANDOFF/` is a non-technical operator paired with an AI assistant. Their tolerance for stale docs is zero — a wrong file path or an outdated price in this folder is more harmful than missing documentation, because the operator will trust it.

## Run these checks, in order

1. **Read the four HANDOFF files** (`README.md`, `QUICKSTART.md`, `MANUAL.md`, `ACCOUNTS.md`, `AI_BRIEFING.md`) and form a mental model of what they currently claim about the codebase.

2. **Verify every concrete claim** the docs make:
   - File paths in `MANUAL.md` Appendix A — `git ls-files` to confirm each path exists.
   - Convention dates and venue mentioned in QUICKSTART / MANUAL — grep `lib/constants.ts` and compare.
   - Price expectations (e.g. "$250 = 25000 cents") — sanity-check against `lib/registration-products.ts` if defaults changed.
   - Environment variable list in `ACCOUNTS.md` — diff against `lib/env.ts` and `.env.example`.
   - Admin panel collection names — diff against the actual files in `collections/`.
   - URLs (admin URL, repo URL, hotel URL) — make sure they match `lib/constants.ts` and the README.

3. **Look for new surfaces the docs don't yet cover.** Run `git log --since="14 days ago" --name-only` (adjust window as needed). If any files were added/renamed in `actions/`, `app/`, `lib/`, `collections/`, ask: is there a new operator-facing capability here that needs a MANUAL section? If yes, propose one.

4. **Look for removed surfaces the docs still describe.** If MANUAL references a file or feature that no longer exists, remove or rewrite the section.

5. **Check the AA Traditions guardrails** — `AA_TRADITIONS_GUARDRAILS.md` is the source of truth. The "Four Laws" in `MANUAL.md` Part I and the anonymity rules in `AI_BRIEFING.md` should not contradict it.

## Report format

Output a short report **before** making any changes:

```
HANDOFF SYNC REPORT
===================

CONFIRMED IN SYNC:
  - [list of facts you verified]

OUT OF DATE — proposed fixes:
  - HANDOFF/<file> line <n>: claims X. Codebase says Y. Will change to Y.
  - ...

NEW SURFACES — proposed additions:
  - <feature/file>: not currently documented. Propose new section in MANUAL.md under <part>.
  - ...

REMOVED SURFACES — proposed deletions:
  - HANDOFF/<file> section <name>: refers to <removed thing>. Will remove.

NOTHING NEEDS HUMAN REVIEW: yes / no
  (yes = safe to apply all changes silently; no = stop, surface to operator)
```

If `NOTHING NEEDS HUMAN REVIEW` is `no`, stop and let the operator decide.
If it's `yes`, apply the changes, then re-run a quick verification pass.

## What this command must NEVER do

- Edit `HANDOFF/ACCOUNTS.md`'s `[FILL ME IN]` placeholders. Those are intentional — only a human knows the answers.
- Add prose that contradicts the file's voice (second person, calm, plain English, define-jargon-inline).
- Remove the "you can always undo this" sections — those are safety equipment, not optional.
- Bloat the docs. Prefer removing stale lines over adding new ones. The QUICKSTART must stay one page.
- Commit changes by itself. This command edits files; the commit is the operator's call.

Context: $ARGUMENTS
