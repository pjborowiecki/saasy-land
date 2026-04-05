/**
 * Connection Validator Script
 *
 * This script tests your Neon database connection and provides diagnostic information.
 * Run with: npx ts-node validate-connection.ts
 *
 * Environment variables:
 * - DATABASE_URL: Your Neon connection string
 * - CONNECTION_TYPE: 'http' or 'websocket' (default: 'http')
 */

import { neon } from "@neondatabase/serverless";
import { Pool } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL;
const CONNECTION_TYPE = process.env.CONNECTION_TYPE || "http";

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL environment variable is not set");
  process.exit(1);
}

async function validateHttpConnection() {
  console.log("\n🔍 Testing HTTP Connection...");
  try {
    const sql = neon(DATABASE_URL);

    // Test 1: Simple query
    console.log("  • Testing basic query...");
    const result =
      await sql`SELECT NOW() as current_time, version() as version`;
    console.log("  ✅ Query successful");

    // Test 2: Get database info
    console.log("  • Fetching database info...");
    const dbInfo = await sql`
      SELECT
        current_database() as database,
        current_user as user,
        version() as postgresql_version,
        (SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public') as table_count
    `;

    console.log("\n📊 Database Information:");
    const info = dbInfo[0];
    console.log(`  • Database: ${info.database}`);
    console.log(`  • User: ${info.user}`);
    console.log(
      `  • PostgreSQL Version: ${info.postgresql_version.split(",")[0]}`,
    );
    console.log(`  • Public Tables: ${info.table_count}`);

    // Test 3: Connection string validation
    console.log("\n🔐 Connection Details:");
    const url = new URL(DATABASE_URL);
    console.log(`  • Host: ${url.hostname}`);
    console.log(`  • Port: ${url.port || 5432}`);
    console.log(`  • Database: ${url.pathname.slice(1)}`);
    console.log(
      `  • SSL Mode: ${url.searchParams.get("sslmode") || "require"}`,
    );

    return true;
  } catch (error) {
    console.error("  ❌ Connection failed");
    console.error(`     Error: ${(error as any).message}`);
    return false;
  }
}

async function validateWebSocketConnection() {
  console.log("\n🔍 Testing WebSocket Connection...");
  try {
    const pool = new Pool({
      connectionString: DATABASE_URL,
      max: 1,
    });

    // Test 1: Get connection
    console.log("  • Acquiring connection...");
    const client = await pool.connect();
    console.log("  ✅ Connection acquired");

    try {
      // Test 2: Simple query
      console.log("  • Testing basic query...");
      const result = await client.query(
        "SELECT NOW() as current_time, version() as version",
      );
      console.log("  ✅ Query successful");

      // Test 3: Get database info
      console.log("  • Fetching database info...");
      const dbInfoResult = await client.query(`
        SELECT
          current_database() as database,
          current_user as user,
          version() as postgresql_version,
          (SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public') as table_count
      `);

      console.log("\n📊 Database Information:");
      const info = dbInfoResult.rows[0];
      console.log(`  • Database: ${info.database}`);
      console.log(`  • User: ${info.user}`);
      console.log(
        `  • PostgreSQL Version: ${info.postgresql_version.split(",")[0]}`,
      );
      console.log(`  • Public Tables: ${info.table_count}`);

      // Test 4: List tables
      console.log("\n📋 Public Tables:");
      const tablesResult = await client.query(`
        SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'
      `);

      if (tablesResult.rows.length > 0) {
        tablesResult.rows.forEach((row) => {
          console.log(`  • ${row.table_name}`);
        });
      } else {
        console.log("  (no tables found)");
      }
    } finally {
      client.release();
    }

    // Test 5: Connection string validation
    console.log("\n🔐 Connection Details:");
    const url = new URL(DATABASE_URL);
    console.log(`  • Host: ${url.hostname}`);
    console.log(`  • Port: ${url.port || 5432}`);
    console.log(`  • Database: ${url.pathname.slice(1)}`);
    console.log(
      `  • SSL Mode: ${url.searchParams.get("sslmode") || "require"}`,
    );

    await pool.end();
    return true;
  } catch (error) {
    console.error("  ❌ Connection failed");
    console.error(`     Error: ${(error as any).message}`);
    return false;
  }
}

async function main() {
  console.log("═══════════════════════════════════════════════════════");
  console.log("  Neon Connection Validator");
  console.log("═══════════════════════════════════════════════════════");

  console.log(`\n🚀 Testing ${CONNECTION_TYPE.toUpperCase()} connection...`);
  console.log(`   Database URL: ${DATABASE_URL.split("@")[1] || "..."}`);

  let success = false;

  if (CONNECTION_TYPE === "websocket") {
    success = await validateWebSocketConnection();
  } else {
    success = await validateHttpConnection();
  }

  console.log("\n═══════════════════════════════════════════════════════");
  if (success) {
    console.log("✅ Connection validated successfully!");
    process.exit(0);
  } else {
    console.log("❌ Connection validation failed");
    console.log("\n💡 Troubleshooting tips:");
    console.log("   • Verify DATABASE_URL is correctly set");
    console.log("   • Check your Neon console for connection details");
    console.log("   • Ensure your firewall allows outbound connections");
    console.log("   • Check if SSL mode is correctly configured");
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Unexpected error:", error);
  process.exit(1);
});
