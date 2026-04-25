# NECYPAA XXXVI — Full Taste Audit & Aesthetic Overhaul Plan

> Generated: April 5, 2026
> Auditor: Cascade (Taste Engineering System)
> Commissioned by: Nikki

---

## Part 1: The Diagnosis

### Overall Taste Score: 34/100 (GENERIC → SAFE-GOOD boundary)

**The core problem in one sentence:**
The committee's art is stunning — warm, handcrafted, ornate, alive — but the website wraps it in a cold dark-mode SaaS startup shell that contradicts everything the art is saying.

The art says _"come sit by the fire in this magical workshop."_
The website says _"welcome to our developer tool dashboard."_

---

## Part 2: The Art — What Your Artists Actually Made

I studied every piece of committee art in detail. Here's what your artists were telling you:

### The Calligraphic Logo ("Escaping the Mad Realm")

- Hand-lettered script flowing teal → magenta → amber/gold
- Sits on a **warm grey stone texture** — not a dark void
- Ornate flourishes, swashes, serifs — this is calligraphy, not code
- The letterforms have _weight_ and _warmth_ — they feel carved, not typed

### The Full Poster

- A cosmic vortex, but grounded by **brass mechanical elements**
- Recovery symbols (AA triangle, medallions) woven into steampunk machinery
- Color story: deep navy-teal + aged brass + muted sage + plum purple + ethereal green glow
- AA slogans etched into brass plaques: "Keep It Simple," "This Too Shall Pass," "Sanity," "Fellowship"
- The vortex glow is ethereal green-purple — mystical, not neon

### The Border Frames (Ocean & Steampunk)

- **CREAM/PARCHMENT backgrounds** — this is the art's native canvas
- Incredibly detailed brass clockwork, gears, keys, compasses, potions
- Warm weathered metal, aged wood, teal patina (oxidized copper)
- The ocean variant: nautilus shells, coral, diving helmet, anglerfish — all in warm antiqued tones
- These are _frame_ designs — they're meant to hold content inside them

### The Texture Sheet

- Stained glass arch: warm grey stone, soft blue glass, AA triangle
- Gear collage: brass/copper gears, swirling teal-purple vortex, recovery chips
- Maze labyrinth: warm sandstone, olive, muted teal — like an old treasure map
- Recovery artifacts: leather Big Book, bronze skeleton keys, aged sobriety coins
- Phoenix damask: deep navy with teal-copper phoenix figures — a repeatable textile pattern

### The Characters

- **Mad Hatter**: Purple coat, orange vest, teal hat brim, brown boots — WARM palette
- **Cheshire Cat**: Rose-magenta stripes, teal-green vest — playful, warm pink not neon pink
- **Caterpillar**: Olive green, brown leather suit, fedora — EARTH TONES, sophisticated

### What the art screams:

**Warm. Handcrafted. Ornate. Aged. Textured. Lived-in. Victorian workshop. Not a tech dashboard.**

---

## Part 3: Anti-Pattern Violations (Current Site)

### Critical Violations (from anti-patterns.md)

| #   | Anti-Pattern                                         | Where It Appears                                                                                                                              | Severity    |
| --- | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| 1   | **"Dark mode with neon accents" startup aesthetic**  | The ENTIRE site. `--nec-navy: #0f0a1e` (cold purple-black) + neon purple/pink/cyan glows everywhere                                           | 🔴 FATAL    |
| 2   | **Glassmorphism / frosted glass used decoratively**  | Header, dropdowns, mobile drawer, hero price badge, multiple sections (`backdrop-blur` 7+ instances)                                          | 🔴 CRITICAL |
| 3   | **Excessive blur, glow, or shadow for "depth"**      | `shadow-glow-purple`, `shadow-glow-pink`, `glow-cyan`, `glow-pink`, `glow-gold` text-shadow classes, `AuroraBackground`, drop-shadows on logo | 🔴 CRITICAL |
| 4   | **Gradient mesh backgrounds**                        | `AuroraBackground` component, `AmbientBlobs` component, body `radial-gradient` background                                                     | 🟡 HIGH     |
| 5   | **Purple-to-blue/pink gradient**                     | `btn-primary`: `linear-gradient(135deg, var(--nec-purple), var(--nec-pink))` — the single most AI-generated gradient in existence             | 🔴 CRITICAL |
| 6   | **Rounded-xl everything**                            | `rounded-2xl` on every card, `rounded-xl` on everything else, uniform radius everywhere                                                       | 🟡 HIGH     |
| 7   | **Hero → Features → CTA → Footer (SaaS skeleton)**   | Homepage: Hero → QuickFacts → CTA → Narrative → Meeting → Events → Footer                                                                     | 🟡 HIGH     |
| 8   | **Inter/system sans with zero typographic identity** | Plus Jakarta Sans (body) + Outfit (headings) + Bangers (display) — competent but generic; zero connection to the ornate calligraphic art      | 🟡 HIGH     |

