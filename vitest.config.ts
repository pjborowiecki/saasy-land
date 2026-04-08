import { defineConfig } from "vitest/config"

import path from "node:path"
import { fileURLToPath } from "node:url"

const projectRoot = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      "~": projectRoot,
      "~/app": path.join(projectRoot, "src/app"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/vitest.setup.ts"],
    include: ["**/*.{test,spec}.{ts,tsx,js,jsx}"],
    passWithNoTests: true,
    exclude: [
      "**/node_modules/**",
      "**/.next/**",
      "**/dist/**",
      "**/build/**",
      "**/e2e/**",
      "**/opensrc/**",
      "**/src/integrations/drizzle-orm/migrations/**",
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      exclude: [
        "**/node_modules/**",
        "**/.next/**",
        "**/dist/**",
        "**/build/**",
        "**/e2e/**",
        "**/opensrc/**",
        "**/src/integrations/drizzle-orm/migrations/**",
      ],
    },
  },
})
