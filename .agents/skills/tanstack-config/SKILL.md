---
name: tanstack-config
description: Opinionated toolkit for building, versioning, and publishing high-quality JavaScript/TypeScript packages.
---


## Overview

TanStack Config provides an opinionated, minimal-configuration toolkit for JavaScript/TypeScript package development. It includes Vite-powered build configuration, ESLint presets, publish automation with semantic versioning, and integrations with TypeScript, Prettier, Changesets, and GitHub Actions. Designed for monorepo workflows with pnpm and Nx.

**Package:** `@tanstack/config`
**Status:** Stable

## Installation

```bash
npm install @tanstack/config --save-dev
# or
pnpm add @tanstack/config -D
```

## Vite Build Configuration

### Basic Setup

```typescript
// vite.config.ts
import { defineConfig, mergeConfig } from 'vitest/config'
import { tanstackViteConfig } from '@tanstack/config/vite'

const config = defineConfig({
  // Your custom Vite config
})

export default mergeConfig(
  config,
  tanstackViteConfig({
    entry: './src/index.ts',
    srcDir: './src',
    exclude: ['./src/__tests__'],
  })
)
```

### Multiple Entry Points

```typescript
import { tanstackViteConfig } from '@tanstack/config/vite'

export default tanstackViteConfig({
  entry: [
    './src/index.ts',
    './src/adapters.ts',
    './src/utils.ts',
  ],
  srcDir: './src',
})
```

### Build Options

```typescript
tanstackViteConfig({
  entry: './src/index.ts',
  srcDir: './src',
  exclude: ['./src/__tests__', './src/**/*.test.ts'],
  // Generates ESM and CJS outputs
  // Generates .d.ts declaration files
  // Handles tree-shaking configuration
})
```

## ESLint Configuration

### Basic Setup

```javascript
// eslint.config.js
import { tanstackEslintConfig } from '@tanstack/config/eslint'

export default tanstackEslintConfig
```

### Extending the Config

```javascript
// eslint.config.js
import { tanstackEslintConfig } from '@tanstack/config/eslint'

export default [
  ...tanstackEslintConfig,
  {
    rules: {
      // Custom overrides
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
]
```

## Publishing

### Publish Configuration

```typescript
// publish.config.ts or used via CLI
import { tanstackPublishConfig } from '@tanstack/config/publish'

export default tanstackPublishConfig({
  // Publint-compliant defaults
  // Semantic versioning automation
  // Changelog generation
})
```

### Package.json Setup

```json
{
  "name": "@myorg/my-package",
  "version": "0.0.0",
  "type": "module",
  "main": "dist/cjs/index.cjs",
  "module": "dist/esm/index.js",
  "types": "dist/esm/index.d.ts",
  "exports": {
    ".": {
      "import": {
        "types": "./dist/esm/index.d.ts",
        "default": "./dist/esm/index.js"
      },
      "require": {
        "types": "./dist/cjs/index.d.cts",
        "default": "./dist/cjs/index.cjs"
      }
    }
  },
  "files": ["dist", "src"],
  "scripts": {
    "build": "vite build",
    "lint": "eslint .",
    "test": "vitest"
  }
}
```

## TypeScript Configuration

### tsconfig.json

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

## Changesets Integration

### Setup

```bash
npx changeset init
```

### Creating a Changeset

```bash
npx changeset
# Interactive prompt: select packages, bump type, summary
```

### Changeset Config

```json
// .changeset/config.json
{
  "$schema": "https://unpkg.com/@changesets/config@3.0.0/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch"
}
```

## GitHub Actions Workflow

### CI/CD Pipeline

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm build
      - run: pnpm lint
      - run: pnpm test
```

### Publish Workflow

```yaml
# .github/workflows/publish.yml
name: Publish

on:
  push:
    branches: [main]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          registry-url: 'https://registry.npmjs.org'
      - run: pnpm install
      - run: pnpm build
      - name: Create Release Pull Request or Publish
        uses: changesets/action@v1
        with:
          publish: pnpm publish -r
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Monorepo Setup (pnpm + Nx)

### Workspace Configuration

```yaml
# pnpm-workspace.yaml
packages:
  - 'packages/*'
  - 'examples/*'
```

### Nx Configuration

```json
// nx.json
{
  "tasksRunnerOptions": {
    "default": {
      "runner": "nx/tasks-runners/default",
      "options": {
        "cacheableOperations": ["build", "lint", "test"]
      }
    }
  },
  "targetDefaults": {
    "build": {
      "dependsOn": ["^build"]
    }
  }
}
```

## Prettier Configuration

```json
// .prettierrc
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 80
}
```

## EditorConfig

```ini
# .editorconfig
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true
```

## Best Practices

1. **Use the Vite config for builds** - handles ESM/CJS dual output and declarations
2. **Use publint-compliant exports** in package.json for compatibility
3. **Use Changesets** for version management in monorepos
4. **Set `"type": "module"`** in package.json for ESM-first packages
5. **Include both `src` and `dist`** in `files` for source map debugging
6. **Use Nx caching** for faster builds in monorepos
7. **Always generate declaration files** (`.d.ts`) for TypeScript consumers
8. **Use the ESLint config** as a consistent baseline across packages
9. **Automate publishing** with GitHub Actions and Changesets

## Common Pitfalls

- Missing `exports` field in package.json (breaks modern bundlers)
- Not setting `"type": "module"` (causes ESM import issues)
- Forgetting declaration files in build output
- Not excluding test files from the build
- Publishing without running publint validation first
- Not configuring `moduleResolution: "bundler"` in tsconfig
- Inconsistent versioning across monorepo packages (use Changesets `linked`)