### Specificity Test Results

| Check                       | Result                                                  |
| --------------------------- | ------------------------------------------------------- |
| Generic copy in site code   | ✅ Clean — no SaaS copy patterns in actual page content |
| Generic component names     | ⚠️ `HeroSection`, `CTASection`, `QuickFactsStrip`       |
| Tailwind default aesthetic  | 🔴 `backdrop-blur` in 7+ components flagged             |
| Framework default structure | ⚠️ `components/ui/` — framework default directory       |
| Generic file names          | ✅ Clean                                                |

### The Color Problem — In Detail

**Current palette (what the site uses):**

```
--nec-navy:     #0f0a1e  ← Cold dead purple-black
--nec-dark:     #150e28  ← More cold purple
--nec-card:     #1a1030  ← Purple card bg
--nec-purple:   #7c3aed  ← Electric violet (neon)
--nec-pink:     #c026d3  ← Hot magenta (neon)
--nec-cyan:     #14b8a6  ← Electric teal (neon)
--nec-gold:     #d4a017  ← The ONE color that's close
```

**What the art actually uses:**

```
Background:    #F5F0E8 → #E8E0D5  (warm parchment/cream)
Deep accent:   #0D1B2A → #1A2332  (rich dark navy, NOT purple)
Brass/Gold:    #B8860B → #C69214  (aged, not electric)
Teal patina:   #2A7A6E → #3D8B80  (weathered copper, not neon)
Warm plum:     #6B3A6B → #7D4E7D  (the Hatter's coat, not electric violet)
Rose:          #B8405E → #A0384F  (earthbound, not neon magenta)
Sage:          #6B8F71 → #7EA085  (from the labyrinth and caterpillar)
Copper:        #B87333 → #A0623A  (from gears and clockwork)
```

The entire color system needs to be re-derived FROM THE ART, not from a Tailwind gradient generator.

### The Typography Problem

**Current:**

- `Plus Jakarta Sans` (body) — clean geometric sans. Fine but has zero warmth.
- `Outfit` (headings) — another geometric sans. Could be any tech company.
- `Bangers` (display) — comic book energy. Wrong genre entirely.

**The art demands:**

- The calligraphic logo is ornate, flowing, with serifs and flourishes
- The poster text uses engraved/etched styling
- The border plaques use vintage serif typography
- The "Big Book" on the texture sheet is classic leather-bound serif

None of the current fonts have ANY relationship to the art's typographic language.

---

## Part 4: Page-by-Page Audit

### Homepage — Score: 32/100

- **What works**: The composition is thoughtful. Content density is good. The character dividers are a nice idea. The section flow tells a story.
- **What fails**: AuroraBackground + AmbientBlobs + floating graffiti accents + magnetic buttons + spring physics = _developer playground_, not warm convention website. The hero has a purple glow crater behind the logo. The CTA section is a classic SaaS two-card layout. SVG stick figures for "Dancing Figures" when gorgeous illustrated characters exist.
- **Swap test**: Replace "NECYPAA" with "DevConf 2026" — the layout and aesthetic still works. **FAIL.**

### Blog Page — Score: 38/100

