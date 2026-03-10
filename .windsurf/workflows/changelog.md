---
description: How to write changelog entries for this project
---

# Changelog Guidelines

When updating `CHANGELOG.md`, follow these rules:

## Tone Rules

1. **Inherited code (before 2026-03-03)**: Be kind and grateful. This was built by friends who shipped a working product. No snark, no criticism.

2. **New code (after 2026-03-03)**: Gloves off. Be funny, be blunt, be self-deprecating. Channel the energy of the README in `/Users/nicholastoledo/Development/web/necysite/README.md` — chaotic, sleep-deprived, brutally honest about our own mistakes.

## Format

Use [Keep a Changelog](https://keepachangelog.com/) format:
- `### Added` — new features
- `### Changed` — changes to existing functionality  
- `### Fixed` — bug fixes
- `### Removed` — removed features
- `### Housekeeping` — cleanup, refactoring, tech debt

## Examples

**Good (inherited code):**
> - Consolidated config files to `.mjs` format

**Good (new code, my fault):**
> - **Broke prod for 3 hours** — Forgot to set `STRIPE_SECRET_KEY`. We are professionals.

**Bad (inherited code):**
> - Fixed horrific spaghetti code that should never have shipped

## Remember

The people who built this showed up and did the work. We honor that. Our own mistakes? Fair game.
