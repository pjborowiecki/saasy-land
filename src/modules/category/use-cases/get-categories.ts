import { queryOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import { desc } from "drizzle-orm"

import { authorized } from "~/src/integrations/better-auth/auth.middleware"
import { db } from "~/src/integrations/drizzle-orm/drizzle.database"

import { CATEGORY_QUERY_KEYS } from "~/src/modules/category/category.constants"
import { category } from "~/src/modules/category/category.schema"

export const getCategories = createServerFn({ method: "GET" })
  .middleware([authorized({ category: ["read"] })])
  .handler(() => db.select().from(category).orderBy(desc(category.createdAt)))

export const getCategoriesQuery = queryOptions({ queryFn: () => getCategories(), queryKey: CATEGORY_QUERY_KEYS.LIST })