- **What works**: The intro copy has personality ("Take what works, vibe with the rest"). Content-first approach.
- **What fails**: `section-badge` pill, purple-pink gradient divider, `MotionHeader` stagger animation — all SaaS patterns. The page structure is generic blog-grid.
- **Swap test**: This could be any dark-mode blog.

### Journey Page — Score: 35/100

- **What works**: Content is meaningful. Timeline approach is appropriate.
- **What fails**: Every event card is identical `nec-card` with identical layout. The "Archive" badge is a SaaS pill. Characters at 7-9% opacity are invisible ghosts — why not use them prominently?
- **Swap test**: This is a generic event archive.

### Prayer Page — Score: 45/100

- **What works**: The Snake game is a genuinely creative touch — an actual DISTINCTIVE element.
- **What fails**: It's a shell waiting for content. The `InventoryShell` wrapper is generic.

### Al-Anon Page — Score: 50/100 (highest)

- **What works**: The intentional transition from Mad Realm to Al-Anon brand is thoughtful. The edge-bleed design intent is distinctive.
- **What fails**: Still wrapped in the SaaS dark-mode shell.

### States Page — Score: 30/100

- **What fails**: Interactive map + state cards are competent but could be any organization's directory page.

### Register, Breakfast, Merch, FAQ, etc. — Score: ~30/100

- Functional but aesthetically generic across the board. Every page is `nec-card` on `nec-navy` with `section-badge` pills and purple glow accents.

---

## Part 5: The Overhaul Plan — "Born from the Art"

### Design Philosophy

> **The website should look like the art team made it, not like a developer made it.**
> Every visual decision should be traceable back to a specific piece of committee art.

### Phase 1: Color System — "Extract, Don't Invent"

**Kill the neon. Derive everything from the poster, borders, and characters.**

#### New Dark Mode (Primary)

```
--realm-void:       #0D1B2A   (rich dark navy from poster depths)
--realm-deep:       #152233   (deep background, warm navy)
--realm-surface:    #1D2D3E   (card surfaces)
--realm-brass:      #C69214   (aged brass — from gears, plaques)
--realm-patina:     #3D8B80   (oxidized copper teal — from borders)
--realm-plum:       #7D4E7D   (the Hatter's coat — warm purple)
--realm-rose:       #B8405E   (earthbound magenta — from Cheshire)
--realm-sage:       #7EA085   (from the labyrinth and Caterpillar)
--realm-copper:     #B87333   (mechanical warmth)
--realm-parchment:  #E8DFD0   (text on dark — warm cream, not white)
--realm-muted:      #9AABBF   (secondary text — warm blue-grey)
--realm-border:     #2A3D52   (borders — warm navy)
```

#### New Light Mode

```
--realm-void:       #F5F0E8   (parchment — the art's natural canvas)
--realm-deep:       #EDE5D8   (slightly darker parchment)
--realm-surface:    #FFFFFF   (cards — clean white on parchment)
--realm-text:       #1A2332   (deep navy for text)
```

**Key shift**: Dark mode goes from cold purple-black to rich warm navy. Light mode goes from clinical white-purple to warm cream/parchment.

### Phase 2: Typography — "Match the Calligraphy"

**New font stack:**

| Role              | Current            | Proposed                                                  | Why                                                                     |
| ----------------- | ------------------ | --------------------------------------------------------- | ----------------------------------------------------------------------- |
| Display/Headlines | Bangers (comic)    | **Playfair Display** or **Cormorant Garamond**            | Ornate serif with the flourishes and elegance of the calligraphic logo  |
| Subheadings       | Outfit (geometric) | **Libre Baskerville** or **Lora**                         | Warm editorial serif — Criterion Collection energy                      |
| Body              | Plus Jakarta Sans  | **Source Serif 4** (body) + **Inter** or **DM Sans** (UI) | Warm readable serif for content-heavy pages; clean sans for UI elements |
| Accent/Display    | —                  | **Cinzel Decorative** or **Spectral SC**                  | For small-caps badges, labels — steampunk plaque energy                 |

The site should feel like reading a beautifully typeset book — warm serifs for content, ornate display type for headers, clean sans only for functional UI.

### Phase 3: Texture & Material — "The Handmade Layer"

