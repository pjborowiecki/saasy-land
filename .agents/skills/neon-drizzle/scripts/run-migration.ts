/**
 * Run Migration Script
 *
 * Applies pending Drizzle migrations to your Neon database.
 * Run with: npx ts-node run-migration.ts
 *
 * This script will:
 * 1. Connect to your Neon database
 * 2. Apply all pending migrations
 * 3. Report success or failure
 */

import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";
import { neon } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL environment variable is not set");
  process.exit(1);
}

async function runMigrations() {
  console.log("🔄 Running Drizzle migrations...\n");

  try {
    // Create SQL client
    const sql = neon(DATABASE_URL);

    // Create Drizzle instance
    const db = drizzle(sql);

    // Run migrations
    console.log("⏳ Applying migrations...");
    await migrate(db, {
      migrationsFolder: "./src/db/migrations",
    });

    console.log("✅ All migrations applied successfully!\n");

    // Show migration status
    console.log("📊 Migration Summary:");
    console.log("   Database: " + new URL(DATABASE_URL).pathname.slice(1));
    console.log("   Migrations folder: ./src/db/migrations");
    console.log("   Status: Up to date\n");

    return true;
  } catch (error) {
    console.error("❌ Migration failed");
    console.error((error as any).message);

    console.log("\n💡 Troubleshooting:");
    console.log("   • Ensure ./src/db/migrations directory exists");
    console.log("   • Verify DATABASE_URL is correct");
    console.log("   • Check that migrations are properly formatted SQL files");
    console.log("   • Try running: npx drizzle-kit generate first");
    console.log(
      "   • Review guides/troubleshooting.md for common migration errors",
    );
    console.log(
      "   • See references/migrations.md for detailed migration guide",
    );

    const errorMessage = (error as any).message.toLowerCase();

    if (
      errorMessage.includes("connect") ||
      errorMessage.includes("connection")
    ) {
      console.log("\n⚠️  Connection issue detected:");
      console.log(
        "   • Verify DATABASE_URL format: postgresql://user:pass@host/db?sslmode=require",
      );
      console.log("   • Ensure database is accessible");
      console.log("   • Check firewall/network settings");
      console.log(
        '   • See guides/troubleshooting.md section: "Connection Errors"',
      );
    }

    if (
      errorMessage.includes("already exists") ||
      errorMessage.includes("duplicate")
    ) {
      console.log("\n⚠️  Migration conflict detected:");
      console.log("   • Migration may have been partially applied");
      console.log('   • Check database state: psql $DATABASE_URL -c "\\dt"');
      console.log("   • See references/migrations.md for handling conflicts");
    }

    if (errorMessage.includes("not found") || errorMessage.includes("enoent")) {
      console.log("\n⚠️  Migrations folder missing:");
      console.log("   • Run: npx drizzle-kit generate");
      console.log(
        "   • Ensure migrations folder path matches drizzle.config.ts",
      );
    }

    if (errorMessage.includes("syntax")) {
      console.log("\n⚠️  SQL syntax error:");
      console.log(
        "   • Review generated migration files in ./src/db/migrations",
      );
      console.log("   • Check for manually edited migrations");
      console.log(
        "   • See references/migrations.md for safe editing practices",
      );
    }

    console.log("");
    return false;
  }
}

/**
 * Alternative: Run migrations with WebSocket (for Node.js)
 * Uncomment below if using WebSocket connections
 */

/*
import { drizzle } from 'drizzle-orm/neon-serverless';
import { migrate } from 'drizzle-orm/neon-serverless/migrator';
import { Pool } from '@neondatabase/serverless';

async function runMigrationsWebSocket() {
  console.log('🔄 Running Drizzle migrations (WebSocket)...\n');

  const pool = new Pool({ connectionString: DATABASE_URL });

  try {
    const db = drizzle(pool);

    console.log('⏳ Applying migrations...');
    await migrate(db, {
      migrationsFolder: './src/db/migrations',
    });

    console.log('✅ All migrations applied successfully!\n');
    await pool.end();
    return true;
  } catch (error) {
    console.error('❌ Migration failed:', (error as any).message);
    await pool.end();
    return false;
  }
}
*/

// Run migrations
runMigrations().then((success) => {
  process.exit(success ? 0 : 1);
});
