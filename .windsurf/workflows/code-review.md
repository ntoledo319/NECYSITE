---
description: Run a comprehensive code review using the code-reviewer skill. Analyzes code quality, detects SOLID violations, code smells, security issues, and generates a review report with verdicts.
---

# Code Review Workflow

This workflow uses the `code-reviewer` skill from `claude-skills/engineering-team/code-reviewer/`.

## Step 1: Run Code Quality Checker

Analyze source code for structural issues, code smells, and SOLID violations:
// turbo

```bash
python3 claude-skills/engineering-team/code-reviewer/scripts/code_quality_checker.py .
```

**Thresholds:**

- Long function: >50 lines
- Large file: >500 lines
- God class: >20 methods
- Too many params: >5
- Deep nesting: >4 levels
- High complexity: >10 branches

## Step 2: Run PR Analyzer (if reviewing a branch)

Analyze git diff between branches for review complexity and risks:

```bash
python3 claude-skills/engineering-team/code-reviewer/scripts/pr_analyzer.py . --base main --head HEAD
```

**Detects:**

- Hardcoded secrets (passwords, API keys, tokens)
- SQL injection patterns
- Debug statements (debugger, console.log)
- ESLint rule disabling
- TypeScript `any` types
- TODO/FIXME comments

## Step 3: Generate Review Report

Combine analysis into a structured report:

```bash
python3 claude-skills/engineering-team/code-reviewer/scripts/review_report_generator.py . --format markdown --output review.md
```

**Verdicts:**

- Score 90+ with no high issues → **Approve**
- Score 75+ with ≤2 high issues → **Approve with suggestions**
- Score 50-74 → **Request changes**
- Score <50 or critical issues → **Block**

## Step 4: Manual Review Checklist

- [ ] **Pre-review**: Build passes, tests pass, PR description adequate
- [ ] **Correctness**: Logic correct, data handling safe, error handling complete
- [ ] **Security**: Input validation, injection prevention, no hardcoded secrets
- [ ] **Performance**: Efficient algorithms, proper caching, no N+1 queries
- [ ] **Maintainability**: Clear naming, DRY, proper abstractions
- [ ] **Testing**: Adequate coverage, meaningful assertions, no flaky tests
- [ ] **Accessibility**: ARIA attributes, keyboard navigation, contrast ratios
