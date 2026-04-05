/**
 * WebSocket Pool Template for Neon Serverless
 *
 * This template demonstrates the WebSocket connection pattern,
 * ideal for Node.js servers and applications needing persistent connections.
 *
 * Usage: Best for Next.js API routes, Express servers, and long-lived applications
 */

import { Pool, PoolClient } from "@neondatabase/serverless";

// Create a global pool instance (reused across requests)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum number of connections in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Optional: Log pool events
pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

/**
 * Helper: Get a connection from the pool
 */
async function withConnection<T>(
  callback: (client: PoolClient) => Promise<T>,
): Promise<T> {
  const client = await pool.connect();
  try {
    return await callback(client);
  } finally {
    client.release();
  }
}

/**
 * Example: Query a single row
 */
export async function getUserById(userId: string) {
  return withConnection(async (client) => {
    const result = await client.query("SELECT * FROM users WHERE id = $1", [
      userId,
    ]);
    return result.rows[0] || null;
  });
}

/**
 * Example: Query multiple rows
 */
export async function getAllUsers() {
  return withConnection(async (client) => {
    const result = await client.query(
      "SELECT * FROM users ORDER BY created_at DESC",
    );
    return result.rows;
  });
}

/**
 * Example: Insert data
 */
export async function createUser(email: string, name: string) {
  return withConnection(async (client) => {
    const result = await client.query(
      `INSERT INTO users (email, name, created_at)
       VALUES ($1, $2, NOW())
       RETURNING id, email, name, created_at`,
      [email, name],
    );
    return result.rows[0];
  });
}

/**
 * Example: Update data
 */
export async function updateUser(userId: string, updates: Record<string, any>) {
  return withConnection(async (client) => {
    const keys = Object.keys(updates);
    const values = Object.values(updates);
    const setClauses = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");

    const result = await client.query(
      `UPDATE users SET ${setClauses}, updated_at = NOW()
       WHERE id = $${keys.length + 1}
       RETURNING *`,
      [...values, userId],
    );
    return result.rows[0];
  });
}

/**
 * Example: Delete data
 */
export async function deleteUser(userId: string) {
  return withConnection(async (client) => {
    const result = await client.query("DELETE FROM users WHERE id = $1", [
      userId,
    ]);
    return result.rowCount > 0;
  });
}

/**
 * Example: Transaction support (unique to WebSocket connections)
 * Transactions allow multiple queries to be atomic
 */
export async function createUserWithProfileTx(
  email: string,
  name: string,
  bio: string,
) {
  const client = await pool.connect();

  try {
    // Start transaction
    await client.query("BEGIN");

    // Step 1: Create user
    const userResult = await client.query(
      "INSERT INTO users (email, name) VALUES ($1, $2) RETURNING id",
      [email, name],
    );
    const userId = userResult.rows[0].id;

    // Step 2: Create profile
    const profileResult = await client.query(
      "INSERT INTO profiles (user_id, bio) VALUES ($1, $2) RETURNING *",
      [userId, bio],
    );

    // Commit transaction
    await client.query("COMMIT");

    return { userId, profile: profileResult.rows[0] };
  } catch (error) {
    // Rollback on error
    await client.query("ROLLBACK");
    console.error("Transaction failed:", error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Example: Query with filtering and pagination
 */
export async function searchUsers(
  query: string,
  limit: number = 10,
  offset: number = 0,
) {
  return withConnection(async (client) => {
    const result = await client.query(
      `SELECT * FROM users
       WHERE name ILIKE $1 OR email ILIKE $2
       ORDER BY created_at DESC
       LIMIT $3 OFFSET $4`,
      [`%${query}%`, `%${query}%`, limit, offset],
    );
    return result.rows;
  });
}

/**
 * Example: Aggregate query
 */
export async function getUserStats() {
  return withConnection(async (client) => {
    const result = await client.query(`
      SELECT
        COUNT(*) as total_users,
        COUNT(CASE WHEN created_at > NOW() - INTERVAL '30 days' THEN 1 END) as new_users_30d,
        MIN(created_at) as oldest_user,
        MAX(created_at) as newest_user
      FROM users
    `);
    return result.rows[0];
  });
}

/**
 * Example: Join query
 */
export async function getUserWithProfile(userId: string) {
  return withConnection(async (client) => {
    const result = await client.query(
      `SELECT u.*, p.bio, p.avatar_url
       FROM users u
       LEFT JOIN profiles p ON u.id = p.user_id
       WHERE u.id = $1`,
      [userId],
    );
    return result.rows[0] || null;
  });
}

/**
 * Example: Batch operations
 */
export async function createMultipleUsers(
  users: Array<{ email: string; name: string }>,
) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const results = [];
    for (const user of users) {
      const result = await client.query(
        `INSERT INTO users (email, name, created_at)
         VALUES ($1, $2, NOW())
         RETURNING id, email, name`,
        [user.email, user.name],
      );
      results.push(result.rows[0]);
    }

    await client.query("COMMIT");
    return results;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Cleanup: Drain the pool when shutting down
 */
export async function closePool() {
  await pool.end();
  console.log("Connection pool closed");
}
