---
name: tanstack-cli
description: Project scaffolding CLI with 30+ integrations, custom templates, and MCP server for AI agents.
---


## Overview

TanStack CLI is an interactive scaffolding tool for creating TanStack Start applications. It provides guided project creation with 30+ pre-built integrations covering authentication, databases, deployment, and developer tools. It also includes an MCP (Model Context Protocol) server for AI agent assistance and supports custom templates for team-standardized setups.

**Package:** `@tanstack/cli`
**Status:** Stable

## Installation & Usage

```bash
# Create a new project (interactive)
npx @tanstack/cli create my-app

# Create with specific integrations
npx @tanstack/cli create my-app --integrations tanstack-query,clerk,drizzle

# Global install
npm install -g @tanstack/cli
tanstack create my-app
```

## Project Creation

### Interactive Mode

```bash
npx @tanstack/cli create my-app
# Prompts for:
# - Project name
# - Integration selection
# - Configuration options
```

### With Integrations Flag

```bash
# Multiple integrations
npx @tanstack/cli create my-app --integrations tanstack-query,tanstack-form,drizzle,neon,clerk

# Deployment target
npx @tanstack/cli create my-app --integrations vercel

# Full stack setup
npx @tanstack/cli create my-app --integrations tanstack-query,tanstack-form,tanstack-table,clerk,drizzle,neon,vercel,sentry
```

## Available Integrations

### TanStack Libraries

| Integration | Description |
|-------------|-------------|
| `tanstack-query` | Async state management |
| `tanstack-form` | Type-safe form management |
| `tanstack-table` | Headless table/datagrid |
| `tanstack-store` | Reactive data store |
| `tanstack-virtual` | List virtualization |
| `tanstack-ai` | AI SDK integration |
| `tanstack-db` | Client-side database |
| `tanstack-pacer` | Debouncing/throttling utilities |

### Authentication

| Integration | Description |
|-------------|-------------|
| `clerk` | Clerk authentication |
| `better-auth` | Better Auth integration |
| `workos` | WorkOS identity management |

### Databases & ORMs

| Integration | Description |
|-------------|-------------|
| `drizzle` | Drizzle ORM |
| `prisma` | Prisma ORM |
| `neon` | Neon serverless Postgres |
| `convex` | Convex backend platform |

### Deployment

| Integration | Description |
|-------------|-------------|
| `vercel` | Vercel deployment |
| `netlify` | Netlify deployment |
| `cloudflare` | Cloudflare Workers/Pages |
| `nitro` | Nitro server engine |

### Developer Tools

| Integration | Description |
|-------------|-------------|
| `eslint` | ESLint configuration |
| `biome` | Biome linting/formatting |
| `shadcn-ui` | shadcn/ui component library |
| `storybook` | Storybook component development |

### API & Backend

| Integration | Description |
|-------------|-------------|
| `trpc` | tRPC type-safe API |
| `orpc` | oRPC integration |

### Services

| Integration | Description |
|-------------|-------------|
| `sentry` | Error monitoring |
| `paraglide` | Internationalization (i18n) |
| `strapi` | Strapi CMS |

## Custom Templates

### Creating a Template

```bash
# Create a project as a template base
npx @tanstack/cli create my-template --integrations tanstack-query,drizzle,clerk

# Share as a git repository or npm package
```

### Using a Custom Template

```bash
# From git repository
npx @tanstack/cli create my-app --template https://github.com/myorg/my-template

# From local path
npx @tanstack/cli create my-app --template ./templates/my-template
```

### Template Structure

```
my-template/
├── template.config.ts    # Template configuration
├── src/
│   ├── app/
│   │   ├── routes/
│   │   └── components/
│   └── lib/
├── package.json
├── tsconfig.json
├── app.config.ts
└── vite.config.ts
```

## MCP Server

The TanStack CLI includes an MCP (Model Context Protocol) server for AI agent integration.

### Capabilities

- **Documentation Search** - AI agents can query TanStack documentation
- **Project Scaffolding** - Guided project creation through AI assistants
- **Integration Discovery** - Search and recommend integrations
- **Deployment Guidance** - Platform-specific deployment help

### Usage with Claude

The MCP server enables Claude and other AI assistants to:
- Search TanStack docs for accurate, up-to-date information
- Help scaffold new projects with appropriate integrations
- Provide context-aware recommendations
- Assist with configuration and deployment

### Configuration

```json
// .claude/mcp.json or equivalent
{
  "mcpServers": {
    "tanstack": {
      "command": "npx",
      "args": ["@tanstack/cli", "mcp"]
    }
  }
}
```

## Generated Project Structure

A typical generated project looks like:

```
my-app/
├── src/
│   ├── app/
│   │   ├── routes/
│   │   │   ├── __root.tsx
│   │   │   └── index.tsx
│   │   ├── router.tsx
│   │   ├── routeTree.gen.ts
│   │   └── client.tsx
│   ├── lib/
│   │   ├── db.ts          # (if drizzle/prisma)
│   │   ├── auth.ts        # (if clerk/better-auth)
│   │   └── query.ts       # (if tanstack-query)
│   └── components/
├── app.config.ts
├── vite.config.ts
├── package.json
├── tsconfig.json
└── .env.example
```

## Web Builder Interface

TanStack CLI also provides an interactive web-based builder:

- Visual technology stack selection
- Preview generated files before exporting
- Integration compatibility checking
- One-click project generation

## CLI Commands Reference

| Command | Description |
|---------|-------------|
| `create <name>` | Create a new project |
| `create <name> --integrations <list>` | Create with specific integrations |
| `create <name> --template <path>` | Create from template |
| `mcp` | Start the MCP server |

## Best Practices

1. **Start with minimal integrations** - add more as needed rather than including everything upfront
2. **Use the `--integrations` flag** for reproducible project creation in CI/docs
3. **Create team templates** for consistent project structure across your organization
4. **Use the MCP server** with AI assistants for guided setup
5. **Check `.env.example`** after generation for required environment variables
6. **Review generated code** before adding business logic - understand the scaffold
7. **Use deployment integrations** to pre-configure hosting platform settings
8. **Combine auth + db integrations** for full-stack auth scaffolding (e.g., `clerk,drizzle,neon`)

## Common Pitfalls

- Not setting up environment variables after project creation (check `.env.example`)
- Selecting incompatible integration combinations
- Not running `npm install` / `pnpm install` after generation
- Forgetting to initialize the database when using Drizzle/Prisma integrations
- Not configuring the deployment platform's environment variables
- Using outdated CLI version (always use `npx @tanstack/cli` for latest)
