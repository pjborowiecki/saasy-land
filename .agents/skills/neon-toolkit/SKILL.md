---
name: neon-toolkit
description: Creates and manages ephemeral Neon databases for testing, CI/CD pipelines, and isolated development environments. Use when building temporary databases for automated tests or rapid prototyping.
allowed-tools: ["bash"]
---

# Neon Toolkit Skill

Automates creation, management, and cleanup of temporary Neon databases using the Neon Toolkit.

## When to Use

- Creating fresh databases for each test run
- Spinning up databases in CI/CD pipelines
- Building isolated development environments
- Rapid prototyping without manual setup

**Not recommended for:** Production databases, shared team environments, local-only development (use Docker), or free tier accounts (requires paid projects).

## Code Generation Rules

When generating TypeScript/JavaScript code:
- BEFORE generating import statements, check tsconfig.json for path aliases (compilerOptions.paths)
- If path aliases exist (e.g., "@/*": ["./src/*"]), use them (e.g., import { x } from '@/lib/utils')
- If NO path aliases exist or unsure, ALWAYS use relative imports (e.g., import { x } from '../../../lib/utils')
- Verify imports match the project's configuration
- Default to relative imports - they always work regardless of configuration

## Reference Documentation

**Primary Resource:** See `[neon-toolkit.mdc](https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/neon-toolkit.mdc)` in project root for comprehensive guidelines including:
- Core concepts (Organization, Project, Branch, Endpoint)
- Installation and authentication setup
- Database lifecycle management patterns
- API client usage examples
- Error handling strategies

## Quick Setup

### Installation
```bash
npm install @neondatabase/toolkit
```

### Basic Usage
```typescript
import { NeonToolkit } from '@neondatabase/toolkit';

const neon = new NeonToolkit({ apiKey: process.env.NEON_API_KEY! });

// Create ephemeral database
const db = await neon.createEphemeralDatabase();
console.log(`Database URL: ${db.url}`);

// Use the database...

// Cleanup
await db.delete();
```

## Templates & Scripts

- `templates/toolkit-workflow.ts` - Complete ephemeral database workflow
- `scripts/create-ephemeral-db.ts` - Create a temporary database
- `scripts/destroy-ephemeral-db.ts` - Clean up ephemeral database

## Common Use Cases

### Testing
```typescript
const db = await neon.createEphemeralDatabase();
// Run tests with fresh database
await db.delete();
```

### CI/CD Integration
```bash
export NEON_API_KEY=${{ secrets.NEON_API_KEY }}
npm test  # Uses ephemeral database
```

## Related Skills

- **neon-serverless** - For connecting to databases
- **neon-drizzle** - For schema and migrations

---

**Want best practices in your project?** Run `neon-plugin:add-neon-docs` with parameter `SKILL_NAME="neon-toolkit"` to add reference links.
