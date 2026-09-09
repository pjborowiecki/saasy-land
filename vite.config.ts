import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { parseEnv } from "node:util"
import { type PluginOption, defineConfig, lazyPlugins, loadEnv } from "vite-plus"

import { I18N } from "./src/integrations/use-intl/i18n.config.ts"
import { canonicalizePathname, deLocalizePathname, localizePathname } from "./src/integrations/use-intl/i18n.paths.ts"
import { ROUTES } from "./src/routes.ts"

const projectRoot = import.meta.dirname

const isE2E = process.env["E2E"] === "true"
const usesRemoteBindings = !isE2E && process.env["CLOUDFLARE_ENV"] === "development"
const testEnvPath = resolve(projectRoot, ".env.test")
const testEnv = isE2E ? parseEnv(readFileSync(testEnvPath, "utf8")) : {}
const testBindings = Object.fromEntries(Object.entries(testEnv).filter((entry): entry is [string, string] => entry[1] !== undefined))

const UNLISTED_ROUTES = [ROUTES.ADMIN, ROUTES.APP, "/auth", "/newsletter", "/api"]

const ignorePatterns = [
  "**/*.d.ts",
  "**/*.tsbuildinfo",
  ".agents",
  "remotion",
  ".claude",
  ".output",
  ".source",
  ".tanstack",
  ".vscode",
  ".wrangler",
  "blob-report",
  "coverage",
  "dist",
  "dist-ssr",
  "e2e",
  "node_modules",
  "playwright-report",
  "playwright/.cache",
  "scripts",
  "src/integrations/**/*.d.json.ts",
  "src/integrations/**/migrations/**",
  "src/routeTree.gen.ts",
  "src/types/worker-configuration.d.ts",
  "test-results",
]

