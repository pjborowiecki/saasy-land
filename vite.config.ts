import { resolve } from "node:path"
import { defineConfig } from "vite-plus"

const projectRoot = import.meta.dirname

const ignorePatterns = [
  "node_modules",
  ".next",
  ".source",
  "dist",
  "build",
  "opensrc",
  "scripts",
  "e2e",
  "coverage",
  "playwright-report",
  "test-results",
  "blob-report",
  "graphify-out",
  ".vite-hooks",
  ".vscode",
  ".agents",
  "src/platform/testing/mocks",
  "src/presentation/providers/__test__/mocks",
  "src/integrations/next-intl/__test__/mocks",
  "bun.lock",
  "**/*.d.ts",
  "**/*.tsbuildinfo",
  "src/types/env.d.ts",
  "src/integrations/next-intl/*.d.json.ts",
  "src/platform/db/migrations/**",
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
          elementNamePattern: ["server-only"],
          groupName: "server-only",
          modifiers: ["side_effect"],
        },
        {
          elementNamePattern: ["react", "react/**", "next", "next/**"],
          groupName: "react-and-next",
        },
        {
          elementNamePattern: ["~/src/platform/env", "~/src/platform/env/**"],
          groupName: "environment",
        },
        {
          elementNamePattern: ["~/src/platform/**"],
          groupName: "platform",
        },
        {
          elementNamePattern: ["~/src/modules/**"],
          groupName: "modules",
        },
        {
          elementNamePattern: ["~/src/presentation/providers/**"],
          groupName: "providers",
        },
        {
          elementNamePattern: ["~/src/integrations/**"],
          groupName: "integrations",
        },
        {
          elementNamePattern: ["~/src/presentation/utils", "~/src/presentation/utils/**"],
          groupName: "presentation-utils",
        },
        {
          elementNamePattern: ["~/src/hooks/**"],
          groupName: "hooks",
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
          elementNamePattern: ["~/src/presentation/styles/**"],
          groupName: "styles",
        },
      ],
      groups: [
        "server-only",
        { newlinesBetween: true },
        "react-and-next",
        ["builtin", "external"],
        "environment",
        "platform",
        "modules",
        "providers",
        "integrations",
        "presentation-utils",
        "hooks",
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
    trailingComma: "all",
    useTabs: false,
  },
  lint: {
    categories: {
      correctness: "error",
      pedantic: "error",
      perf: "error",
      style: "error",
      suspicious: "error",
    },
    ignorePatterns,
    options: {
      denyWarnings: true,
      reportUnusedDisableDirectives: "error",
      typeAware: true,
      typeCheck: true,
    },
    overrides: [
      {
        files: ["vite.config.ts"],
        rules: {
          "import/no-nodejs-modules": "off",
        },
      },
      {
        files: ["src/presentation/components/shadcn/label.tsx"],
        rules: {
          "jsx-a11y/label-has-associated-control": "off",
        },
      },
      {
        files: ["src/integrations/next-intl/i18n.utils.ts"],
        rules: {
          "import/no-nodejs-modules": "off",
        },
      },
      {
        files: ["e2e/**/*.{ts,tsx}"],
        rules: {
          "vitest/consistent-test-filename": "off",
          "vitest/prefer-expect-assertions": "off",
          "vitest/prefer-importing-vitest-globals": "off",
          "vitest/prefer-to-be-falsy": "off",
          "vitest/prefer-to-be-truthy": "off",
          "vitest/valid-title": "off",
        },
      },
      {
        files: ["src/platform/testing/vitest.setup.ts"],
        rules: {
          "import/no-nodejs-modules": "off",
          "vitest/no-hooks": "off",
          "vitest/require-hook": "off",
          "vitest/require-top-level-describe": "off",
        },
      },
      {
        files: ["src/modules/*/domain/**/*.{ts,tsx}", "src/modules/shared-kernel/domain/**/*.{ts,tsx}"],
        rules: {
          "no-restricted-imports": [
            "error",
            {
              patterns: [
                {
                  group: [
                    "react",
                    "react/**",
                    "next",
                    "next/**",
                    "drizzle-orm",
                    "drizzle-orm/**",
                    "~/src/app/**",
                    "~/src/presentation/**",
                    "~/src/platform/**",
                    "~/src/integrations/**",
                    "~/src/modules/*/infrastructure/**",
                    "~/src/modules/*/application/**",
                  ],
                  message: "Domain may only import shared-kernel domain and same-context domain code.",
                },
              ],
            },
          ],
        },
      },
      {
        files: ["src/modules/*/application/**/*.{ts,tsx}", "src/modules/shared-kernel/application/**/*.{ts,tsx}"],
        rules: {
          "no-restricted-imports": [
            "error",
            {
              patterns: [
                {
                  group: [
                    "react",
                    "react/**",
                    "next",
                    "next/**",
                    "drizzle-orm",
                    "drizzle-orm/**",
                    "~/src/app/**",
                    "~/src/presentation/**",
                    "~/src/platform/**",
                    "~/src/integrations/**",
                    "~/src/modules/*/infrastructure/**",
                  ],
                  message: "Application may only import domain, shared-kernel, and own application ports.",
                },
              ],
            },
          ],
        },
      },
      {
        files: ["src/presentation/**/*.{ts,tsx}"],
        rules: {
          "no-restricted-imports": [
            "error",
            {
              paths: [
                {
                  message: "Import from `~/src/integrations/next-intl/i18n.navigation` instead.",
                  name: "next/link",
                },
                {
                  importNames: ["redirect", "permanentRedirect", "useRouter", "usePathname"],
                  message: "Import from `~/src/integrations/next-intl/i18n.navigation` instead.",
                  name: "next/navigation",
                },
              ],
              patterns: [
                {
                  group: ["drizzle-orm", "drizzle-orm/**", "~/src/modules/*/infrastructure/**", "~/src/platform/db/**"],
                  message: "Presentation must call application use cases, not infrastructure or Drizzle.",
                },
              ],
            },
          ],
        },
      },
    ],
    plugins: ["typescript", "react", "react-perf", "jsx-a11y", "unicorn", "import", "promise", "vitest", "oxc", "eslint"],
    rules: {
      "capitalized-comments": "off",
      "consistent-return": "off",
      "eslint/no-magic-numbers": [
        "error",
        {
          ignore: [0],
          ignoreArrayIndexes: true,
          ignoreDefaultValues: true,
          ignoreTypeIndexes: true,
        },
      ],
      "func-style": "off",
      "id-length": "off",
      "import/consistent-type-specifier-style": "off",
      "import/exports-last": "off",
      "import/group-exports": "off",
      "import/max-dependencies": "off",
      "import/no-named-export": "off",
      "import/no-namespace": "off",
      "import/no-unassigned-import": "off",
      "import/prefer-default-export": "off",
      "max-lines": ["error", { max: 800 }],
      "max-lines-per-function": ["error", { max: 150 }],
      "max-statements": ["error", { max: 20 }],
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              message: "Import from `~/src/integrations/next-intl/i18n.navigation` instead.",
              name: "next/link",
            },
            {
              importNames: ["redirect", "permanentRedirect", "useRouter", "usePathname"],
              message: "Import from `~/src/integrations/next-intl/i18n.navigation` instead.",
              name: "next/navigation",
            },
          ],
        },
      ],
      "no-ternary": "off",
      "prefer-arrow-callback": "off",
      "react/jsx-max-depth": ["error", { max: 5 }],
      "react/jsx-props-no-spreading": "off",
      "react/react-in-jsx-scope": "off",
      "sort-imports": "off",
      "typescript/no-explicit-any": "error",
      "typescript/no-floating-promises": "error",
      "typescript/no-misused-promises": [
        "error",
        {
          checksVoidReturn: {
            arguments: true,
            attributes: false,
            properties: true,
            returns: true,
            variables: true,
          },
        },
      ],
      "typescript/no-unsafe-argument": "error",
      "typescript/no-unsafe-assignment": "error",
      "typescript/no-unsafe-call": "error",
      "typescript/no-unsafe-member-access": "error",
      "typescript/no-unsafe-return": "error",
      "typescript/no-unsafe-type-assertion": "error",
      "typescript/prefer-nullish-coalescing": "error",
      "typescript/prefer-readonly-parameter-types": "off",
      "typescript/strict-boolean-expressions": "error",
      "typescript/strict-void-return": "off",
      "vitest/prefer-importing-vitest-globals": "off",
      "vitest/prefer-to-be-falsy": "off",
      "vitest/prefer-to-be-truthy": "off",
      "vitest/valid-title": "error",
    },
  },
  oxc: {
    jsx: {
      runtime: "automatic",
    },
  },
  resolve: { tsconfigPaths: true },
  staged: {
    "*": "vp check --fix",
  },
  test: {
    alias: {
      "@wrksz/themes/client": resolve(projectRoot, "src/presentation/providers/__test__/mocks/wrksz-themes.ts"),
      "@wrksz/themes/next": resolve(projectRoot, "src/presentation/providers/__test__/mocks/wrksz-themes.ts"),
      bun: resolve(projectRoot, "src/platform/testing/mocks/bun.ts"),
      "next/font/google": resolve(projectRoot, "src/platform/testing/mocks/next-font-google.ts"),
      "next/navigation": resolve(projectRoot, "src/platform/testing/mocks/next-navigation.ts"),
    },
    coverage: {
      clean: true,
      exclude: [
        "**/*.{test,spec}.{ts,tsx}",
        "**/__test__/**",
        "**/*.d.ts",
        "**/migrations/**",
        "src/app/**",
        "src/presentation/components/shadcn/**",
        "src/platform/db/migrations/**",
        "src/integrations/fumadocs/**",
        "src/integrations/next-intl/*.d.json.ts",
        "src/integrations/next-intl/messages/**",
        "src/presentation/providers/translations-provider.tsx",
        "src/presentation/styles/**",
        "src/types/**",
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
        "src/integrations/next-intl/i18n.locale.ts": {
          branches: 100,
          functions: 100,
          lines: 100,
          statements: 100,
        },
        "src/integrations/next-intl/i18n.utils.ts": {
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
        "src/modules/identity-access/infrastructure/auth/auth.access.ts": {
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
    environment: "node",
    exclude: ["node_modules/**", ".next/**", "dist/**", "build/**", "e2e/**", "opensrc/**", "src/platform/db/migrations/**"],
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
        inline: ["next-intl"],
      },
    },
    setupFiles: ["./src/platform/testing/vitest.setup.ts"],
  },
})
