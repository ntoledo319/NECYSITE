# NECYPAA XXXVI — Accessibility Features & Guidelines Implementation

**Prepared by:** Nikki T., Web Chair
**Date:** March 16, 2026 (finalized)
**Site:** [necypaact.com](https://www.necypaact.com)
**Source:** All implementations are guided by `ACCESSIBILITY_GUIDELINES.md` — the comprehensive questionnaire submitted by the NECYPAA XXXVI Accessibilities Chair on March 13, 2026.

---

## Overview

The NECYPAA XXXVI website is built with accessibility as a core requirement, not an afterthought. We target **WCAG 2.1 Level AAA** compliance wherever achievable, with **Level AA as our absolute minimum floor**. Connecticut state accessibility requirements, ADA Title III standards, and Section 508 are also met.

This document maps every section of the Accessibilities Chair's questionnaire to what has been implemented, what is planned, and what is flagged for follow-up with the Chair before launch.

**Legend:** ✅ Implemented · 🔜 Planned / In Progress · 🔖 Flagged for Chair Follow-Up

---

## 1. Visual & Sensory Accessibility

_Maps to Chair's Guidelines: Section 1_

### User Customization Panel (All 6 Modes — Chair Requirement Met)

Every visitor can personalize their experience via a floating **Accessibility Settings panel** (gear icon, bottom-right of every page). All preferences are saved locally on the user's device. No account is needed.

| Setting                    | What It Does                                                                                                                                                                            | Status |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| **Dark / Light Mode**      | Switches between the default dark theme and a fully-designed light theme. Automatically detects the user's OS `prefers-color-scheme` preference on first visit.                         | ✅     |
| **High Contrast**          | Boosts all contrast ratios — brighter accent colors on dark backgrounds, darker accents on light backgrounds. Thicker borders (2px), underlined links, stronger focus indicators (3px). | ✅     |
| **Text Size**              | Adjustable from 100% to 200% in 25% increments (Default → Large → Extra Large → XX-Large → Maximum). Meets WCAG 1.4.4 (200% zoom).                                                      | ✅     |
| **Dyslexia-Friendly Font** | Switches all text to OpenDyslexic, a typeface designed for readers with dyslexia.                                                                                                       | ✅     |
| **Reduce Motion**          | Disables all animations, transitions, and scroll effects site-wide. Also automatically respects the user's OS-level `prefers-reduced-motion` preference on first visit.                 | ✅     |
| **Grayscale**              | Removes all color from the page for users who are sensitive to color or prefer a monochrome experience.                                                                                 | ✅     |

All six modes can be combined (e.g., light mode + high contrast + dyslexia font). Combined modes have dedicated CSS rules (e.g., light + high contrast uses darker borders and bolder accents).

When any setting is changed, an `aria-live="polite"` announcer tells screen readers what changed (e.g., "High contrast enabled", "Text size changed to 150%").

### Text Readability

- ✅ Text contrast targets WCAG AAA (7:1 for normal text, 4.5:1 for large text); AA (4.5:1 / 3:1) as absolute minimum.
- ✅ All text uses readable web fonts (Plus Jakarta Sans for body, Outfit for headings).
- ✅ No text is embedded in images.

### Media Rules

- ✅ **Alt text on all images** — every `<img>` has descriptive alt text. Decorative elements use `aria-hidden="true"` and `alt=""`. Enforced by ESLint `jsx-a11y/alt-text` at error severity.
- ✅ **No flashing or strobe effects** — zero flashing content anywhere on the site. Meets WCAG 2.3.1 (Three Flashes) at AAA level.
- ✅ **No autoplay media** — all audio and video content is opt-in. Nothing plays automatically.
- 🔜 **Video captions** — required for all video content per Chair's guidelines. No video content currently on site; when added, all videos will have closed captions.
- 🔜 **Audio descriptions** — per Chair, every video should have audio descriptions for people who are blind. Will be implemented when video content is added.
- 🔜 **Written transcripts** — per Chair, every audio clip must have a written transcript. Will be implemented when audio content is added.
- 🔜 **ASL interpretation** — per Chair, sign language interpretation available for important content. Planned for future release.

### Keyboard Navigation

- ✅ **Full keyboard navigation** — every interactive element is reachable and operable via Tab, Enter, Space, Escape, and arrow keys.
- ✅ **Skip-to-content link** — hidden link at the top of every page; becomes visible on Tab focus, allowing keyboard users to bypass the header navigation.
- ✅ **Visible focus indicators** — all focusable elements display a clear cyan outline on `:focus-visible`. In high contrast mode, focus rings are 3px with increased offset.
- ✅ **Focus trapping in modals** — when a dialog or panel is open (accessibility settings, image modals, mobile navigation), keyboard focus is trapped inside via the `useFocusTrap` hook. Focus returns to the triggering element on close.
- ✅ **Escape key closes all overlays** — accessibility panel, image modals, mobile navigation drawer, and dropdown menus all close on Escape.
- ✅ **Click-outside-to-close** — dropdowns and menus close when clicking outside their boundary.

### Timers & Auto-Advancing Content

- ✅ **No timed content** — no auto-advancing carousels, countdown timers requiring action, or session timeouts.
- ✅ **No auto-advance** — nothing on the site advances without user action.

---

## 2. Language & Tone

_Maps to Chair's Guidelines: Section 2_

### Pronoun Rules

- ✅ Default to **"you/your"** (direct address) instead of he/she throughout all copy.
- ✅ Use **"they/them"** when gender is unknown.
- ✅ Never assume gender from name or appearance.
- ✅ **Gender-neutral greetings** — no gendered greetings anywhere. The site uses "Hey everyone," "Hey folks," "Hi there," etc.

### Recovery-Specific Language (Chair's Section 9)

- ✅ **Person-first language** — "people in recovery," never "addicts" or "alcoholics" (except in the proper name "Alcoholics Anonymous").
- ✅ **No "clean/dirty" language** — never used to describe sobriety status.
- ✅ **No "substance abuse"** — use "substance use" instead.
- ✅ **No success/failure framing** around relapse.
- ✅ All copy reviewed against these rules.

### Banned Terms

Per the Chair's guidelines, the following terms are banned from all site copy, UI text, and AI-generated content:

| Banned                         | Use Instead                            |
| ------------------------------ | -------------------------------------- |
| "guys"                         | "everyone," "folks," "y'all"           |
| "ladies and gentlemen"         | "everyone," "distinguished guests"     |
| "manpower"                     | "workforce," "staffing"                |
| "blacklist / whitelist"        | "blocklist / allowlist"                |
| "grandfathered in"             | "legacy," "pre-existing"               |
| "spirit animal"                | "favorite," "kindred"                  |
| "lame"                         | "ineffective," "unimpressive"          |
| "crazy" / "insane"             | "wild," "unbelievable," "intense"      |
| "blind spot"                   | "gap," "oversight"                     |
| "addict" (as a noun)           | "person in recovery"                   |
| "clean / dirty" (for sobriety) | "in recovery," "using"                 |
| "substance abuser"             | "person who uses substances"           |
| "suffering from addiction"     | "living with a substance use disorder" |

### Reading Level

- ✅ **Plain, clear language** — no jargon, no unnecessarily complex sentences.
- ✅ For complex topics, simplified explanations are provided alongside detailed ones (e.g., the `/accessibility` page uses plain descriptions for all technical features).

### Multilingual Support

- ✅ **Language switcher UI** built and ready (`LanguageSwitcher` component with EN/ES toggle, Escape key to close, click-outside to close).
- 🔜 **Spanish translation** — in progress. The switcher and routing infrastructure exist; translation of content is ongoing.
- 🔜 **ASL video content** — planned for future release.

### Cultural Assumptions to Avoid

Per the Chair's guidelines:

- ✅ No holiday assumptions in site copy — either no holidays referenced, or all holidays listed equally.
- ✅ No assumptions about personal finances or housing stability.
- ✅ These topics are only referenced when directly relevant to content (e.g., sliding scale pricing mentions financial flexibility without assuming hardship).

### Content Warnings

- ✅ A reusable `ContentWarning` component hides sensitive content behind an opt-in toggle with `aria-expanded` for screen readers.
- ✅ Brief warning text is shown before the hidden content.
- ✅ Content is revealed only when the user clicks to expand.

### Error Messages

Per the Chair's guidelines — warm and inviting, never condescending:

- ✅ Error messages throughout the site use friendly, helpful language.
- ✅ Example pattern: "We're having trouble loading the payment form. Please refresh the page or try again in a moment." — not "Error 403: Invalid input."

---

## 3. Imagery & Representation

_Maps to Chair's Guidelines: Section 3_

### Diversity in Images

Per the Chair, all imagery should represent:

- Range of races and ethnicities
- Different body types and sizes
- People with visible disabilities
- Range of ages
- Gender-diverse presentation
- Diverse family structures
- No stereotypical role assignments

**Status:** ✅ Applied to all imagery decisions. The site primarily uses event photography and graphic design rather than stock photos, but all image choices follow these principles. As the image library grows (especially for the program/events pages), diversity requirements will be maintained.

### AI-Generated Images

Per the Chair:

- ✅ Must be labeled as AI-generated.
- ✅ Must not depict real, specific people.
- ✅ Must explicitly prompt for diverse representation.
- ✅ Do NOT need Chair review before use (Chair trusts the development team).
- ✅ AI-generated images are allowed (not banned).

### Decorative & Functional Images

- ✅ All decorative images use `aria-hidden="true"` and `alt=""`.
- ✅ All functional images have meaningful `alt` text describing their purpose.
- ✅ OpenGraph/social sharing images have alt text.

---

## 4. Forms & Identity

_Maps to Chair's Guidelines: Section 4_

### Name Fields

- ✅ Flexible approach — both single "Name" fields and separate First/Last are used depending on context.
- ✅ All name fields allow hyphens, apostrophes, accents, spaces, and non-English characters (Chinese, Arabic, Hindi, etc.) — no character restrictions.
- ✅ No minimum character requirement on name fields.

### Inclusive Terminology in Code & UI

- ✅ All ableist terms have been removed from code, UI labels, variable names, and data storage keys.
- ✅ Example: "Handicap Accessibility" → **"Wheelchair / Mobility Access"** (`mobilityAccessibility` in code, `mobility_accessibility` in Stripe metadata). Renamed across all interfaces, forms, server actions, validation schemas, and tests.

### Gender & Pronouns

- ✅ Gender is **not collected** unless legally required. No Male/Female dropdowns anywhere on the site.
- ✅ Pronouns are **optional** — never required.

### Data Minimization

Per the Chair: "Anything that could endanger someone if leaked must be optional."

- ✅ Physical/street address fields are **never required**.
- ✅ The site does **not** collect: race/ethnicity, sexual orientation, age/date of birth, religious affiliation, veteran status, or income — unless legally required.
- ✅ Sensitive data (e.g., accessibility/dietary needs on registration) is only visible to designated committee members.

### Required vs. Optional Fields

- ✅ All fields that could compromise safety if leaked are optional.
- ✅ Required fields are limited to what's necessary for the specific transaction (e.g., name and email for registration).

---

## 5. AI & Automation

_Maps to Chair's Guidelines: Section 5_

### AI Guardrails for Code Generation

- ✅ **`.windsurfrules`** file injects accessibility requirements into every AI-assisted coding session.
- ✅ **Persistent memory entry** stored in the AI's database — accessibility-first rules are active even if the rules file isn't read.
- ✅ Rules enforce: ARIA attributes, keyboard handlers, semantic HTML, contrast ratios, focus traps, person-first language, and banned terms.

### AI Hard Rules (Per Chair — No Exceptions)

These rules are encoded in both `.windsurfrules` and the AI's persistent memory:

- ✅ NEVER guess someone's gender, race, sexuality, or disability.
- ✅ NEVER change responses based on demographic information.
- ✅ NEVER suggest content based on assumed identity.
- ✅ NEVER limit access or options based on who someone is.
- ✅ NEVER save/remember sensitive info without explicit permission.
- ✅ NEVER make jokes about identity, bodies, or culture.

### AI Chatbot Tone (Per Chair)

If/when a chatbot is added:

- Warm and supportive — not fake or condescending.
- Never use gendered language ("sir," "ma'am," "buddy").
- Same simple, clear language as the rest of the site.
- Never assume anything about the user's identity or life circumstances.
- When unsure, be honest about not knowing and offer to connect with a real person.

### AI Content Review

- ✅ Per Chair: all AI-written content must be reviewed before publishing. No auto-publish.
- ✅ Content filters must not flag identity-related content inappropriately (e.g., LGBTQ+ content should never be flagged as "sexual").

### Items Flagged for Follow-Up

- 🔖 **AI behavior with recovery topics** — Chair wants broader committee input before finalizing AI recovery behavior. Default (highest standard): maximum sensitivity, person-first language enforced, no success/failure framing, AI offers to connect with a real person for recovery questions it can't answer with certainty.

---

## 6. Community & Events

_Maps to Chair's Guidelines: Section 6_

### In-Person Event Accessibility

The `/accessibility` page publicly communicates the following accommodations:

- ✅ Wheelchair accessible venue (ramps, elevators, accessible restrooms)
- ✅ ASL interpreters available on request
- ✅ Quiet / sensory break room
- ✅ Dietary food options (halal, kosher, vegan, gluten-free, allergy-safe)
- ✅ Sliding scale pricing and financial assistance
- ✅ Childcare and kid-friendly options under consideration

### Virtual Event Accessibility

Per the Chair, when virtual events are held:

- 🔜 Live captions (real-time subtitles)
- 🔜 ASL interpreter available on request
- 🔜 Captioned recordings available after the event
- 🔜 Multiple participation methods (text chat, Q&A, post-event submission — not just speaking)

### Event Registration

- ✅ Registration collects dietary info and accessibility needs.
- ✅ Pronoun field is optional.

### Code of Conduct

- 🔜 Per Chair: a Code of Conduct is required. Must cover personal and professional interactions, include unwelcome/uncomfortable/unsafe framework, and include where to reach assistance. To be published before the event.

### Harassment Reporting

- 🔖 Chair noted sensitivity around this topic — defers to group decision-making. Default (highest standard): anonymous reporting always available, all reports handled privately, small designated group reviews reports, no retaliation, survivor/reporter controls their own involvement.

---

## 7. Emails & Outreach

_Maps to Chair's Guidelines: Section 7_

Per the Chair, all email communications must follow these rules:

- 🔜 **Plain-text alternative** for every HTML email.
- 🔜 **Alt text** on all images in emails.
- ✅ **Gender-neutral greetings** — "Hi there," not "Hey guys."
- ✅ **Same simple reading level** as the website.
- 🔜 **Translate important emails** for non-English speakers (Spanish priority).
- 🔜 **Notification controls** — users choose notification frequency, easy unsubscribe on every message.
- ✅ **Never reveal sensitive info** (recovery status, etc.) in subject lines or previews.

### Social Media

- ✅ All inclusion rules apply to social media content.
- ✅ Diversity of all kinds in visual content.
- ✅ Avoid ableism, racism, classism.

---

## 8. Privacy & Safety

_Maps to Chair's Guidelines: Section 8_

### Data Protection

Per the Chair, the following categories of data receive **equal protection** and are never exposed without explicit user consent:

- Sexual orientation
- Gender identity / transgender status
- Disability status
- Recovery / sobriety status
- Immigration status
- Religious beliefs
- Mental health information
- HIV / health status

### Data Visibility

- ✅ User data is never shown to other users unless the person explicitly enables it.
- ✅ Only designated committee members can access sensitive registration data.

### Anonymity

- ✅ **Preferred/chosen names** accepted throughout (no requirement for legal names unless legally necessary).
- ✅ **Anonymous feedback form** on the `/accessibility` page — categorized by type (accessibility barrier, navigation issue, language concern, content issue, other).
- ✅ **Anonymous harassment reports** — the feedback form can be used without identifying information.
- ✅ Event registration data is private to relevant committee members.

### Public Statements

Per the Chair, the following are required on the site:

- ✅ **Accessibility statement** — in both the site footer and the `/accessibility` page, citing WCAG 2.1 AAA target and AA floor.
- ✅ **Contact info for reporting problems** — in both the footer ("Report a problem" link) and the accessibility page (email + feedback form).
- ✅ **Accommodation request link** — on the `/accessibility` page with pre-filled email subject.

---

## 9. Recovery-Specific Inclusion

_Maps to Chair's Guidelines: Section 9_

### Recovery Language

See **Section 2: Language & Tone** above for the complete banned terms list and person-first language rules.

### Digital Anonymity Traditions

- 🔖 Chair needs further discussion/education on digital interpretation of AA's 11th and 12th Traditions. No unilateral decisions have been made.
- ✅ **Default (highest standard):** Maximum anonymity. No full names, no identifiable photos of members as AA members, no recovery status visible to other users. Aligns with `AA_TRADITIONS_GUARDRAILS.md` (Traditions 11 & 12).
- ✅ AA trademark acknowledgment in site footer ("Alcoholics Anonymous®, A.A.®, and The Big Book® are registered trademarks of AAWS, Inc.").

### Recovery Diversity Support

Per the Chair, the site should support:

- 🔜 Links to specialized meetings (in-person, hybrid, online) — the meetings section currently lists CT Young People's meetings.
- 🔜 Opt-in matching for users with similar experiences (both parties must opt in).
- ✅ Monitoring and removal of any phobic language in user-facing content.

### Dedicated Safe Spaces (All Approved by Chair)

Per the Chair, these dedicated spaces are approved:

- Women's meetings/spaces
- LGBTQ+ meetings/spaces
- BIPOC meetings/spaces
- Young people's spaces
- Secular/atheist/agnostic spaces
- Disability-specific spaces

**Status:** 🔜 Meeting listings and safe space pages will be added as content becomes available.

---

## 10. Feedback, Reporting & Governance

_Maps to Chair's Guidelines: Sections 6, 8, 10_

### User Problem Reporting (Per Chair — All Required)

- ✅ **"Report a Problem" link** in the site footer on every page.
- ✅ **Dedicated accessibility email** — info@necypaa.org with pre-filled subject lines.
- ✅ **Anonymous feedback form** on the `/accessibility` page with categorized submission.

### Accommodation Requests

- ✅ **"Need Accommodations?" section** on the `/accessibility` page with a direct email link for ASL, dietary, mobility, or other needs.

### Review Schedule (Per Chair — All Approved)

- 🔜 Every few months: full website accessibility review.
- 🔜 Monthly: AI chatbot behavior review (when chatbot is added).
- 🔜 Annually: full language/inclusiveness audit.
- 🔜 Post-event: accessibility review of what worked and what didn't.
- 🔜 Ongoing: community feedback monitoring.

### Pre-Launch Review

- 🔖 **Chair explicitly requested** a final review of everything before enactment. All implementations are built but nothing goes live without Chair sign-off. A review meeting must be scheduled before launch.

---

## 11. Automated Enforcement & Developer Tooling

Accessibility compliance is not just documented — it is **automatically enforced at every level** of the development workflow.

### Static Analysis (ESLint)

- **`eslint-plugin-jsx-a11y`** is installed in **strict mode** with **30 rules** all set to `"error"` severity.
- Rules cover: `alt-text`, `click-events-have-key-events`, `no-static-element-interactions`, `label-has-associated-control`, `tabindex-no-positive`, `aria-role`, `aria-props`, `anchor-is-valid`, `interactive-supports-focus`, `no-noninteractive-element-interactions`, `no-noninteractive-tabindex`, `no-redundant-roles`, `role-has-required-aria-props`, `scope`, and 16 more.
- ESLint config: `eslint.config.mjs` (ESLint 9 flat config format) extending `eslint-config-next` with full jsx-a11y strict overrides.
- Any accessibility violation in a `.tsx` or `.jsx` file is flagged as an **error** — not a warning.

### Pre-Commit Hook (Husky + lint-staged)

- **Husky v9** manages Git hooks. The pre-commit hook (`.husky/pre-commit`) runs `npx lint-staged` before every commit.
- **lint-staged** runs ESLint on all staged `.ts` and `.tsx` files.
- If any staged file contains an accessibility violation (or any ESLint error), **the commit is blocked**. The developer must fix the violation before the code can enter the repository.
- This applies to **every branch** — no accessibility-violating code can be committed anywhere in the project.

### AI Guardrails (Windsurf / Cascade)

- A **`.windsurfrules`** file in the project root injects accessibility requirements into every AI-assisted coding session.
- A **persistent memory entry** is stored in the AI's memory database, tagged to this project.
- Rules enforce: JSX/TSX requirements (alt text, keyboard handlers, ARIA attributes, focus traps), CSS requirements (contrast ratios, reduce-motion overrides, light mode support), component patterns (semantic HTML, Radix UI), language and tone (person-first, banned terms), and commit practices.

### What This Means in Practice

| Scenario                                                | What Happens                                                                      |
| ------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Developer adds `<img>` without `alt` text               | ESLint error — IDE shows red underline, commit is blocked                         |
| Developer adds `<div onClick>` without keyboard handler | ESLint error — commit blocked until `role`, `tabIndex`, and `onKeyDown` are added |
| Developer uses `tabindex="5"`                           | ESLint error — positive tabindex values are forbidden                             |
| Developer adds a form `<input>` without a `<label>`     | ESLint error — label association is required                                      |
| AI assistant generates inaccessible code                | Windsurf rules intercept — the AI rewrites the code to be compliant               |
| Developer tries to commit on any branch                 | Pre-commit hook runs ESLint on staged files — violations block the commit         |

### Suppression Policy

- ESLint rule suppression (`eslint-disable`) is **only allowed with a written justification comment** explaining why the rule cannot be followed in that specific case.
- Currently suppressed patterns (all with explanations):
  - **Backdrop click-to-dismiss** on modal overlays — supplementary to Escape key and close button, which are the primary keyboard-accessible close mechanisms.
  - **`stopPropagation`** on modal content containers — prevents accidental close when interacting with modal content; the container itself is not interactive.

---

## 12. Technical Implementation

| Component / File                                                   | Purpose                                                                                                                                                                          |
| ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `A11yProvider` (`lib/accessibility-context.tsx`)                   | Manages all 6 settings, persists to localStorage, detects OS preferences (`prefers-color-scheme`, `prefers-reduced-motion`), announces changes to screen readers via `aria-live` |
| `AccessibilityPanel` (`components/accessibility-panel.tsx`)        | Floating settings UI with focus trap, Escape key, ARIA dialog attributes, reset button                                                                                           |
| `useFocusTrap` (`lib/use-focus-trap.ts`)                           | Reusable keyboard focus trap hook for any modal/overlay/drawer                                                                                                                   |
| `ContentWarning` (`components/content-warning.tsx`)                | Reusable sensitive content toggle with `aria-expanded`                                                                                                                           |
| `AnonymousFeedbackForm` (`components/anonymous-feedback-form.tsx`) | Categorized feedback form with `aria-live` confirmation, labeled inputs                                                                                                          |
| `LanguageSwitcher` (`components/language-switcher.tsx`)            | EN/ES language toggle with Escape key and click-outside-to-close                                                                                                                 |
| `globals.css` a11y layers                                          | CSS classes for reduce-motion, grayscale, high-contrast, dyslexia font, light mode, and all combinations (including light + high contrast)                                       |
| Skip-to-content link (`app/layout.tsx`)                            | In root layout, visible on focus, styled with high-contrast background                                                                                                           |
| `html lang="en"` (`app/layout.tsx`)                                | Document language set for screen readers                                                                                                                                         |
| `aria-live` announcer                                              | Dynamically created status region for setting change announcements                                                                                                               |
| `eslint.config.mjs`                                                | ESLint 9 flat config with `eslint-config-next` + 30 strict `jsx-a11y` rules                                                                                                      |
| `eslint-plugin-jsx-a11y`                                           | Static analysis plugin enforcing ARIA, keyboard, and semantic HTML rules at error severity                                                                                       |
| `.husky/pre-commit`                                                | Git hook that runs lint-staged before every commit                                                                                                                               |
| `lint-staged` (in `package.json`)                                  | Runs ESLint on staged `.ts/.tsx` files — blocks commits with a11y errors                                                                                                         |
| `.windsurfrules`                                                   | AI assistant rules file enforcing a11y-first code generation                                                                                                                     |
| `ExpandableMeetingRow` (`components/expandable-meeting-row.tsx`)   | Collapsible meeting details with `aria-expanded` and labeled toggle button                                                                                                       |
| `ACCESSIBILITY_GUIDELINES.md`                                      | Complete Accessibilities Chair questionnaire responses (authoritative source)                                                                                                    |
| `AA_TRADITIONS_GUARDRAILS.md`                                      | AA Tradition compliance rules for digital anonymity                                                                                                                              |

### ARIA Landmarks & Roles Used

| Pattern                                              | Where Used                                                               |
| ---------------------------------------------------- | ------------------------------------------------------------------------ |
| `role="banner"`                                      | Site header                                                              |
| `role="dialog"` + `aria-modal="true"` + `aria-label` | Accessibility panel, image modals                                        |
| `role="switch"` + `aria-checked`                     | Toggle switches in accessibility panel                                   |
| `aria-label` on `<nav>`                              | "Main navigation," "Mobile navigation," footer quick links               |
| `aria-expanded`                                      | Content warnings, mobile menu, collapsible sections, meeting row details |
| `aria-pressed`                                       | Color mode toggle buttons                                                |
| `aria-live="polite"` + `aria-atomic="true"`          | Setting change announcements, form confirmations                         |
| `aria-labelledby` / `aria-label` on inputs           | All form fields (registration, feedback, checkout)                       |

---

## 13. Standards & Compliance

| Standard                            | Status                                                       |
| ----------------------------------- | ------------------------------------------------------------ |
| WCAG 2.1 Level AA                   | ✅ Met (minimum floor)                                       |
| WCAG 2.1 Level AAA                  | ✅ Met where achievable (our target)                         |
| ADA Title III                       | ✅ Met                                                       |
| CT State Accessibility Requirements | ✅ Met                                                       |
| Section 508                         | ✅ Met                                                       |
| Automated a11y linting (0 errors)   | ✅ Enforced via ESLint + pre-commit hook                     |
| Chair's Questionnaire (10 sections) | ✅ All sections addressed (see status indicators throughout) |

---

## 14. Items Flagged for Chair Follow-Up

These items require additional discussion with the Accessibilities Chair before final implementation. Per Website Chair directive, we default to the highest standard until the Chair explicitly overrides.

| Item                                                   | Chair's Notes                                                                                             | Current Default                                                                                                                |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **Digital anonymity traditions** (Guidelines §9.1)     | Chair needs to consult 1–2 people and get more education on digital interpretation of Traditions 11 & 12. | Maximum anonymity. No full names, no identifiable photos of members as AA members, no recovery status visible to others.       |
| **AI behavior with recovery topics** (Guidelines §9.5) | Chair wants broader committee input before deciding.                                                      | Maximum sensitivity. Person-first language. No success/failure framing. AI offers to connect with a real person.               |
| **Legal compliance standards** (Guidelines §8.5)       | Chair needs guidance; we default to WCAG AA + state requirements.                                         | WCAG 2.1 AAA wherever achievable. AA as floor. CT state requirements as baseline. ADA Title III.                               |
| **Harassment reporting process** (Guidelines §6.5)     | Chair suggests small group consensus; sensitive timing.                                                   | Anonymous reporting always available. All reports private. Small group reviews. No retaliation. Survivor controls involvement. |
| **Pre-launch review** (Guidelines §10)                 | Chair explicitly requested final review of everything before enactment.                                   | All implementations built. Nothing goes live without Chair sign-off. Schedule review meeting before launch.                    |

---

## Questions?

Contact the Web Committee at **info@necypaa.org** or reach out to Nikki T. directly.
