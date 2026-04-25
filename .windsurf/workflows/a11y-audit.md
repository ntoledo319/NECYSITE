---
description: Run a full WCAG 2.2 accessibility audit on the codebase using the a11y-audit skill. Scans for violations, checks color contrast, generates fix code, and produces a compliance report.
---

# Accessibility Audit Workflow

This workflow uses the `a11y-audit` skill from `claude-skills/engineering-team/a11y-audit/`.

## Phase 1: Scan

1. Run the a11y scanner against the project source files:
   // turbo

```bash
python3 claude-skills/engineering-team/a11y-audit/scripts/a11y_scanner.py . --format table
```

2. Run the contrast checker against CSS/Tailwind files:
   // turbo

```bash
python3 claude-skills/engineering-team/a11y-audit/scripts/contrast_checker.py --file app/globals.css
```

3. Review the scanner output. Violations are categorized as:
   - **Critical**: Blocks access for entire user groups (fix before release)
   - **Major**: Significant barrier that degrades experience (fix within current sprint)
   - **Minor**: Usability issue that causes friction (fix within next 2 sprints)

## Phase 2: Fix

4. For each violation, apply the framework-specific fix pattern from the skill's Fix Patterns section. This project uses **React / Next.js** patterns.

5. Key checks per the WCAG 2.2 coverage matrix:
   - **1.1.1** Non-text Content: Every `<img>` has meaningful `alt` or `alt=""` with `aria-hidden`
   - **1.3.1** Info and Relationships: Semantic HTML, proper heading hierarchy, form labels
   - **1.4.3** Contrast: 4.5:1 normal text, 3:1 large text (AAA target: 7:1 / 4.5:1)
   - **2.1.1** Keyboard: All interactive elements keyboard-accessible, no `<div onClick>` without role/tabIndex/onKeyDown
   - **2.4.7** Focus Visible: Never remove `:focus-visible` outlines
   - **2.4.11** Focus Appearance (WCAG 2.2): 2px outline minimum, 3:1 contrast
   - **2.5.8** Target Size (WCAG 2.2): 24x24px minimum, 44x44px recommended for touch
   - **3.3.7** Redundant Entry (WCAG 2.2): Auto-populate previously entered info
   - **3.3.8** Accessible Authentication (WCAG 2.2): Support password managers, no CAPTCHA without alternative
   - **4.1.2** Name/Role/Value: Custom widgets have proper ARIA roles
   - **4.1.3** Status Messages: Dynamic content uses `aria-live` regions

## Phase 3: Verify

6. Re-run the scanner to confirm fixes:
   // turbo

```bash
python3 claude-skills/engineering-team/a11y-audit/scripts/a11y_scanner.py . --format table
```

7. Run through the manual testing checklist:
   - [ ] All interactive elements reachable via Tab
   - [ ] Tab order follows visual/logical reading order
   - [ ] Focus indicator visible on every focusable element
   - [ ] Modals trap focus and return focus on close
   - [ ] Escape key closes modals, dropdowns, popups
   - [ ] All images have appropriate alt text
   - [ ] Headings create logical outline (h1 → h2 → h3)
   - [ ] Form inputs have associated labels
   - [ ] Error messages announced via `aria-live` or `role="alert"`
   - [ ] Text contrast meets ratios
   - [ ] Content reflows at 320px width
   - [ ] Animations respect `prefers-reduced-motion`

## Project-Specific Rules (NECYPAA XXXVI)

- Target: **WCAG 2.1 Level AAA** (AA as absolute minimum)
- All modals MUST use `useFocusTrap` from `@/lib/use-focus-trap`
- 6 a11y modes must work: dark/light, high-contrast, font size, dyslexia font, reduce motion, grayscale
- Person-first language always
- No banned terms (see ACCESSIBILITY_GUIDELINES.md)
- ESLint `jsx-a11y` strict mode with zero warnings tolerance
