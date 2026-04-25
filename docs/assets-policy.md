# Assets Policy — NECYPAA XXXVI

> **Last updated:** 2026-04-25

## Where source art lives

- **Original illustrations / source files:** Keep outside the repo or in a dedicated `assets/source/` directory that is **not** deployed.
- **Current source art location:** `Necypic/` (at repo root) contains original photos and illustrations. These should not be copied into `public/`.

## Where optimized public assets live

- `public/images/` — Optimized images for the site.
- `public/media/` — Payload CMS uploads (user-generated content).
- `public/fonts/` — Self-hosted font files.

## Format rules

| Use case | Preferred format | Max width | Notes |
|----------|-----------------|-----------|-------|
| Photographs | WebP or AVIF | 1600 px | Use `next/image` with explicit `width`/`height`/`sizes` |
| Illustrations with transparency | WebP (with alpha) or PNG | 1200 px | Prefer WebP; PNG only if source lacks WebP export |
| Icons / UI graphics | SVG | — | Inline small icons; external file for complex illustrations |
| Character art / hero images | WebP | 1600 px | These are the largest images; optimize aggressively |

## Naming conventions

- Use kebab-case: `mad-hatter-character.webp`
- Include context in filename: `event-{name}-flyer.webp`
- Avoid spaces and special characters.
- Do not commit `.original`, `.backup`, or `.psd` files to `public/`.

## How to add images without bloating the repo

1. Optimize the image locally (Squoosh, ImageMagick, or similar).
2. Target ≤ 200 KB per image for photos, ≤ 100 KB for illustrations.
3. Place in `public/images/`.
4. Use `next/image` with `sizes` prop for responsive images.
5. Run `pnpm build` and check the bundle analyzer if available.

## Current state (2026-04-25)

- `public/images/` is **91 MB** with 82 files.
- Only 35 of 82 files are WebP/AVIF.
- **Action needed:** Convert remaining PNG/JPEG assets to WebP/AVIF and audit for unused images.
