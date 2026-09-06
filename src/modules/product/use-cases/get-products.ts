import { queryOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import { desc } from "drizzle-orm"

import { hasPermission } from "~/src/integrations/better-auth/auth.access"
import { getCurrentSession } from "~/src/integrations/better-auth/auth.session"
import { db } from "~/src/integrations/drizzle-orm/drizzle.database"

import { AppError, ERROR_CODES } from "~/src/modules/_core/constants/errors"
import { product } from "~/src/modules/product/product.schema"

const loadProducts = async () => {
  const rows = await db.select().from(product).orderBy(desc(product.createdAt))
  return rows
}

export const getProducts = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getCurrentSession()

  if (!session) {
    throw new AppError(ERROR_CODES.UNAUTHORIZED)
  }

  if (!hasPermission(session.user.role, { product: ["read"] })) {
    throw new AppError(ERROR_CODES.FORBIDDEN)
  }

  return loadProducts()
})

export const getProductsQuery = queryOptions({ queryFn: () => getProducts(), queryKey: ["product", "getProducts"] })
