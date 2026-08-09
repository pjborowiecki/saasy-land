import "server-only"

import { cacheLife, cacheTag } from "next/cache"
import { forbidden, unauthorized } from "next/navigation"

import { desc } from "drizzle-orm"

import { db } from "~/src/platform/db/client"

import { category } from "~/src/modules/category/category.schema"

import { hasPermission } from "~/src/integrations/better-auth/auth.access"
import { getCurrentSession } from "~/src/integrations/better-auth/auth.session"

/**
 * The query alone is cached: `"use cache"` cannot read request APIs, and caching `getCategories`
 * whole would cache the authorization verdict along with the rows.
 */
async function loadCategories() {
  "use cache"

  cacheTag("admin-categories")
  cacheLife("minutes")

  const rows = await db.select().from(category).orderBy(desc(category.createdAt))
  return rows
}

export async function getCategories() {
  const session = await getCurrentSession()

  if (!session) {
    unauthorized()
  }

  if (!hasPermission(session.user.role, { category: ["read"] })) {
    forbidden()
  }

  return loadCategories()
}
