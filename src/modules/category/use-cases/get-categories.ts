import { queryOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import { desc } from "drizzle-orm"

import { hasPermission } from "~/src/integrations/better-auth/auth.access"
import { getCurrentSession } from "~/src/integrations/better-auth/auth.session"
import { db } from "~/src/integrations/drizzle-orm/drizzle.database"

import { AppError, ERROR_CODES } from "~/src/modules/_core/constants/errors"
import { category } from "~/src/modules/category/category.schema"

const loadCategories = async () => {
  const rows = await db.select().from(category).orderBy(desc(category.createdAt))
  return rows
}

export const getCategories = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getCurrentSession()

  if (!session) {
    throw new AppError(ERROR_CODES.UNAUTHORIZED)
  }

  if (!hasPermission(session.user.role, { category: ["read"] })) {
    throw new AppError(ERROR_CODES.FORBIDDEN)
  }

  return loadCategories()
})

export const getCategoriesQuery = queryOptions({ queryFn: () => getCategories(), queryKey: ["category", "getCategories"] })
