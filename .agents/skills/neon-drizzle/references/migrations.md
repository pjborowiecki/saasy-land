# Migration Reference Guide

Complete guide for database migrations with Drizzle and Neon.

## Table of Contents

- [Migration Lifecycle](#migration-lifecycle)
- [Environment Loading Deep-Dive](#environment-loading-deep-dive)
- [Migration Patterns](#migration-patterns)
- [Advanced Patterns](#advanced-patterns)
- [Migration in CI/CD](#migration-in-cicd)
- [Common Migration Errors](#common-migration-errors)
- [Best Practices](#best-practices)
- [Related Resources](#related-resources)

---

## Migration Lifecycle

### 1. Schema Change

Update your schema file:
```typescript
// src/db/schema.ts
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull(),
  phoneNumber: varchar('phone_number', { length: 20 }), // NEW
});
```

### 2. Generate Migration

Run drizzle-kit to generate SQL:
```bash
npm run drizzle-kit generate
```

**What this does:**
- Compares schema.ts with database
- Generates SQL in migrations folder
- Creates migration metadata

**Output:**
```
src/db/migrations/
├── 0000_initial.sql
├── 0001_add_phone_number.sql
└── meta/
    ├── _journal.json
    └── 0001_snapshot.json
```

### 3. Review Migration

**Always review** generated SQL before applying:
```sql
-- 0001_add_phone_number.sql
ALTER TABLE users ADD COLUMN phone_number VARCHAR(20);
```

### 4. Apply Migration

Execute migration against database:
```bash
npm run drizzle-kit migrate
```

**Or with explicit env loading:**
```bash
export DATABASE_URL="$(grep DATABASE_URL .env.local | cut -d '=' -f2)" && \
npm run drizzle-kit migrate
```

## Environment Loading Deep-Dive

### Why Environment Loading Matters

**Problem:** drizzle-kit runs as separate process, may not inherit env vars.

**Symptom:**
```
Error: url is undefined in dbCredentials
```

### Solution 1: Config File Loading (Recommended)

**drizzle.config.ts:**
```typescript
import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';

config({ path: '.env.local' });

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

**Key:** `config({ path: '.env.local' })` loads before exporting config.

### Solution 2: Shell Export

**Bash/Zsh:**
```bash
export DATABASE_URL="$(grep DATABASE_URL .env.local | cut -d '=' -f2)" && \
npm run drizzle-kit migrate
```

**Fish:**
```fish
set -x DATABASE_URL (grep DATABASE_URL .env.local | cut -d '=' -f2)
npm run drizzle-kit migrate
```

**PowerShell:**
```powershell
$env:DATABASE_URL = (Select-String -Path .env.local -Pattern "DATABASE_URL").Line.Split("=")[1]
npm run drizzle-kit migrate
```

### Solution 3: NPM Scripts

**package.json:**
```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "dotenv -e .env.local -- drizzle-kit migrate",
    "db:push": "dotenv -e .env.local -- drizzle-kit push"
  }
}
```

**Install dotenv-cli:**
```bash
npm add -D dotenv-cli
```

### Solution 4: Programmatic Migration

**scripts/migrate.ts:**
```typescript
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import { config } from 'dotenv';

config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

await migrate(db, { migrationsFolder: './src/db/migrations' });
console.log('Migrations complete');
```

**Run:**
```bash
tsx scripts/migrate.ts
```

## Migration Patterns

### Initial Setup

**First migration creates all tables:**
```sql
-- 0000_initial.sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX posts_user_id_idx ON posts(user_id);
```

### Adding Columns

**Schema:**
```typescript
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull(),
  phoneNumber: varchar('phone_number', { length: 20 }), // NEW
});
```

**Generated:**
```sql
ALTER TABLE users ADD COLUMN phone_number VARCHAR(20);
```

### Dropping Columns

**Schema:**
```typescript
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull(),
  // removed: phoneNumber
});
```

**Generated:**
```sql
ALTER TABLE users DROP COLUMN phone_number;
```

**Warning:** Data loss! Back up first.

### Renaming Columns

**Problem:** Drizzle sees rename as drop + add (data loss).

**Schema:**
```typescript
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  fullName: varchar('full_name', { length: 255 }), // was 'name'
});
```

**Generated (WRONG):**
```sql
ALTER TABLE users DROP COLUMN name;
ALTER TABLE users ADD COLUMN full_name VARCHAR(255);
```

**Solution:** Manually edit migration:
```sql
-- Change to:
ALTER TABLE users RENAME COLUMN name TO full_name;
```

### Changing Column Types

**Schema:**
```typescript
export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  views: bigint('views', { mode: 'number' }), // was integer
});
```

**Generated:**
```sql
ALTER TABLE posts ALTER COLUMN views TYPE BIGINT;
```

**Caution:** May require data migration if types incompatible.

### Adding Indexes

**Schema:**
```typescript
export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
}, (table) => ({
  titleIdx: index('posts_title_idx').on(table.title), // NEW
}));
```

**Generated:**
```sql
CREATE INDEX posts_title_idx ON posts(title);
```

### Adding Foreign Keys

**Schema:**
```typescript
export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  postId: serial('post_id')
    .notNull()
    .references(() => posts.id), // NEW
  content: text('content').notNull(),
});
```

**Generated:**
```sql
ALTER TABLE comments
  ADD CONSTRAINT comments_post_id_fkey
  FOREIGN KEY (post_id) REFERENCES posts(id);
