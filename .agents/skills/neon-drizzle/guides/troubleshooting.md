# Troubleshooting Guide

> **Reference Guide**: This is organized by error type and solution, not sequential phases.
> Jump directly to the error you're experiencing for quick resolution.

Common issues and solutions for Drizzle ORM with Neon.

## Table of Contents

- [Migration Errors](#migration-errors)
- [Connection Errors](#connection-errors)
- [Adapter Issues](#adapter-issues)
- [Type Errors](#type-errors)
- [Query Errors](#query-errors)
- [Performance Issues](#performance-issues)
- [Environment Issues](#environment-issues)
- [Getting More Help](#getting-more-help)
- [Prevention Checklist](#prevention-checklist)

---

## Migration Errors

### Error: "url: undefined"

**Symptom:**
```
Error: url is undefined in dbCredentials
```

**Cause:** Environment variables not loaded during migration.

**Solutions:**

**Option 1: Explicit env loading**
```bash
export DATABASE_URL="$(grep DATABASE_URL .env.local | cut -d '=' -f2)" && \
[package-manager] drizzle-kit migrate
```

**Option 2: Update drizzle.config.ts**
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

**Option 3: Use programmatic migration**
```typescript
import { migrate } from 'drizzle-orm/neon-http/migrator';
import { db } from './src/db';
import { config } from 'dotenv';

config({ path: '.env.local' });

await migrate(db, { migrationsFolder: './src/db/migrations' });
```

### Error: "Cannot find migrations folder"

**Symptom:**
```
Error: ENOENT: no such file or directory, scandir './src/db/migrations'
```

**Cause:** Migrations folder doesn't exist yet.

**Solution:**
```bash
mkdir -p src/db/migrations
[package-manager] drizzle-kit generate
```

### Error: "Column already exists"

**Symptom:**
```
Error: column "name" of relation "users" already exists
```

**Cause:** Trying to add a column that already exists in the database.

**Solutions:**

**Option 1: Skip migration (dev only)**
```bash
rm src/db/migrations/[latest-migration-file].sql
[package-manager] drizzle-kit generate
```

**Option 2: Drop and recreate table (dev only, DATA LOSS)**
```bash
psql $DATABASE_URL -c "DROP TABLE users CASCADE;"
[package-manager] drizzle-kit migrate
```

**Option 3: Manual migration (production)**
Edit the migration file to check if column exists:
```sql
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS name VARCHAR(255);
```

### Error: "Migration already applied"

**Symptom:**
```
Error: migration has already been applied
```

**Cause:** Drizzle tracks applied migrations. Trying to reapply.

**Solution:**

Check migration journal:
```bash
cat src/db/migrations/meta/_journal.json
```

Remove duplicate entry or regenerate:
```bash
rm -rf src/db/migrations
mkdir src/db/migrations
[package-manager] drizzle-kit generate
```

**Warning:** Only do this in development!

## Connection Errors

### Error: "Connection refused"

**Symptom:**
```
Error: connect ECONNREFUSED
```

**Causes and Solutions:**

**1. Wrong DATABASE_URL format**

Check format:
```bash
echo $DATABASE_URL
```

Should be:
```
postgresql://user:password@host.neon.tech/dbname?sslmode=require
```

**2. Missing sslmode**

Add to DATABASE_URL:
```
?sslmode=require
```

**3. Firewall/network issue**

Test connectivity:
```bash
psql $DATABASE_URL -c "SELECT 1"
```

### Error: "WebSocket connection failed"

**Symptom:**
```
Error: WebSocket connection to 'wss://...' failed
```

**Cause:** Missing WebSocket constructor in Node.js.

**Solution:**

Add to your connection file:
```typescript
import { neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;
```

Install ws if missing:
```bash
[package-manager] add ws
[package-manager] add -D @types/ws
```

### Error: "Too many connections"

**Symptom:**
```
Error: sorry, too many clients already
```

**Cause:** Connection pool exhausted.

**Solutions:**

**For HTTP adapter:** This shouldn't happen (stateless).

**For WebSocket adapter:** Implement connection pooling:
```typescript
import { Pool } from '@neondatabase/serverless';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  max: 10, // Limit connections
});

export const db = drizzle(pool);
```

**Close connections properly:**
```typescript
process.on('SIGTERM', async () => {
  await pool.end();
  process.exit(0);
});
```

## Adapter Issues

### Wrong Adapter for Environment

**Symptom:** App works locally but fails in production (or vice versa).

**Cause:** Using wrong adapter for environment.

**Solutions:**

See `references/adapters.md` for decision guide.

**Quick reference:**
- Vercel/Cloudflare/Edge → HTTP adapter
- Node.js/Express/Long-lived → WebSocket adapter

**HTTP adapter:**
```typescript
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql);
```

**WebSocket adapter:**
```typescript
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;
const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
export const db = drizzle(pool);
```

## Type Errors

### Error: "Type 'number' is not assignable to type 'string'"

**Symptom:**
```typescript
const user = await db.insert(users).values({
  id: 1, // Error here
  email: 'test@example.com',
});
```

**Cause:** Trying to manually set auto-increment ID.

**Solution:**

Remove `id` from insert (it's auto-generated):
```typescript
const user = await db.insert(users).values({
  email: 'test@example.com',
});
```

### Error: "Property 'xyz' does not exist"

**Symptom:**
```typescript
const user = await db.select().from(users);
console.log(user[0].nonExistentField); // Error
```

**Cause:** Column not defined in schema.

**Solution:**

Add column to schema:
```typescript
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  nonExistentField: text('non_existent_field'),
});
```

Then regenerate and apply migration.

## Query Errors

### Error: "relation does not exist"

**Symptom:**
```
Error: relation "users" does not exist
```

**Cause:** Table not created in database yet.

**Solution:**

Run migrations:
```bash
[package-manager] drizzle-kit generate
export DATABASE_URL="$(grep DATABASE_URL .env.local | cut -d '=' -f2)" && \
[package-manager] drizzle-kit migrate
```

### Error: "column does not exist"

**Symptom:**
```
Error: column "email" does not exist
```

**Causes:**

**1. Schema out of sync with database**

Regenerate and apply migrations:
```bash
[package-manager] drizzle-kit generate
[package-manager] drizzle-kit migrate
```

**2. Wrong table name in query**

Check schema definition vs query.

**3. Case sensitivity**

PostgreSQL is case-sensitive. Ensure column names match exactly.

### Error: "Cannot perform transactions with HTTP adapter"

**Symptom:**
```typescript
await db.transaction(async (tx) => {
  // Error: transactions not supported
});
```

**Cause:** HTTP adapter doesn't support transactions.

**Solutions:**

**Option 1: Switch to WebSocket adapter** (if environment allows)

See `references/adapters.md`.

**Option 2: Use batch operations**
```typescript
await db.batch([
  db.insert(users).values({ email: 'test1@example.com' }),
  db.insert(posts).values({ title: 'Test' }),
]);
```

**Option 3: Implement application-level rollback**

Not ideal, but possible for simple cases.

## Performance Issues

### Slow Queries

**Symptoms:** Queries taking seconds instead of milliseconds.

**Diagnose:**

**1. Missing indexes**

Check if foreign keys have indexes:
```typescript
export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  authorId: serial('author_id').notNull(),
}, (table) => ({
  authorIdIdx: index('posts_author_id_idx').on(table.authorId), // ADD THIS
}));
```

**2. N+1 queries**

Use relations instead of multiple queries:
```typescript
const postsWithAuthors = await db.query.posts.findMany({
  with: {
    author: true,
  },
});
```

**3. Selecting too much data**

Select only needed columns:
```typescript
const users = await db.select({
  id: users.id,
  email: users.email,
}).from(users);
```

### Connection Timeout

**Symptom:** Queries timeout in production.

**Solutions:**

**1. For Vercel:** Ensure using HTTP adapter (see `references/adapters.md`)

**2. For Node.js:** Implement connection pooling with retry:
```typescript
import { Pool } from '@neondatabase/serverless';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  max: 10,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
});
```

**3. Add query timeout:**
```typescript
const result = await Promise.race([
  db.select().from(users),
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Query timeout')), 5000)
  ),
]);
```

## Environment Issues

### Error: "DATABASE_URL is undefined"

**Symptom:** App can't find DATABASE_URL.

**Solutions:**

**1. Check env file exists:**
```bash
ls .env .env.local
```

**2. Verify var is set:**
```bash
grep DATABASE_URL .env.local
```

**3. Load env vars:**
```typescript
import { config } from 'dotenv';
config({ path: '.env.local' });
```

**4. For Next.js:** Use `NEXT_PUBLIC_` prefix if accessing client-side (NOT recommended for DATABASE_URL):
```
# Don't do this - security risk
NEXT_PUBLIC_DATABASE_URL="..."

# Do this - server-only
DATABASE_URL="..."
```

### Error: "Invalid connection string"

**Symptom:**
```
Error: invalid connection string
```

**Cause:** Malformed DATABASE_URL.

**Check format:**
```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require
```

**Common mistakes:**
- Missing `postgresql://` prefix
- Special characters in password not URL-encoded
- Missing `?sslmode=require`

**Fix special characters:**
```bash
# If password is "p@ss&word!"
# Encode to: p%40ss%26word%21
```

## Getting More Help

If your issue isn't listed here:

1. **Check adapter configuration:** `references/adapters.md`
2. **Review migration patterns:** `references/migrations.md`
3. **Check query syntax:** `references/query-patterns.md`
4. **Search Drizzle docs:** https://orm.drizzle.team/docs
5. **Check Neon docs:** https://neon.com/docs

## Prevention Checklist

Before deploying:

- [ ] Environment variables properly loaded
- [ ] Correct adapter for environment
- [ ] Migrations applied successfully
- [ ] Indexes on foreign keys
- [ ] Connection pooling configured (if Node.js)
- [ ] Error handling for database operations
- [ ] .env files in .gitignore
- [ ] Test queries work in production environment
