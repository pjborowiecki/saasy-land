import { queryOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import { desc } from "drizzle-orm"

import { authorized } from "~/src/integrations/better-auth/auth.middleware"
import { db } from "~/src/integrations/drizzle-orm/drizzle.database"

import { USER_QUERY_KEYS } from "~/src/modules/user/user.constants"
import { user } from "~/src/modules/user/user.schema"

export const getUsers = createServerFn({ method: "GET" })
  .middleware([authorized({ user: ["list"] })])
  .handler(() => db.select().from(user).orderBy(desc(user.createdAt)))

export const getUsersQuery = queryOptions({ queryFn: () => getUsers(), queryKey: USER_QUERY_KEYS.LIST })