```

### Adding Constraints

**Unique:**
```typescript
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
});
```

**Generated:**
```sql
ALTER TABLE users ADD CONSTRAINT users_email_unique UNIQUE (email);
```

**Check:**
```typescript
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  price: integer('price').notNull(),
}, (table) => ({
  priceCheck: check('price_check', 'price >= 0'),
}));
```

**Generated:**
```sql
ALTER TABLE products ADD CONSTRAINT price_check CHECK (price >= 0);
```

## Advanced Patterns

### Data Migrations

**Scenario:** Add column with computed value from existing data.

**Step 1:** Generate migration:
```bash
npm run drizzle-kit generate
```

**Step 2:** Edit migration to add data transformation:
```sql
-- Add column
ALTER TABLE users ADD COLUMN full_name VARCHAR(255);

-- Populate with data
UPDATE users SET full_name = first_name || ' ' || last_name;

-- Make not null after population
ALTER TABLE users ALTER COLUMN full_name SET NOT NULL;
```

### Conditional Migrations

**Add IF NOT EXISTS for idempotency:**
```sql
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20);

CREATE INDEX IF NOT EXISTS posts_title_idx ON posts(title);
```

**Useful for:**
- Re-running migrations
- Partial deployments
- Development environments

### Multi-Step Migrations

**Scenario:** Rename with zero downtime.

**Migration 1 (Deploy this first):**
```sql
-- Add new column
ALTER TABLE users ADD COLUMN full_name VARCHAR(255);

-- Copy data
UPDATE users SET full_name = name;
```

**Application update:** Write to both `name` and `full_name`.

**Migration 2 (Deploy after apps updated):**
```sql
-- Make new column not null
ALTER TABLE users ALTER COLUMN full_name SET NOT NULL;

-- Drop old column
ALTER TABLE users DROP COLUMN name;
```

### Rollback Strategies

**Option 1: Down migrations (manual)**

Create reverse migration:
```sql
-- up.sql
ALTER TABLE users ADD COLUMN phone_number VARCHAR(20);

-- down.sql (create manually)
ALTER TABLE users DROP COLUMN phone_number;
```

**Option 2: Snapshot and restore**

**Before migration:**
```bash
pg_dump $DATABASE_URL > backup.sql
```

**If problems:**
```bash
psql $DATABASE_URL < backup.sql
```

**Option 3: Drizzle push (dev only)**

Reset to schema state:
```bash
npm run drizzle-kit push --force
```

**Warning:** Data loss in dev!

## Migration in CI/CD

### GitHub Actions Example

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Install dependencies
        run: npm ci

      - name: Run migrations
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
        run: npm run db:migrate

      - name: Deploy application
        run: npm run deploy
```

