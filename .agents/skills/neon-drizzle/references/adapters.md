# Adapter Reference Guide

Complete guide for choosing between HTTP and WebSocket adapters.

## Table of Contents

- [Quick Decision Matrix](#quick-decision-matrix)
- [HTTP Adapter](#http-adapter-neondatabaseserverless-with-neon-http)
- [WebSocket Adapter](#websocket-adapter-neondatabaseserverless-with-neon-serverless)
- [Framework-Specific Recommendations](#framework-specific-recommendations)
- [Mixed Environments](#mixed-environments)
- [Feature Comparison Table](#feature-comparison-table)
- [Performance Considerations](#performance-considerations)
- [Troubleshooting](#troubleshooting)
- [Migration Between Adapters](#migration-between-adapters)
- [Choosing the Right Adapter](#choosing-the-right-adapter)
- [Related Resources](#related-resources)

---

## Quick Decision Matrix

| Environment | Adapter | Reason |
|-------------|---------|--------|
| Vercel | HTTP | Edge functions, stateless |
| Cloudflare Workers | HTTP | Edge runtime, no WebSocket |
| AWS Lambda | HTTP | Stateless, cold starts |
| Next.js (Vercel) | HTTP | App Router, Edge Runtime |
| Express/Fastify | WebSocket | Long-lived connections |
| Node.js server | WebSocket | Connection pooling |
| Bun server | WebSocket | Persistent runtime |

## HTTP Adapter (@neondatabase/serverless with neon-http)

### When to Use

✅ **Serverless/Edge environments:**
- Vercel Edge Functions
- Cloudflare Workers
- AWS Lambda
- Deno Deploy
- Next.js App Router (default)

✅ **Characteristics:**
- Stateless requests
- Cold starts
- Short execution time
- No persistent connections

### Setup

**Installation:**
```bash
npm add drizzle-orm @neondatabase/serverless
npm add -D drizzle-kit
```

**Connection:**
```typescript
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql);
```

**Complete example:** See `templates/db-http.ts`

### Pros

✅ **Perfect for serverless:**
- No connection management needed
- Works in edge environments
- Fast cold starts
- Auto-scales

✅ **Simple:**
- Minimal configuration
- No connection pooling complexity
- Stateless = predictable

### Cons

❌ **Limited features:**
- No transactions
- No prepared statements
- No streaming
- Higher latency per query

❌ **Not ideal for:**
- Batch operations
- Complex transactions
- High-frequency queries from same process

### Best Practices

**1. Use batch for multiple operations:**
```typescript
await db.batch([
  db.insert(users).values({ email: 'test@example.com' }),
  db.insert(posts).values({ title: 'Test' }),
]);
```

**2. Cache query results:**
```typescript
import { unstable_cache } from 'next/cache';

const getUsers = unstable_cache(
  async () => db.select().from(users),
  ['users'],
  { revalidate: 60 }
);
```

**3. Minimize round trips:**
```typescript
const usersWithPosts = await db.query.users.findMany({
  with: { posts: true },
});
```

## WebSocket Adapter (@neondatabase/serverless with neon-serverless)

### When to Use

✅ **Long-lived processes:**
- Express/Fastify servers
- Standard Node.js applications
- Background workers
- WebSocket servers
- Bun applications

✅ **Characteristics:**
- Persistent connections
- Long execution time
- Connection pooling
- Complex transactions

### Setup

**Installation:**
```bash
npm add drizzle-orm @neondatabase/serverless ws
npm add -D drizzle-kit @types/ws
```

**Connection:**
```typescript
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

export const db = drizzle(pool);
```

**Complete example:** See `templates/db-websocket.ts`

### Pros

✅ **Full features:**
- Transactions
- Prepared statements
- Streaming
- Lower latency (persistent connection)

✅ **Better for:**
- Multiple queries per request
- Complex business logic
- High-frequency operations

### Cons

❌ **More complex:**
- Connection pool management
- Need to handle connection errors
- Not available in edge environments

❌ **Resource considerations:**
- Connection limits
- Memory usage
- Cold start overhead

### Best Practices

**1. Configure connection pool:**
```typescript
const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  max: 10,                    // Max connections
  idleTimeoutMillis: 30000,   // Close idle after 30s
  connectionTimeoutMillis: 5000, // Timeout after 5s
});
```

**2. Graceful shutdown:**
```typescript
process.on('SIGTERM', async () => {
  await pool.end();
  process.exit(0);
});

process.on('SIGINT', async () => {
  await pool.end();
  process.exit(0);
});
```

**3. Use transactions:**
```typescript
await db.transaction(async (tx) => {
  const user = await tx.insert(users)
    .values({ email: 'test@example.com' })
    .returning();

  await tx.insert(posts)
    .values({ userId: user[0].id, title: 'First post' });
});
```

**4. Handle connection errors:**
```typescript
pool.on('error', (err) => {
  console.error('Unexpected pool error:', err);
});

pool.on('connect', () => {
  console.log('Pool connection established');
});
```

## Framework-Specific Recommendations

### Next.js

**App Router (default):**
- Use HTTP adapter (Edge Runtime)
- Server Actions → HTTP
- Route Handlers → HTTP

**Pages Router:**
- API Routes → Either adapter works
- Recommend HTTP for consistency

**Example:**
```typescript
// app/actions/users.ts
'use server';

import { db } from '@/db'; // HTTP adapter
import { users } from '@/db/schema';

export async function createUser(email: string) {
  return db.insert(users).values({ email }).returning();
}
```

### Express

**Standard setup:**
- Use WebSocket adapter
- Configure connection pool
- Implement health checks

**Example:**
```typescript
import express from 'express';
import { db } from './db'; // WebSocket adapter
import { users } from './db/schema';

const app = express();

app.get('/health', async (req, res) => {
  try {
    await db.select().from(users).limit(1);
    res.json({ status: 'healthy' });
  } catch (err) {
    res.status(500).json({ status: 'unhealthy', error: err.message });
  }
});

app.listen(3000);
```

### Vite/React (SPA)

**Deployment matters:**

**If deploying to Vercel:**
- API routes → HTTP adapter
- Static files → No backend needed

**If deploying to Node.js server:**
- Backend API → WebSocket adapter
- Frontend → Fetch from API

### Bun

**Recommendation:**
- Use WebSocket adapter
- Bun has built-in WebSocket support
- No need for `ws` package

**Setup:**
```typescript
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
export const db = drizzle(pool);
```

## Mixed Environments

### Using Both Adapters

If you have both serverless and long-lived components:

**Structure:**
```
src/
├── db/
│   ├── http.ts        # HTTP adapter for serverless
│   ├── ws.ts          # WebSocket for servers
│   └── schema.ts      # Shared schema
```

**HTTP adapter:**
```typescript
// src/db/http.ts
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);
export const httpDb = drizzle(sql);
```

**WebSocket adapter:**
```typescript
// src/db/ws.ts
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;
const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
export const wsDb = drizzle(pool);
```

**Usage:**
```typescript
// Vercel Edge Function
import { httpDb as db } from '@/db/http';

// Express route
import { wsDb as db } from '@/db/ws';
```

## Feature Comparison Table

| Feature | HTTP Adapter | WebSocket Adapter |
|---------|-------------|-------------------|
| Transactions | ❌ No | ✅ Yes |
| Prepared statements | ❌ No | ✅ Yes |
| Streaming results | ❌ No | ✅ Yes |
| Connection pooling | N/A (stateless) | ✅ Yes |
| Edge runtime | ✅ Yes | ❌ No |
| Cold start speed | ✅ Fast | ⚠️ Slower |
| Latency per query | ⚠️ Higher | ✅ Lower |
| Batch operations | ✅ Yes | ✅ Yes |
| Max connection limit | N/A | ⚠️ Applies |

## Performance Considerations

### HTTP Adapter Performance

**Optimize by:**
- Minimizing round trips
- Using batch operations
- Caching query results
- Pre-fetching related data

**Typical latency:**
- Single query: 50-200ms
- Batch operation: 100-300ms

### WebSocket Adapter Performance

**Optimize by:**
- Configuring pool size correctly
- Using transactions for related operations
- Implementing query caching
- Monitoring connection usage

**Typical latency:**
- First query (connection): 50-100ms
- Subsequent queries: 10-50ms

## Troubleshooting

### HTTP Adapter Issues

**Problem:** "fetch is not defined"
- **Solution:** Ensure running in environment with fetch API (Node 18+, edge runtime)

**Problem:** Slow queries
- **Solution:** Use batch operations, reduce round trips

### WebSocket Adapter Issues

**Problem:** "WebSocket is not defined"
- **Solution:** Add `neonConfig.webSocketConstructor = ws`

**Problem:** "Too many connections"
- **Solution:** Reduce pool `max` size, ensure connections are closed

**Problem:** Connection timeouts
- **Solution:** Increase `connectionTimeoutMillis`, implement retry logic

## Migration Between Adapters

### HTTP → WebSocket

**When:** Moving from serverless to dedicated server.

**Steps:**
1. Install ws: `npm add ws @types/ws`
2. Update connection file to WebSocket adapter
3. Update drizzle.config.ts if needed
4. Test transactions (now available)

### WebSocket → HTTP

**When:** Moving to serverless/edge deployment.

**Steps:**
1. Update connection file to HTTP adapter
2. Remove ws dependency
3. **Important:** Replace transactions with batch operations
4. Test thoroughly (feature differences)

## Choosing the Right Adapter

**Ask yourself:**

1. **Where am I deploying?**
   - Edge/Serverless → HTTP
   - Node.js server → WebSocket

2. **Do I need transactions?**
   - Yes → WebSocket
   - No → Either works

3. **What's my request pattern?**
   - Short, infrequent → HTTP
   - Long, frequent → WebSocket

4. **Am I optimizing for?**
   - Cold starts → HTTP
   - Latency → WebSocket

**When in doubt:** Start with HTTP (simpler), migrate to WebSocket if needed.

## Related Resources

- `guides/new-project.md` - Setup guides for both adapters
- `guides/troubleshooting.md` - Connection error solutions
- `templates/db-http.ts` - HTTP adapter template
- `templates/db-websocket.ts` - WebSocket adapter template
