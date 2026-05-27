import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "node",
    exclude: ["e2e/**", "node_modules/**", ".claude/**"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
      // `server-only` throws when imported outside an RSC; in tests we want to
      // exercise the server modules directly. Alias to an empty stub.
      "server-only": path.resolve(__dirname, "lib/__test-stubs__/server-only.ts"),
    },
  },
})
