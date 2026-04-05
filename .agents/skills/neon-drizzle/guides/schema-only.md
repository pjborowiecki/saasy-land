# Schema Creation and Modification

> **Complete Walkthrough**: This is a self-contained, step-by-step guide with its own numbered phases (Phase 1-6).
> Follow each phase in order for schema design, modification, and migration workflows.

Guide for creating or modifying database schemas with Drizzle.

## Table of Contents

- [Workflow Checklist](#workflow-checklist)
- [Phase 1: Schema Design Patterns](#phase-1-schema-design-patterns)
- [Phase 2: Common Schema Patterns](#phase-2-common-schema-patterns)
- [Phase 3: Schema Modifications](#phase-3-schema-modifications)
- [Phase 4: Indexes and Constraints](#phase-4-indexes-and-constraints)
- [Phase 5: Generate and Apply Changes](#phase-5-generate-and-apply-changes)
- [Phase 6: Advanced Patterns](#phase-6-advanced-patterns)
- [Common Issues](#common-issues)
- [Next Steps](#next-steps)

---

## Workflow Checklist

When following this guide, I will track these high-level tasks:

- [ ] Design schema using appropriate patterns (tables, relationships, types)
- [ ] Apply common schema patterns (auth, soft deletes, enums, JSON)
- [ ] Implement schema modifications (add/rename/drop columns, change types)
- [ ] Add indexes and constraints for performance and data integrity
- [ ] Generate and apply migrations
- [ ] Verify changes and test with queries

---

## Phase 1: Schema Design Patterns

### 1.1. Basic Table Structure

```typescript
import { pgTable, serial, text, varchar, timestamp, boolean } from 'drizzle-orm/pg-core';

export const tableName = pgTable('table_name', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
```

**Key conventions:**
- Use `serial` for auto-incrementing IDs
- Use `varchar` for short strings (with length limit)
- Use `text` for long strings
- Use `timestamp` for dates/times
- Always add `createdAt` for audit trails

### 1.2. Relationships

**One-to-Many:**
```typescript
import { pgTable, serial, text, timestamp, index } from 'drizzle-orm/pg-core';

export const authors = pgTable('authors', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
});

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  authorId: serial('author_id')
    .notNull()
    .references(() => authors.id),
  title: text('title').notNull(),
  content: text('content').notNull(),
}, (table) => ({
  authorIdIdx: index('posts_author_id_idx').on(table.authorId),
}));
```

**Important:** Always add index on foreign keys for query performance.

**Many-to-Many:**
```typescript
export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
});

export const tags = pgTable('tags', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
});

export const postsTags = pgTable('posts_tags', {
  postId: serial('post_id')
    .notNull()
    .references(() => posts.id),
  tagId: serial('tag_id')
    .notNull()
    .references(() => tags.id),
}, (table) => ({
  pk: index('posts_tags_pk').on(table.postId, table.tagId),
}));
```

### 1.3. Type-Safe Relations

Enable relational queries:
```typescript
import { relations } from 'drizzle-orm';

export const authorsRelations = relations(authors, ({ many }) => ({
  posts: many(posts),
}));

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(authors, {
    fields: [posts.authorId],
    references: [authors.id],
  }),
}));
```

**Benefits:**
- Type-safe joins
- Automatic loading of related data
- No manual JOIN queries needed

## Phase 2: Common Schema Patterns

### 2.1. User Authentication

```typescript
import { pgTable, serial, varchar, timestamp, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }),
  name: varchar('name', { length: 255 }).notNull(),
  emailVerified: boolean('email_verified').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  lastLoginAt: timestamp('last_login_at'),
});
```

### 2.2. Soft Deletes

```typescript
export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  deletedAt: timestamp('deleted_at'),
  createdAt: timestamp('created_at').defaultNow(),
});
```

Query with soft deletes:
```typescript
const activePosts = await db
  .select()
  .from(posts)
  .where(isNull(posts.deletedAt));
```

### 2.3. Enums

```typescript
import { pgEnum, pgTable, serial, text } from 'drizzle-orm/pg-core';

export const statusEnum = pgEnum('status', ['draft', 'published', 'archived']);

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  status: statusEnum('status').default('draft'),
});
```

### 2.4. JSON Fields

```typescript
import { pgTable, serial, jsonb } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  metadata: jsonb('metadata').$type<{
    color?: string;
    size?: string;
    tags?: string[];
  }>(),
});
```

## Phase 3: Schema Modifications

### 3.1. Adding Columns

**Step 1:** Update schema:
```typescript
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull(),
  phoneNumber: varchar('phone_number', { length: 20 }), // NEW
});
```

**Step 2:** Generate migration:
```bash
[package-manager] drizzle-kit generate
```

**Step 3:** Apply migration:
```bash
export DATABASE_URL="$(grep DATABASE_URL .env.local | cut -d '=' -f2)" && \
[package-manager] drizzle-kit migrate
```

### 3.2. Renaming Columns

**Important:** Drizzle sees renames as drop + add. Manual migration required.

**Step 1:** Update schema:
```typescript
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  fullName: varchar('full_name', { length: 255 }), // was 'name'
});
```

**Step 2:** Generate migration (will create drop + add):
```bash
[package-manager] drizzle-kit generate
```

**Step 3:** Edit migration file manually:
```sql
-- Change from:
-- ALTER TABLE users DROP COLUMN name;
-- ALTER TABLE users ADD COLUMN full_name VARCHAR(255);

-- To:
ALTER TABLE users RENAME COLUMN name TO full_name;
```

**Step 4:** Apply migration:
```bash
[package-manager] drizzle-kit migrate
```

### 3.3. Dropping Columns

**Step 1:** Remove from schema:
```typescript
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull(),
  // removed: phoneNumber
});
```

**Step 2:** Generate and apply:
```bash
[package-manager] drizzle-kit generate
[package-manager] drizzle-kit migrate
```

**Warning:** This permanently deletes data. Back up first!

### 3.4. Changing Column Types

**Step 1:** Update schema:
```typescript
export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  views: bigint('views', { mode: 'number' }), // was: integer
});
```

**Step 2:** Generate migration:
```bash
[package-manager] drizzle-kit generate
```

**Step 3:** Review generated SQL - may need data migration if incompatible types.

## Phase 4: Indexes and Constraints

### 4.1. Add Indexes

**Single column:**
```typescript
import { pgTable, serial, text, index } from 'drizzle-orm/pg-core';

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  authorId: serial('author_id').notNull(),
}, (table) => ({
  titleIdx: index('posts_title_idx').on(table.title),
  authorIdIdx: index('posts_author_id_idx').on(table.authorId),
}));
```

**Composite index:**
```typescript
export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  authorId: serial('author_id').notNull(),
  status: text('status').notNull(),
}, (table) => ({
  authorStatusIdx: index('posts_author_status_idx').on(table.authorId, table.status),
}));
```

### 4.2. Unique Constraints

**Single column:**
```typescript
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
});
```

**Multiple columns:**
```typescript
import { pgTable, serial, text, unique } from 'drizzle-orm/pg-core';

export const postsTags = pgTable('posts_tags', {
  postId: serial('post_id').notNull(),
  tagId: serial('tag_id').notNull(),
}, (table) => ({
  unq: unique('posts_tags_unique').on(table.postId, table.tagId),
}));
```

### 4.3. Check Constraints

```typescript
import { pgTable, serial, integer, check } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  price: integer('price').notNull(),
  discountedPrice: integer('discounted_price'),
}, (table) => ({
  priceCheck: check('price_check', 'price >= 0'),
  discountCheck: check('discount_check', 'discounted_price < price'),
}));
```

## Phase 5: Generate and Apply Changes

### 5.1. Generate Migration

After any schema changes:
```bash
[package-manager] drizzle-kit generate
```

Review generated SQL in `src/db/migrations/`.

### 5.2. Apply Migration

With proper environment loading:
```bash
export DATABASE_URL="$(grep DATABASE_URL .env.local | cut -d '=' -f2)" && \
[package-manager] drizzle-kit migrate
```

Or use the migration script:
```bash
[package-manager] tsx scripts/run-migration.ts
```

### 5.3. Verify Changes

**Check in database:**
```bash
psql $DATABASE_URL -c "\d table_name"
```

**Test with queries:**
```typescript
import { db } from './src/db';
import { tableName } from './src/db/schema';

const result = await db.select().from(tableName);
console.log('Schema works:', result);
```

## Phase 6: Advanced Patterns

For complex schemas, see:
- `templates/schema-example.ts` - Multi-table examples with relations
- `references/migrations.md` - Advanced migration patterns

## Common Issues

- **Migration conflicts:** See `guides/troubleshooting.md`
- **Relationship errors:** Ensure foreign keys reference correct columns
- **Type mismatches:** Match TypeScript types with SQL types carefully

## Next Steps

After schema creation:
1. Run migrations (see above)
2. Create queries (see `references/query-patterns.md`)
3. Add validation (use Zod or similar)
4. Test thoroughly before production
