/**
 * HTTP Connection Template for Neon Serverless
 *
 * This template demonstrates the HTTP connection pattern,
 * ideal for edge functions and stateless serverless environments.
 *
 * Usage: Best for Vercel Edge Functions, AWS Lambda, Cloudflare Workers, etc.
 */

import { neon } from "@neondatabase/serverless";

// Initialize the HTTP client
// This should be done once per request or in a module-level scope
const sql = neon(process.env.DATABASE_URL!);

/**
 * Example: Query a single row
 */
export async function getUserById(userId: string) {
  try {
    const user = await sql`SELECT * FROM users WHERE id = ${userId}`;
    return user[0] || null;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw error;
  }
}

/**
 * Example: Query multiple rows
 */
export async function getAllUsers() {
  try {
    const users = await sql`SELECT * FROM users ORDER BY created_at DESC`;
    return users;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw error;
  }
}

/**
 * Example: Insert data
 */
export async function createUser(email: string, name: string) {
  try {
    const result = await sql`
      INSERT INTO users (email, name, created_at)
      VALUES (${email}, ${name}, NOW())
      RETURNING id, email, name, created_at
    `;
    return result[0];
  } catch (error) {
    console.error("Failed to create user:", error);
    throw error;
  }
}

/**
 * Example: Update data
 */
export async function updateUser(userId: string, updates: Record<string, any>) {
  try {
    const setClauses = Object.entries(updates)
      .map(([key, value]) => `${key} = ${value}`)
      .join(", ");

    const result = await sql`
      UPDATE users
      SET ${setClauses}, updated_at = NOW()
      WHERE id = ${userId}
      RETURNING *
    `;
    return result[0];
  } catch (error) {
    console.error("Failed to update user:", error);
    throw error;
  }
}

/**
 * Example: Delete data
 */
export async function deleteUser(userId: string) {
  try {
    const result = await sql`
      DELETE FROM users WHERE id = ${userId}
      RETURNING id
    `;
    return result.length > 0;
  } catch (error) {
    console.error("Failed to delete user:", error);
    throw error;
  }
}

/**
 * Example: Transaction-like behavior with multiple queries
 * Note: HTTP doesn't support true transactions, but you can sequence queries
 */
export async function createUserWithProfile(
  email: string,
  name: string,
  bio: string,
) {
  try {
    // Step 1: Create user
    const userResult = await sql`
      INSERT INTO users (email, name)
      VALUES (${email}, ${name})
      RETURNING id
    `;
    const userId = userResult[0].id;

    // Step 2: Create profile
    const profileResult = await sql`
      INSERT INTO profiles (user_id, bio)
      VALUES (${userId}, ${bio})
      RETURNING *
    `;

    return { userId, profile: profileResult[0] };
  } catch (error) {
    console.error("Failed to create user with profile:", error);
    throw error;
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
  try {
    const results = await sql`
      SELECT * FROM users
      WHERE name ILIKE ${"%" + query + "%"}
      OR email ILIKE ${"%" + query + "%"}
      ORDER BY created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;
    return results;
  } catch (error) {
    console.error("Failed to search users:", error);
    throw error;
  }
}

/**
 * Example: Aggregate query
 */
export async function getUserStats() {
  try {
    const stats = await sql`
      SELECT
        COUNT(*) as total_users,
        COUNT(CASE WHEN created_at > NOW() - INTERVAL '30 days' THEN 1 END) as new_users_30d,
        MIN(created_at) as oldest_user,
        MAX(created_at) as newest_user
      FROM users
    `;
    return stats[0];
  } catch (error) {
    console.error("Failed to fetch user stats:", error);
    throw error;
  }
}

/**
 * Example: Join query
 */
export async function getUserWithProfile(userId: string) {
  try {
    const result = await sql`
      SELECT u.*, p.bio, p.avatar_url
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      WHERE u.id = ${userId}
    `;
    return result[0] || null;
  } catch (error) {
    console.error("Failed to fetch user with profile:", error);
    throw error;
  }
}
