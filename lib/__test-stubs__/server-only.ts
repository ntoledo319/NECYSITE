// Test-only stub. Real `server-only` package throws when imported from a
// client module; in vitest we exercise server modules directly, so we alias
// the import to this empty file via vitest.config.ts.
export {}
