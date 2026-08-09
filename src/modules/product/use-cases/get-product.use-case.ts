import "server-only"

import { forbidden, notFound, unauthorized } from "next/navigation"

import { eq } from "drizzle-orm"

import { db } from "~/src/platform/db/client"

import { product } from "~/src/modules/product/product.schema"

import { hasPermission } from "~/src/integrations/better-auth/auth.access"
import { getCurrentSession } from "~/src/integrations/better-auth/auth.session"

const SINGLE_ROW_LIMIT = 1

export async function getProduct(productId: string) {
  const session = await getCurrentSession()

  if (!session) {
    unauthorized()
  }

  if (!hasPermission(session?.user.role, { product: ["read"] })) {
    forbidden()
  }

  const [row] = await db.select().from(product).where(eq(product.id, productId)).limit(SINGLE_ROW_LIMIT)

  if (row === undefined) {
    notFound()
  }

  return row
}
