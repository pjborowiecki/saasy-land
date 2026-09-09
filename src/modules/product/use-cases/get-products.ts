import { queryOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import { desc } from "drizzle-orm"

import { authorized } from "~/src/integrations/better-auth/auth.middleware"
import { db } from "~/src/integrations/drizzle-orm/drizzle.database"

import { PRODUCT_QUERY_KEYS } from "~/src/modules/product/product.constants"
import { product } from "~/src/modules/product/product.schema"

export const getProducts = createServerFn({ method: "GET" })
  .middleware([authorized({ product: ["read"] })])
  .handler(() => db.select().from(product).orderBy(desc(product.createdAt)))

export const getProductsQuery = queryOptions({ queryFn: () => getProducts(), queryKey: PRODUCT_QUERY_KEYS.LIST })
