---
description: Run a frontend-specific review using the senior-frontend skill. Checks React/Next.js patterns, bundle optimization, component quality, server vs client component boundaries, and image optimization.
---

# Frontend Review Workflow

This workflow uses the `senior-frontend` skill from `claude-skills/engineering-team/senior-frontend/`.

## Step 1: Bundle Analysis

Analyze dependencies for optimization opportunities:
// turbo

```bash
python3 claude-skills/engineering-team/senior-frontend/scripts/bundle_analyzer.py .
```

**Score interpretation:**

- 90-100 (A): Well-optimized
- 80-89 (B): Minor optimizations available
- 70-79 (C): Replace heavy dependencies
- 60-69 (D): Multiple issues need attention
- 0-59 (F): Critical bundle size problems

## Step 2: Server vs Client Component Audit

Check that `'use client'` is only used when necessary (event handlers, state, effects, browser APIs). Server Components should be the default.

## Step 3: Image Optimization Check

- Above-the-fold images use `priority` prop
- Responsive images use `fill` with `sizes` attribute
- Remote image patterns configured in `next.config.js`

## Step 4: React Patterns Review

- Compound components for related state sharing
- Custom hooks for reusable logic extraction
- Context usage is minimal and well-scoped
- No prop drilling beyond 2 levels
- Error boundaries at critical component boundaries

## Step 5: Performance Patterns

- Parallel data fetching with `Promise.all`
- Streaming with `<Suspense>` for non-critical content
- `loading.tsx` files for route-level loading states
- Dynamic imports for heavy below-the-fold components
- `optimizePackageImports` for icon libraries (lucide-react)
