import { createServerFn } from "@tanstack/react-start"
import { eq } from "drizzle-orm"

import { hasPermission } from "~/src/integrations/better-auth/auth.access"
import { getCurrentSession } from "~/src/integrations/better-auth/auth.session"
import { db } from "~/src/integrations/drizzle-orm/drizzle.database"

import { AppError, ERROR_CODES } from "~/src/modules/_core/constants/errors"
import { category } from "~/src/modules/category/category.schema"

const SINGLE_ROW_LIMIT = 1

export const getCategory = createServerFn({ method: "GET" })
  .validator((data: string) => data)
  .handler(async ({ data: categoryId }) => {
    const session = await getCurrentSession()

    if (!session) {
      throw new AppError(ERROR_CODES.UNAUTHORIZED)
    }

    if (!hasPermission(session.user.role, { category: ["read"] })) {
      throw new AppError(ERROR_CODES.FORBIDDEN)
    }

    const [row] = await db.select().from(category).where(eq(category.id, categoryId)).limit(SINGLE_ROW_LIMIT)

    if (row === undefined) {
      throw new AppError(ERROR_CODES.NOT_FOUND)
    }

    return row
  })