### Vercel Example

**vercel.json:**
```json
{
  "buildCommand": "npm run build && npm run db:migrate",
  "env": {
    "DATABASE_URL": "@database_url"
  }
}
```

**package.json:**
```json
{
  "scripts": {
    "build": "next build",
    "db:migrate": "drizzle-kit migrate"
  }
}
```

### Safety Checks

**Pre-migration script:**
```typescript
// scripts/pre-migrate.ts
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function preMigrationChecks() {
  try {
    await sql`SELECT 1`;
    console.log('✅ Database connection successful');

    const tables = await sql`
      SELECT tablename FROM pg_tables
      WHERE schemaname = 'public'
    `;
    console.log(`✅ Found ${tables.length} tables`);

    return true;
  } catch (err) {
    console.error('❌ Pre-migration check failed:', err);
    process.exit(1);
  }
}

preMigrationChecks();
```

## Common Migration Errors

### Error: "migration already applied"

**Cause:** Journal shows migration as applied.

**Solution:**
```bash
# Check journal
cat src/db/migrations/meta/_journal.json

# Remove entry if needed (dev only!)
# Or regenerate migrations
rm -rf src/db/migrations/*
npm run drizzle-kit generate
```

### Error: "column already exists"

**Cause:** Schema out of sync with database.

**Solutions:**

**Option 1:** Edit migration to use IF NOT EXISTS:
```sql
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20);
```

**Option 2:** Reset migrations (dev only):
```bash
npm run drizzle-kit drop  # Drops all tables!
npm run drizzle-kit migrate
```

### Error: "violates foreign key constraint"

**Cause:** Trying to drop table referenced by foreign keys.

**Solution:** Drop in reverse dependency order:
```sql
DROP TABLE comments;  -- First (depends on posts)
DROP TABLE posts;     -- Then (depends on users)
DROP TABLE users;     -- Finally
```

Or use CASCADE (data loss!):
```sql
DROP TABLE users CASCADE;
```

### Error: "cannot drop column"

**Cause:** Column referenced by views, functions, or constraints.

**Solution:**
```sql
-- Find dependencies
SELECT * FROM information_schema.view_column_usage
WHERE column_name = 'your_column';

-- Drop views first
DROP VIEW view_name;

-- Then drop column
ALTER TABLE users DROP COLUMN your_column;
```

## Best Practices

### 1. Always Review Generated SQL

Don't blindly apply migrations:
```bash
# Generate
npm run drizzle-kit generate

# Review
cat src/db/migrations/0001_*.sql

# Apply only after review
npm run drizzle-kit migrate
```

### 2. Test Migrations in Development

**Before production:**
```bash
# On dev database
export DATABASE_URL=$DEV_DATABASE_URL
npm run db:migrate

# Test application
npm run test

# Only then deploy to production
```

### 3. Back Up Before Major Migrations

```bash
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

### 4. Use Transactions (when possible)

Wrap multiple operations:
```sql
BEGIN;

ALTER TABLE users ADD COLUMN phone_number VARCHAR(20);
UPDATE users SET phone_number = '000-000-0000' WHERE phone_number IS NULL;
ALTER TABLE users ALTER COLUMN phone_number SET NOT NULL;

COMMIT;
```

### 5. Document Breaking Changes

Add comments in migration files:
```sql
-- Breaking change: Removing deprecated 'username' column
-- Applications must use 'email' instead
-- Migration date: 2024-01-15
ALTER TABLE users DROP COLUMN username;
```

### 6. Keep Migrations Small

One logical change per migration:
- ✅ Good: "Add phone number column"
- ❌ Bad: "Add phone number, refactor users table, update indexes"

## Related Resources

- `guides/troubleshooting.md` - Migration error solutions
- `guides/schema-only.md` - Schema change patterns
- `references/adapters.md` - Connection configuration
- Scripts: `scripts/run-migration.ts`
