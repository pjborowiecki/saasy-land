/**
 * Neon Toolkit Workflow Example
 *
 * This demonstrates a complete workflow for creating, using, and cleaning up
 * an ephemeral Neon database. Perfect for testing, CI/CD, and prototyping.
 */

import { NeonToolkit } from "@neondatabase/toolkit";

/**
 * Main workflow function
 */
export async function ephemeralDatabaseWorkflow() {
  const apiKey = process.env.NEON_API_KEY;
  if (!apiKey) {
    throw new Error("NEON_API_KEY environment variable is required");
  }

  // Initialize Neon Toolkit
  const neon = new NeonToolkit({ apiKey });

  console.log("🚀 Starting ephemeral database workflow...\n");

  try {
    // Step 1: Create ephemeral database
    console.log("📦 Creating ephemeral database...");
    const db = await neon.createEphemeralDatabase();
    console.log(`✅ Database created!`);
    console.log(`   Connection string: ${db.url}\n`);

    // Step 2: Setup schema
    console.log("📝 Setting up schema...");
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log("✅ Schema created\n");

    // Step 3: Insert sample data
    console.log("📤 Inserting sample data...");
    const insertResult = await db.query(
      `INSERT INTO users (email, name) VALUES
       ($1, $2), ($3, $4), ($5, $6)
       RETURNING *`,
      [
        "alice@example.com",
        "Alice",
        "bob@example.com",
        "Bob",
        "charlie@example.com",
        "Charlie",
      ],
    );
    console.log(`✅ Inserted ${insertResult.rows?.length || 0} users\n`);

    // Step 4: Query data
    console.log("🔍 Querying data...");
    const selectResult = await db.query(
      "SELECT * FROM users ORDER BY created_at",
    );
    console.log("✅ Users in database:");
    selectResult.rows?.forEach((row: any) => {
      console.log(`   • ${row.name} (${row.email})`);
    });
    console.log("");

    // Step 5: Run tests (example)
    console.log("🧪 Running tests...");
    const testResults = await runTests(db);
    console.log(
      `✅ ${testResults.passed} tests passed, ${testResults.failed} failed\n`,
    );

    // Step 6: Cleanup
    console.log("🧹 Cleaning up...");
    await db.delete();
    console.log("✅ Ephemeral database destroyed\n");

    console.log("🎉 Workflow completed successfully!");
    return true;
  } catch (error) {
    console.error("❌ Error during workflow:", error);
    throw error;
  }
}

/**
 * Example test suite using ephemeral database
 */
async function runTests(db: any) {
  const tests = [
    {
      name: "User count should be 3",
      async run() {
        const result = await db.query("SELECT COUNT(*) as count FROM users");
        return result.rows?.[0]?.count === 3;
      },
    },
    {
      name: "Should find user by email",
      async run() {
        const result = await db.query("SELECT * FROM users WHERE email = $1", [
          "alice@example.com",
        ]);
        return result.rows?.[0]?.name === "Alice";
      },
    },
    {
      name: "Should insert new user",
      async run() {
        await db.query("INSERT INTO users (email, name) VALUES ($1, $2)", [
          "david@example.com",
          "David",
        ]);
        const result = await db.query("SELECT COUNT(*) as count FROM users");
        return result.rows?.[0]?.count === 4;
      },
    },
    {
      name: "Should update user",
      async run() {
        await db.query("UPDATE users SET name = $1 WHERE email = $2", [
          "Alice Updated",
          "alice@example.com",
        ]);
        const result = await db.query(
          "SELECT name FROM users WHERE email = $1",
          ["alice@example.com"],
        );
        return result.rows?.[0]?.name === "Alice Updated";
      },
    },
    {
      name: "Should delete user",
      async run() {
        await db.query("DELETE FROM users WHERE email = $1", [
          "bob@example.com",
        ]);
        const result = await db.query("SELECT COUNT(*) as count FROM users");
        return result.rows?.[0]?.count >= 3;
      },
    },
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      const result = await test.run();
      if (result) {
        console.log(`   ✅ ${test.name}`);
        passed++;
      } else {
        console.log(`   ❌ ${test.name}`);
        failed++;
      }
    } catch (error) {
      console.log(`   ❌ ${test.name} (error)`);
      failed++;
    }
  }

  return { passed, failed };
}

/**
 * Example: Using in CI/CD
 * Run this in your CI/CD pipeline for isolated testing
 */
export async function cicdWorkflow() {
  console.log("🔄 CI/CD Workflow\n");

  const apiKey = process.env.NEON_API_KEY;
  if (!apiKey) {
    console.error("NEON_API_KEY not set. Skipping ephemeral database setup.");
    return;
  }

  const neon = new NeonToolkit({ apiKey });

  // Create fresh database for tests
  const db = await neon.createEphemeralDatabase();
  console.log("✅ Ephemeral database created for testing");

  try {
    // Run your test suite
    // await runYourTestSuite(db.url);

    console.log("✅ All tests passed!");
  } finally {
    // Always cleanup
    await db.delete();
    console.log("✅ Ephemeral database cleaned up");
  }
}

/**
 * Example: Create multiple isolated databases
 */
export async function multipleEphemeralDatabases() {
  const apiKey = process.env.NEON_API_KEY;
  if (!apiKey) {
    throw new Error("NEON_API_KEY is required");
  }

  const neon = new NeonToolkit({ apiKey });

  console.log("Creating 3 parallel ephemeral databases...\n");

  const databases = await Promise.all([
    neon.createEphemeralDatabase(),
    neon.createEphemeralDatabase(),
    neon.createEphemeralDatabase(),
  ]);

  console.log(`✅ Created ${databases.length} databases\n`);

  try {
    // Use databases in parallel
    await Promise.all(
      databases.map(async (db, index) => {
        const result = await db.query(`SELECT $1::text as database_number`, [
          index + 1,
        ]);
        console.log(
          `Database ${index + 1}: ${result.rows?.[0]?.database_number}`,
        );
      }),
    );
  } finally {
    // Cleanup all databases
    await Promise.all(databases.map((db) => db.delete()));
    console.log("\n✅ All databases cleaned up");
  }
}

// Export for use in tests
export { runTests };
