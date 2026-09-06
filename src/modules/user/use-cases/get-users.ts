import { queryOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import { desc } from "drizzle-orm"

import { hasPermission } from "~/src/integrations/better-auth/auth.access"
import { getCurrentSession } from "~/src/integrations/better-auth/auth.session"
import { db } from "~/src/integrations/drizzle-orm/drizzle.database"

import { AppError, ERROR_CODES } from "~/src/modules/_core/constants/errors"
import { user } from "~/src/modules/user/user.schema"

const loadUsers = async () => {
  const rows = await db.select().from(user).orderBy(desc(user.createdAt))
  return rows
}

export const getUsers = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getCurrentSession()

  if (!session) {
    throw new AppError(ERROR_CODES.UNAUTHORIZED)
  }

  if (!hasPermission(session.user.role, { user: ["list"] })) {
    throw new AppError(ERROR_CODES.FORBIDDEN)
  }

  return loadUsers()
})

export const getUsersQuery = queryOptions({ queryFn: () => getUsers(), queryKey: ["user", "getUsers"] })
