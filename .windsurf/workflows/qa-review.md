---
description: Run QA review and test generation using the senior-qa skill. Generates unit test stubs, analyzes coverage gaps, scaffolds Playwright E2E tests, and configures test runners.
---

# QA Review Workflow

This workflow uses the `senior-qa` skill from `claude-skills/engineering-team/senior-qa/`.

## Step 1: Scan for Untested Components

// turbo

```bash
python3 claude-skills/engineering-team/senior-qa/scripts/test_suite_generator.py components/ --scan-only
```

## Step 2: Generate Test Stubs

Generate Jest + React Testing Library test stubs with a11y tests:

```bash
python3 claude-skills/engineering-team/senior-qa/scripts/test_suite_generator.py components/ --output __tests__/ --include-a11y
```

## Step 3: Scaffold E2E Tests

Generate Playwright E2E tests from Next.js App Router routes:

```bash
python3 claude-skills/engineering-team/senior-qa/scripts/e2e_test_scaffolder.py app/ --output e2e/ --include-pom
```

## Step 4: Analyze Coverage (if coverage report exists)

```bash
python3 claude-skills/engineering-team/senior-qa/scripts/coverage_analyzer.py coverage/coverage-final.json --threshold 80
```

## Step 5: Testing Patterns Reference

- **Queries**: Prefer `getByRole`, `getByLabelText`, `getByText` (accessible queries)
- **User events**: Use `@testing-library/user-event` over `fireEvent`
- **Async**: Use `findBy*` for elements that appear after async operations
- **Mocking**: Use MSW for API mocking
- **E2E Locators**: Prefer `page.getByRole()`, `page.getByLabel()`, `page.getByText()`

## Coverage Thresholds

| Metric     | Target |
| ---------- | ------ |
| Branches   | 80%    |
| Functions  | 80%    |
| Lines      | 80%    |
| Statements | 80%    |
