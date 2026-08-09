import "server-only"

import { cacheLife, cacheTag } from "next/cache"
import { forbidden, unauthorized } from "next/navigation"

import { desc } from "drizzle-orm"

import { db } from "~/src/platform/db/client"

import { product } from "~/src/modules/product/product.schema"

import { hasPermission } from "~/src/integrations/better-auth/auth.access"
import { getCurrentSession } from "~/src/integrations/better-auth/auth.session"

/**
 * The query alone is cached: `"use cache"` cannot read request APIs, and caching `getProducts`
 * whole would cache the authorization verdict along with the rows.
 */
async function loadProducts() {
  "use cache"

  cacheTag("admin-products")
  cacheLife("minutes")

  const rows = await db.select().from(product).orderBy(desc(product.createdAt))
  return rows
}

export async function getProducts() {
  const session = await getCurrentSession()

  if (!session) {
    unauthorized()
  }

  if (!hasPermission(session.user.role, { product: ["read"] })) {
    forbidden()
  }

  return loadProducts()
}