export default defineConfig({
  fmt: {
    arrowParens: "always",
    bracketSpacing: true,
    endOfLine: "lf",
    ignorePatterns,
    jsxSingleQuote: false,
    printWidth: 140,
    semi: false,
    singleQuote: false,
    sortImports: {
      customGroups: [
        {
          elementNamePattern: ["@tanstack/react-start/server-only"],
          groupName: "server-only",
        },
        {
          elementNamePattern: ["cloudflare:workers"],
          groupName: "cloudflare",
        },
        {
          elementNamePattern: ["~/src/presentation/components/shadcn/**"],
          groupName: "components-shadcn",
        },
        {
          elementNamePattern: ["~/src/presentation/components/custom/**"],
          groupName: "components-custom",
        },
        {
          elementNamePattern: ["~/src/presentation/components/**"],
          groupName: "components-other",
        },
        {
          elementNamePattern: ["~/src/presentation/branding/**"],
          groupName: "branding",
        },
        {
          elementNamePattern: [
            "~/src/constants",
            "~/src/constants/**",
            "~/src/data",
            "~/src/data/**",
            "~/src/presentation/theme",
            "~/src/presentation/theme/**",
          ],
          groupName: "constants",
        },
        {
          elementNamePattern: ["~/src/hooks/**"],
          groupName: "hooks",
        },
        {
          elementNamePattern: ["~/src/integrations/**"],
          groupName: "integrations",
        },
        {
          elementNamePattern: ["~/src/lib/**"],
          groupName: "lib",
        },
        {
          elementNamePattern: ["~/src/modules/**"],
          groupName: "modules",
        },
        {
          elementNamePattern: ["~/src/platform/**"],
          groupName: "platform",
        },
        {
          elementNamePattern: ["~/src/providers/**"],
          groupName: "providers",
        },
        {
          elementNamePattern: ["react", "react/**", "react-dom", "react-dom/**"],
          groupName: "react",
        },
        {
          elementNamePattern: ["~/src/routes/**"],
          groupName: "routes",
        },
        {
          elementNamePattern: ["~/src/presentation/styles/**"],
          groupName: "styles",
        },
        {
          elementNamePattern: ["~/src/types/**"],
          groupName: "types",
        },
      ],
      groups: [
        "server-only",
        "cloudflare",
        "react",
        ["builtin", "external"],
        "platform",
        "providers",
        "integrations",
        "modules",
        "routes",
        "hooks",
        "constants",
        "types",
        "lib",
        "branding",
        "components-shadcn",
        "components-custom",
        "components-other",
        "styles",
        ["internal", "parent", "sibling", "index"],
        "unknown",
      ],
      ignoreCase: true,
      newlinesBetween: true,
      sortSideEffects: true,
    },
    sortTailwindcss: {
      attributes: ["className", "classList"],
      functions: ["clsx", "cn", "cva", "tw"],
      stylesheet: "./src/presentation/styles/globals.css",
    },
    tabWidth: 2,
    trailwingComma: "all",
    useTabs: false,
  },
  lint: {
    categories: {
      correctness: "error",
      nursery: "error",
      pedantic: "error",
      perf: "error",
      style: "error",
      suspicious: "error",
    },
    env: { browser: true, es2024: true, node: true, worker: true },
    globals: { HTMLRewriter: "readonly", caches: "readonly" },
    ignorePatterns,
    options: {
      typeAware: true,
      typeCheck: true,
    },
    overrides: [
      {
        files: ["src/**/*.test.{ts,tsx}", "src/**/__test__/**", "src/platform/testing/**"],
        rules: {
          "no-await-in-loop": "off",
          "no-magic-numbers": "off",
          "unicorn/no-null": "off",
        },
      },
      {
        files: ["src/presentation/**", "src/hooks/**"],
        rules: { "typescript/consistent-return": "off" },
      },
      {
        files: ["src/platform/testing/mocks/**"],
        rules: { "require-await": "off", "typescript/require-await": "off" },
      },
      {
        files: ["src/routes/**"],
        // TanStack infers loader types from preceding search and loaderDeps options.
        rules: { "sort-keys": "off" },
      },
      {
        files: ["vite.config.ts"],
        rules: {
          "max-lines": "off",
        },
      },
    ],
    rules: {
      "id-length": ["error", { exceptions: ["_", "m", "t"], properties: "never" }],
      "max-lines": ["error", { max: 800 }],
      "max-lines-per-function": ["error", { max: 150 }],
      "max-statements": ["error", { max: 20 }],
      "new-cap": ["error", { properties: false }],
      "no-magic-numbers": ["error", { ignore: [0], ignoreArrayIndexes: true, ignoreDefaultValues: true, ignoreTypeIndexes: true }],
      "no-ternary": "off",
      "no-underscore-dangle": ["error", { allow: ["_splat", "__executeServer"] }],
      "one-var": ["error", "never"],
      "sort-imports": ["error", { ignoreDeclarationSort: true }],
      "typescript/only-throw-error": [
        "error",
        {
          allow: [
            { from: "package", name: "NotFoundError", package: "@tanstack/router-core" },
            { from: "package", name: "Redirect", package: "@tanstack/router-core" },
          ],
        },
      ],
      "typescript/prefer-readonly-parameter-types": "off",
      "unicorn/no-useless-undefined": ["error", { checkArguments: false }],
    },
  },
  plugins:
    lazyPlugins(async (): Promise<PluginOption[]> => {
      const { cloudflare } = await import("@cloudflare/vite-plugin")
      const { tanstackStart } = await import("@tanstack/react-start/plugin/vite")

      const { fumadocsMdx } = await import("fumadocs-mdx/vite")
      const { default: tailwindcss } = await import("@tailwindcss/vite")
      const { default: viteReact } = await import("@vitejs/plugin-react")

      if (process.env["VITEST"] === "true") {
        return [viteReact()]
      }

      return [
        cloudflare({
          ...(isE2E
            ? {
                config: { vars: testBindings },
                configPath: "./src/platform/testing/wrangler.jsonc",
              }
            : {}),
          inspectorPort: false,
          persistState: isE2E ? { path: ".wrangler/test" } : true,
          remoteBindings: usesRemoteBindings,
          viteEnvironment: { name: "ssr" },
        }),
        fumadocsMdx({ configPath: "./src/integrations/fumadocs/fumadocs.config.ts" }),
        tailwindcss(),
        tanstackStart({
          pages: I18N.SUPPORTED_LOCALES.map((locale) => ({ path: localizePathname({ locale, pathname: "/" }) })),
          prerender: {
            autoStaticPathsDiscovery: true,
            crawlLinks: true,
            enabled: true,
            filter: (page) => {
              const { pathname, search, hash } = new URL(page.path, "http://localhost")
              return (
                search.length === 0 &&
                hash.length === 0 &&
                canonicalizePathname(pathname) === pathname &&
                !UNLISTED_ROUTES.some((route) => deLocalizePathname(pathname).startsWith(route))
              )
            },
          },
        }),
        viteReact(),
      ]
    }) ?? [],
  resolve: { noExternal: ["fumadocs-core", "fumadocs-ui"], tsconfigPaths: true },
  server: { port: 3000, strictPort: true, watch: { ignored: ["**/coverage/**"] } },
  staged: { "*": "vp check --fix" },
  test: {
    alias: [
      { find: "vitest", replacement: resolve(projectRoot, "node_modules/vite-plus/dist/test/index.js") },
      { find: "cloudflare:workers", replacement: resolve(projectRoot, "src/platform/testing/mocks/cloudflare.ts") },
      { find: /^@wrksz\/themes(?:\/client)?$/u, replacement: resolve(projectRoot, "src/platform/testing/mocks/wrksz-themes.ts") },
    ],
    coverage: {
      clean: true,
      exclude: [
        "**/*.{test,spec}.{ts,tsx}",
        "**/__test__/**",
        "**/*.d.ts",
        "**/migrations/**",
        "src/routes/**",
        "src/routeTree.gen.ts",
        "src/presentation/components/custom/admin/**",
        "src/presentation/components/custom/app/**",
        "src/presentation/components/custom/auth/**",
        "src/presentation/components/custom/blog/**",
        "src/presentation/components/custom/landing-page/**",
        "src/presentation/components/shadcn/**",
        "src/integrations/drizzle-orm/migrations/**",
        "src/integrations/fumadocs/**",
        "src/integrations/use-intl/*.d.json.ts",
        "src/providers/translations-provider.tsx",
        "src/presentation/styles/**",
        "src/types/**",
        "src/modules/**/*.types.ts",
        "src/platform/testing/**",
        "e2e/**",
      ],
      include: ["src/**/*.{ts,tsx}"],
      provider: "v8",
      reporter: ["text", "html", "json-summary"],
      reportsDirectory: "./coverage",
      thresholds: {
        branches: 100,
        functions: 100,
        lines: 100,
        "src/integrations/better-auth/auth.access.ts": {
          branches: 100,
          functions: 100,
          lines: 100,
          statements: 100,
        },
        "src/integrations/use-intl/i18n.locale.ts": {
          branches: 100,
          functions: 100,
          lines: 100,
          statements: 100,
        },
        "src/integrations/use-intl/i18n.utils.ts": {
          branches: 100,
          functions: 100,
          lines: 100,
          statements: 100,
        },
        "src/lib/_utils/**": {
          branches: 100,
          functions: 100,
          lines: 100,
          statements: 100,
        },
        statements: 100,
      },
    },
    deps: {
      interopDefault: true,
    },
    env: loadEnv("test", projectRoot, ""),
    environment: "node",
    exclude: ["node_modules/**", "dist/**", "build/**", "e2e/**", "src/integrations/drizzle-orm/migrations/**"],
    globals: true,
    isolate: true,
    passWithNoTests: false,
    pool: "threads",
    projects: [
      {
        extends: true,
        test: {
          environment: "node",
          exclude: ["src/**/*.component.test.{ts,tsx}", "src/**/*.integration.test.{ts,tsx}"],
          include: ["src/**/*.{test,spec}.{ts,tsx}", "src/**/__test__/**/*.{test,spec}.{ts,tsx}"],
          name: "node",
        },
      },
      {
        extends: true,
        test: {
          environment: "node",
          hookTimeout: 20_000,
          include: ["src/**/*.integration.test.{ts,tsx}"],
          name: "integration",
          testTimeout: 20_000,
        },
      },
      {
        extends: true,
        test: {
          environment: "jsdom",
          include: ["src/**/*.component.test.{ts,tsx}"],
          name: "component",
        },
      },
    ],
    server: {
      deps: {
        inline: ["better-auth"],
      },
    },
    setupFiles: ["@testing-library/jest-dom/vitest", "src/platform/testing/setup.ts"],
  },
})
