import "server-only"

import { forbidden, notFound, unauthorized } from "next/navigation"

import { eq } from "drizzle-orm"

import { db } from "~/src/platform/db/client"

import { category } from "~/src/modules/category/category.schema"

import { hasPermission } from "~/src/integrations/better-auth/auth.access"
import { getCurrentSession } from "~/src/integrations/better-auth/auth.session"

const SINGLE_ROW_LIMIT = 1

export async function getCategory(categoryId: string) {
  const session = await getCurrentSession()

  if (!session) {
    unauthorized()
  }

  if (!hasPermission(session?.user.role, { category: ["read"] })) {
    forbidden()
  }

  const [row] = await db.select().from(category).where(eq(category.id, categoryId)).limit(SINGLE_ROW_LIMIT)

  if (row === undefined) {
    notFound()
  }

  return row
}
