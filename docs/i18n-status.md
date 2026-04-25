# i18n Status — NECYPAA XXXVI

> **Last updated:** 2026-04-25

## Reality

The site is **not fully bilingual**.

- The routing infrastructure for EN/ES exists (`next-intl`, middleware, `messages/en.json`, `messages/es.json`).
- The navigation header supports locale switching.
- **However, nearly all page content is hardcoded English.** Only a handful of UI chrome strings come from the translation files.

## What is translated

- Navigation labels (site header, footer links)
- Some button text and form labels
- A few accessibility strings

## What is NOT translated

- All blog posts (English only)
- All event descriptions (English only)
- All FAQ content (English only)
- All static page copy (program, ASL, merch, bid, prayer, service, journey, accessibility, etc.)
- All registration flow copy
- All checkout UI copy
- All email/contact copy

## Spanish content that exists

- The `BlogPosts`, `FAQ`, and `Events` Payload CMS collections have `spanishTitle`, `spanishBody`, `spanishQuestion`, `spanishAnswer`, `spanishExcerpt` fields.
- **None of these fields are populated yet.** They were added to the schema in anticipation of future translation.

## What to do before claiming full bilingual support

1. Translate core public pages (register, FAQ, events, accessibility).
2. Wire CMS Spanish fields into the frontend (likely via a locale-aware fetch utility).
3. Translate `messages/es.json` to full coverage.
4. Add a language switcher to the footer or mobile menu if it isn't already obvious.
5. Test every page in both locales.

## Current stance

The site is **English-first with Spanish infrastructure ready**. Do not present it as fully bilingual to users until the above is completed.
