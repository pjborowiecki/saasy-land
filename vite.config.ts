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
  "tests/mocks",
  "bun.lock",
  "**/*.d.ts",
  "**/*.tsbuildinfo",
  "src/types/env.d.ts",
  "src/integrations/next-intl/*.d.json.ts",
  "src/integrations/drizzle-orm/migrations/**",
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
          elementNamePattern: ["~/src/environment", "~/src/environment/**"],
          groupName: "environment",
        },
        {
          elementNamePattern: ["~/src/constants", "~/src/constants/**"],
          groupName: "constants",
        },
        {
          elementNamePattern: ["~/src/providers/**"],
          groupName: "providers",
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
          elementNamePattern: ["~/src/hooks/**"],
          groupName: "hooks",
        },
        {
          elementNamePattern: ["~/src/components/shadcn/**"],
          groupName: "components-shadcn",
        },
        {
          elementNamePattern: ["~/src/components/custom/**"],
          groupName: "components-custom",
        },
        {
          elementNamePattern: ["~/src/components", "~/src/components/**"],
          groupName: "components-other",
        },
        {
          elementNamePattern: ["~/src/styles", "~/src/styles/**"],
          groupName: "styles",
        },
      ],
      groups: [
        "server-only",
        { newlinesBetween: true },
        "react-and-next",
        ["builtin", "external"],
        "environment",
        "constants",
        "providers",
        "integrations",
        "lib",
        "hooks",
        "components-shadcn",
        "components-custom",
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
      stylesheet: "./src/styles/globals.css",
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
        files: ["src/components/shadcn/label.tsx"],
        rules: {
          "jsx-a11y/label-has-associated-control": "off",
        },
      },
      {
        files: ["src/integrations/next-intl/i18n.formats.ts"],
        rules: {
          "eslint/no-inline-comments": "off",
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
        files: ["tests/setup/vitest.setup.ts"],
        rules: {
          "import/no-nodejs-modules": "off",
          "vitest/no-hooks": "off",
          "vitest/require-hook": "off",
          "vitest/require-top-level-describe": "off",
        },
      },
      {
        files: [
          "src/integrations/better-auth/__test__/auth._server.test.ts",
          "src/integrations/better-auth/__test__/auth.errors.test.ts",
          "tests/component/providers.component.test.tsx",
          "tests/component/locale-switch.component.test.tsx",
          "tests/component/theme-switch-branches.component.test.tsx",
          "tests/component/data-table-coverage.component.test.tsx",
          "tests/component/auth-forms.component.test.tsx",
          "tests/integration/next-intl/i18n-utils.integration.test.ts",
        ],
        rules: {
          "typescript/no-unsafe-type-assertion": "off",
        },
      },
      {
        files: [
          "src/lib/_utils/__test__/email.test.ts",
          "tests/component/locale-switch.component.test.tsx",
          "tests/component/theme-switch-branches.component.test.tsx",
          "tests/component/data-table-coverage.component.test.tsx",
        ],
        rules: {
          "unicorn/no-null": "off",
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
      "@wrksz/themes/client": resolve(projectRoot, "tests/mocks/wrksz-themes.ts"),
      "@wrksz/themes/next": resolve(projectRoot, "tests/mocks/wrksz-themes.ts"),
      bun: resolve(projectRoot, "tests/mocks/bun.ts"),
      "next/font/google": resolve(projectRoot, "tests/mocks/next-font-google.ts"),
      "next/navigation": resolve(projectRoot, "tests/mocks/next-navigation.ts"),
    },
    coverage: {
      clean: true,
      exclude: [
        "**/*.{test,spec}.{ts,tsx}",
        "**/*.d.ts",
        "**/migrations/**",
        "src/app/**",
        "src/components/shadcn/**",
        "src/constants/types.ts",
        "src/integrations/drizzle-orm/migrations/**",
        "src/integrations/fumadocs/**",
        "src/integrations/next-intl/*.d.json.ts",
        "src/integrations/next-intl/messages/**",
        "src/modules/**/*.types.ts",
        "src/providers/translations-provider.tsx",
        "src/styles/**",
        "src/types/**",
        "tests/**",
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
        statements: 100,
      },
    },
    deps: {
      interopDefault: true,
    },
    environment: "node",
    exclude: ["node_modules/**", ".next/**", "dist/**", "build/**", "e2e/**", "opensrc/**", "src/integrations/drizzle-orm/migrations/**"],
    globals: true,
    isolate: true,
    passWithNoTests: false,
    pool: "threads",
    projects: [
      {
        extends: true,
        test: {
          environment: "node",
          include: ["src/**/*.{test,spec}.{ts,tsx}", "src/**/__test__/**/*.{test,spec}.{ts,tsx}"],
          name: "node",
        },
      },
      {
        extends: true,
        test: {
          environment: "node",
          hookTimeout: 20_000,
          include: ["tests/integration/**/*.{test,spec}.{ts,tsx}"],
          name: "integration",
          testTimeout: 20_000,
        },
      },
      {
        extends: true,
        test: {
          environment: "jsdom",
          include: ["tests/component/**/*.{test,spec}.{ts,tsx}"],
          name: "component",
        },
      },
    ],
    server: {
      deps: {
        inline: ["next-intl"],
      },
    },
    setupFiles: ["./tests/setup/vitest.setup.ts"],
  },
})
