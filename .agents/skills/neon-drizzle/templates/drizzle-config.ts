/**
 * Drizzle Configuration
 *
 * This file configures Drizzle ORM for use with Neon.
 * Place this in your project root or src/ directory.
 *
 * Usage: Reference this in your drizzle.config.ts
 */

import { config } from "dotenv";
import type { Config } from "drizzle-kit";

config({ path: ".env.local" });

/**
 * Drizzle Configuration for Neon Postgres
 *
 * Supports both HTTP and WebSocket connections.
 * Automatically detects which driver to use based on environment.
 */

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Determine connection type based on environment
const isServerless =
  process.env.RUNTIME === "edge" || process.env.VERCEL_ENV === "production";

export default {
  schema: "./src/db/schema.ts", // Path to your schema file
  out: "./src/db/migrations", // Output directory for migrations

  // Database connection
  dbCredentials: {
    url: dbUrl,
  },

  // Migration options
  migrations: {
    prefix: "timestamp", // or 'none'
  },

  // Verbose logging for debugging
  verbose: process.env.DEBUG === "true",

  // Strict mode ensures all migrations are applied
  strict: true,
} satisfies Config;

/**
 * HTTP Connection Configuration (for Vercel Edge, etc.)
 *
 * export default {
 *   schema: './src/db/schema.ts',
 *   out: './src/db/migrations',
 *   driver: 'postgres',
 *   dbCredentials: {
 *     url: process.env.DATABASE_URL!,
 *   },
 * } satisfies Config;
 */

/**
 * WebSocket Connection Configuration (for Node.js servers)
 *
 * export default {
 *   schema: './src/db/schema.ts',
 *   out: './src/db/migrations',
 *   driver: 'pg',
 *   dbCredentials: {
 *     url: process.env.DATABASE_URL!,
 *   },
 * } satisfies Config;
 */

/**
 * Migration Commands
 *
 * # Generate migration files from schema changes
 * npx drizzle-kit generate
 *
 * # Apply migrations to database
 * npx drizzle-kit migrate
 *
 * # Drop all tables (careful!)
 * npx drizzle-kit drop
 *
 * # Introspect existing database
 * npx drizzle-kit introspect
 *
 * # Push schema changes directly (development only)
 * npx drizzle-kit push
 */
