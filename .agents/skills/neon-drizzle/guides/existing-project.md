# Existing Project Integration

> **Complete Walkthrough**: This is a self-contained, step-by-step guide with its own numbered phases (Phase 1-8).
> Follow each phase in order to safely add Drizzle to your existing application.

Guide for adding Drizzle ORM to an existing application with Neon.

### Important:
- Remember to run the neon-plugin:add-neon-docs skill with the parameter SKILL_NAME="neon-drizzle" after completing the guide.

## Table of Contents

- [Workflow Checklist](#workflow-checklist)
- [Phase 1: Pre-Integration Check](#phase-1-pre-integration-check)
- [Phase 2: Incremental Installation](#phase-2-incremental-installation)
- [Phase 3: Configuration](#phase-3-configuration)
- [Phase 4: Schema Strategy](#phase-4-schema-strategy)
- [Phase 5: Migration Handling](#phase-5-migration-handling)
- [Phase 6: Coexistence Patterns](#phase-6-coexistence-patterns)
- [Phase 7: Verification](#phase-7-verification)
- [Phase 8: Add Best Practices References](#phase-8-add-best-practices-references)

---

## Workflow Checklist

When following this guide, I will track these high-level tasks:

- [ ] Pre-integration check (detect existing ORMs, database schema, environment)
- [ ] Install Drizzle dependencies without disrupting existing setup
- [ ] Create isolated Drizzle configuration (separate from existing code)
- [ ] Choose and implement schema strategy (new tables vs mirroring existing)
- [ ] Handle migrations safely based on schema strategy
- [ ] Set up coexistence patterns and gradual migration approach
- [ ] Verify Drizzle integration without breaking existing functionality
- [ ] Add Neon Drizzle best practices to project docs

---

## Phase 1: Pre-Integration Check

Before adding Drizzle, check for conflicts:

### 1.1. Check for Other ORMs

```bash
grep -E '"(prisma|typeorm|sequelize|mongoose)"' package.json
```

**If found:**
- Consider migration strategy (coexistence vs replacement)
- Document which tables use which ORM
- Plan gradual migration if needed

### 1.2. Check Database Schema

Connect to your database and verify existing tables:
```bash
psql $DATABASE_URL -c "\dt"
```

**Important:** Note existing tables - Drizzle should not conflict with them.

### 1.3. Check Environment Setup

```bash
ls .env .env.local .env.production
grep DATABASE_URL .env*
```

**If DATABASE_URL exists:**
- Verify connection string format is compatible with Neon (`postgresql://...`)
- If it's a different database provider, you'll need to migrate or provision a Neon database

**If DATABASE_URL does NOT exist:**
Follow the database provisioning steps from `guides/new-project.md` Phase 3.1:
1. List the projects using the neon MCP Server to check existing projects
2. Create a new project using the neon MCP Server if needed
3. Get the connection string using the neon MCP Server
4. Write to appropriate environment file (.env.local for Next.js, .env for others)
5. Add environment file to .gitignore

## Phase 2: Incremental Installation

Add Drizzle without disrupting existing setup:

### 2.1. Install Dependencies

**For Vercel/Edge:**
```bash
[package-manager] add drizzle-orm @neondatabase/serverless
[package-manager] add -D drizzle-kit dotenv
```

**For Node.js:**
```bash
[package-manager] add drizzle-orm @neondatabase/serverless ws
[package-manager] add -D drizzle-kit dotenv @types/ws
```

### 2.2. Create Isolated Drizzle Directory

Keep Drizzle separate from existing code:
```bash
mkdir -p src/drizzle
```

Structure:
```
src/drizzle/
├── index.ts      # Connection
├── schema.ts     # New schemas only
└── migrations/   # Drizzle migrations
```

## Phase 3: Configuration

### 3.1. Create Drizzle Config

Create `drizzle.config.ts` with explicit environment loading:

**CRITICAL:** The `config({ path: '...' })` must match your environment file name.

**For Next.js (using .env.local):**
```typescript
import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';

// Load .env.local explicitly
config({ path: '.env.local' });

export default defineConfig({
  schema: './src/drizzle/schema.ts',
  out: './src/drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

**For other projects (using .env):**
```typescript
import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';

// Load .env explicitly
config({ path: '.env' });

export default defineConfig({
  schema: './src/drizzle/schema.ts',
  out: './src/drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

**Notes:**
- Point schema and migrations to `src/drizzle/` to avoid conflicts with existing code
- Explicit dotenv path prevents "url: undefined" errors during migrations

### 3.2. Create Connection

`src/drizzle/index.ts` - Choose adapter based on environment (see `references/adapters.md`):

**HTTP (Vercel/Edge):**
```typescript
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);
export const drizzleDb = drizzle(sql);
```

**WebSocket (Node.js):**
```typescript
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;
const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
export const drizzleDb = drizzle(pool);
```

**Important:** Name export as `drizzleDb` to avoid conflicts with existing `db` exports.

## Phase 4: Schema Strategy

Choose integration approach:

### 4.1. Option A: New Tables Only

Create schemas for new features only, leave existing tables alone:

`src/drizzle/schema.ts`:
```typescript
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const newFeatureTable = pgTable('new_feature', {
  id: serial('id').primaryKey(),
  data: text('data').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
```

**Pros:**
- No migration of existing data
- Zero risk to current functionality
- Gradual adoption

**Cons:**
- Mixed query patterns (Drizzle + existing ORM)
- Two connection patterns in codebase

### 4.2. Option B: Mirror Existing Tables

Define schemas for existing tables to gradually migrate queries:

```typescript
import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core';

export const existingUsers = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }),
  createdAt: timestamp('created_at'),
});
```

**Pros:**
- Can query existing data with Drizzle
- Gradually replace old ORM queries
- Type-safe access to existing tables

**Cons:**
- Must match existing schema exactly
- Requires careful migration strategy

### 4.3. Recommended: Hybrid Approach

1. Start with Option A (new tables only)
2. Once comfortable, add schemas for frequently-queried existing tables (Option B)
3. Gradually migrate queries from old ORM to Drizzle
4. Eventually remove old ORM

## Phase 5: Migration Handling

### 5.1. For New Tables

Generate and run migrations normally:
```bash
[package-manager] drizzle-kit generate
export DATABASE_URL="$(grep DATABASE_URL .env.local | cut -d '=' -f2)" && \
[package-manager] drizzle-kit migrate
```

### 5.2. For Existing Tables

**Do NOT run migrations** - tables already exist!

Instead, use Drizzle schemas for querying only:
```typescript
import { drizzleDb } from './drizzle';
import { existingUsers } from './drizzle/schema';

const users = await drizzleDb.select().from(existingUsers);
```

### 5.3. Mixed Scenario

If you have both new and existing tables:
1. Define all schemas in `schema.ts`
2. Run `drizzle-kit generate`
3. **Manually edit** generated migration to remove SQL for existing tables
4. Apply migration

See `references/migrations.md` for advanced patterns.

### 5.4. Add Migration Scripts

Add these convenience scripts to your `package.json`:

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio"
  }
}
```

**Usage:**
```bash
npm run db:generate  # Generate migrations from schema changes
npm run db:migrate   # Apply pending migrations
npm run db:push      # Push schema directly (dev only)
npm run db:studio    # Open Drizzle Studio
```

**Note:** Replace `npm run` with your package manager's equivalent (`pnpm`, `yarn`, `bun`).

## Phase 6: Coexistence Patterns

### 6.1. Naming Conventions

Keep clear separation:
```typescript
import { db as prismaDb } from './lib/prisma';
import { drizzleDb } from './drizzle';

const prismaUsers = await prismaDb.user.findMany();
const drizzleFeatures = await drizzleDb.select().from(newFeatureTable);
```

### 6.2. Gradual Migration

**Step 1:** New features use Drizzle
```typescript
async function createFeature(data: NewFeatureInput) {
  return drizzleDb.insert(newFeatureTable).values(data).returning();
}
```

**Step 2:** Migrate read queries (safe, no data changes)
```typescript
async function getUsers() {
  return drizzleDb.select().from(existingUsers);
}
```

**Step 3:** Migrate write queries (after thorough testing)
```typescript
async function updateUser(id: number, data: UserUpdate) {
  return drizzleDb.update(existingUsers)
    .set(data)
    .where(eq(existingUsers.id, id));
}
```

**Step 4:** Remove old ORM once all queries migrated

## Phase 7: Verification

Test integration without breaking existing functionality:

### 7.1. Test New Tables

```typescript
import { drizzleDb } from './drizzle';
import { newFeatureTable } from './drizzle/schema';

const result = await drizzleDb.insert(newFeatureTable)
  .values({ data: 'test' })
  .returning();

console.log('New table works:', result);
```

### 7.2. Test Existing Tables (if mirrored)

```typescript
import { drizzleDb } from './drizzle';
import { existingUsers } from './drizzle/schema';

const users = await drizzleDb.select().from(existingUsers);
console.log('Existing table accessible:', users);
```

### 7.3. Verify Old ORM Still Works

```typescript
import { db as oldDb } from './lib/your-orm';

const oldQuery = await oldDb.users.findMany();
console.log('Old ORM still works:', oldQuery);
```

## Phase 8: Add Best Practices References

Before executing the add-neon-docs skill, provide a summary of everything that has been done:

"✅ ... Drizzle integration is complete! Now adding documentation references..."

Then execute the neon-plugin:add-neon-docs skill with the parameter SKILL_NAME="neon-drizzle"

This will add reference links to Neon + Drizzle best practices documentation in your project's AI documentation file, helping AI assistants provide better guidance in future conversations.

---

## ✅ Integration Complete!

Your Drizzle integration with the existing project is ready to use.