The art is FULL of textures. The website is flat. Fix:

1. **Parchment body texture** — Subtle paper grain as a repeating background tile (or CSS noise pattern). The art's native canvas is aged paper, not a void.

2. **Brass border accents** — Use the actual ornate border art (ocean variant and steampunk variant) as section frames and page dividers. Not SVG stick-figure gears — the REAL art.

3. **Texture overlays** — Subtle grain overlay (you already have `GrainOverlayWrapper` — lean into it more, make it warmer).

4. **Card surfaces** — Instead of `linear-gradient(135deg, rgba(26,16,48,0.9)...)`, use warm surfaces that feel like aged paper or leather. Think: slightly off-white with a warm border, not glass-on-void.

5. **The art AS backgrounds** — The phoenix damask pattern from the texture sheet should be a subtle repeating background. The maze labyrinth should be a section background. The stained glass arch should frame key content.

### Phase 4: Layout — "Editorial, Not Dashboard"

**Kill the SaaS skeleton. Build for editorial depth.**

1. **Homepage**: Instead of Hero → Features → CTA → sections, go full editorial:
   - A dramatic full-bleed opening with the poster art + calligraphic logo
   - Asymmetric content blocks with art woven through
   - The ornate border frames HOLDING content (like the borders were designed for)
   - Characters as actual section companions, not 7% opacity ghosts
   - Pull-quotes, large typography moments, intentional breathing room
   - Think: opening a beautifully illustrated book, not loading a product page

2. **Interior pages**: Each page gets its own personality (you already intended this — lean harder):
   - Blog: Magazine editorial layout with featured art headers
   - Journey: A true illustrated timeline, not identical cards stacked
   - States: The map is good — but wrap it in the aesthetic (border frame, warm palette)
   - Prayer: Already creative with the game — give it more visual identity
   - Register: This is the MONEY page — it should feel like receiving an ornate invitation

3. **Asymmetry over symmetry**: The art isn't symmetric. The borders are ornate and irregular. Embrace that. Not every section needs to be centered-text-with-card-below.

### Phase 5: Component Overhaul

| Current Component                    | Problem                                | New Direction                                                            |
| ------------------------------------ | -------------------------------------- | ------------------------------------------------------------------------ |
| `btn-primary` (purple→pink gradient) | The most AI-generated button on earth  | Solid aged brass/gold with embossed feel, or warm plum with no gradient  |
| `btn-secondary` (gold gradient)      | Better, but still gradient-happy       | Outlined brass with warm hover state                                     |
| `nec-card` (glass on void)           | Glassmorphism on purple-black          | Warm parchment surface, subtle brass-tinted border, NO blur              |
| `section-badge` (uppercase pill)     | Pure SaaS                              | Small-caps serif with an ornate underline or bracket, not a pill         |
| `AuroraBackground`                   | Tech startup living gradient           | Remove. Replace with art-based backgrounds (the poster glow, or nothing) |
| `AmbientBlobs`                       | Gradient mesh orbs                     | Remove entirely                                                          |
| `GearCluster`, `MazePattern` (SVG)   | Code-generated SVG approximations      | Use the actual art assets. You HAVE gorgeous gear art — use it           |
| `Sparkle`, `Splatter`, `Hex` (SVG)   | Decorative SVG confetti                | Replace with elements traced from the actual art                         |
| `OrnateDivider` (SVG)                | Better than most, but still code-drawn | Consider using cropped elements from the actual border art               |
| `CharacterDivider`                   | Characters at 7-12% opacity            | Characters at 30-60% opacity. They're GREAT. Show them off.              |

### Phase 6: Motion & Interaction — "Earned, Not Performed"

**Current problem**: Spring physics, magnetic buttons, aurora backgrounds, stagger animations — it's motion for motion's sake. A developer flex, not a design decision.

**New rules**:

- Motion only on meaningful state changes (open/close, enter/exit)
- No spring-physics-driven entrance animations on every section
- No magnetic pull on buttons — it's a novelty, not a UX improvement
- Reduce motion budget by 70%
- When you DO animate: slow, deliberate, warm easing (like a page turning, not a UI bouncing)
- The `reduce-motion` respect is already great — keep all of that

### Phase 7: Kill List — Elements to Remove

1. ~~`AuroraBackground`~~ — tech startup energy
2. ~~`AmbientBlobs`~~ — gradient mesh orbs floating behind content
3. ~~`MagneticButton`~~ — novelty interaction
4. ~~`backdrop-blur` on cards and sections~~ — glassmorphism
5. ~~All `glow-*` text-shadow classes~~ — neon energy
6. ~~`shadow-glow-*` box-shadow tokens~~ — neon energy
7. ~~`gradient-shimmer` on headings~~ — SaaS animated gradient text
8. ~~`hero-glow-breathe`~~ — pulsing neon behind the logo
9. ~~Purple-pink button gradients~~ — replaced with solid brass/plum
10. ~~The inline SVG stick figures~~ — replaced with actual art

### Phase 8: What to ADD

1. **Paper/parchment texture** as the base layer
2. **Art-based section borders** from the actual border frames
3. **The phoenix damask** as a subtle repeating background for special sections
4. **Large character art** — show the Hatter, Cat, and Caterpillar at 40-80% opacity as section companions
5. **Serif typography** that matches the calligraphic logo's warmth
6. **Warm metallics** in the UI — brass/copper-toned borders, gold accent lines
7. **Editorial white (cream) space** — less cramming, more breathing
8. **Content framing** — the ornate borders were literally designed to frame content

---

## Part 6: Execution Priority

### Wave 1 — Foundation (biggest visual impact)

1. **Color tokens** — Replace entire CSS custom property palette
2. **Typography** — Swap font stack
3. **Body treatment** — Parchment background, warm grain
4. **Kill AuroraBackground & AmbientBlobs** — immediate SaaS exorcism

### Wave 2 — Component Surgery

5. **Buttons** — New solid brass/plum buttons
6. **Cards** — Warm parchment surfaces, brass borders
7. **Section badges** — Serif small-caps with ornate styling
8. **Header & Footer** — Warm navy, brass accents, character art

### Wave 3 — Art Integration

9. **Hero** — Full poster art integration, not glow crater
10. **Page borders** — Use actual ornate border art
11. **Character presence** — Characters visible and prominent
12. **Section backgrounds** — Phoenix damask, maze, textures from art

### Wave 4 — Layout & Motion

13. **Homepage editorial layout** — Break the SaaS skeleton
14. **Interior page personalities** — Each page gets its own flavor
15. **Motion reduction** — Kill novelty, keep meaningful
16. **Asymmetric compositions** — Magazine, not dashboard

---

## Part 7: Taste Brief Update

### After the overhaul, the site should feel like:

- **Opening a beautifully illustrated storybook** set in a steampunk wonderland
- **Walking into a warm, ornate workshop** where recovery artifacts line the shelves
- **A Patagonia catalog** — earnest, text-dense, every word and image earned
- **A Criterion Collection page** — curated, serif-heavy, editorial confidence
- **A really good tattoo shop's website** — handcrafted feel, real art, personality in every corner

### After the overhaul, someone should be able to say:

_"This website could ONLY be NECYPAA XXXVI. I can tell the art team made real art and the developers honored it."_

### The Specificity Test should pass:

_"Could this element exist in any other project without modification?"_
**Answer: No. Every color is from the poster. Every border is from the art. Every character is from the illustrator. The typography echoes the calligraphic logo. This could only be Escaping the Mad Realm.**

---

## Appendix: Reference Mood Board

**Sites to study for feel (not to copy):**

- **Patagonia.com** — Earned imagery, text-dense editorial, warm earth tones, zero corporate
- **Criterion.com** — Serif-heavy, curated, intelligent audience assumption
- **A24films.com** — Dark but warm, editorial, art-first
- **Aesop.com** — Warm materials, intentional typography, handcrafted feel in digital
- **Pantone Color of 2026: Cloud Dancer** — The industry is moving toward warm, soft, breathable palettes

**The art assets you already have are BETTER than most sites' entire visual library. Honor them.**
