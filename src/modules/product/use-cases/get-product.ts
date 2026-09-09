import { createServerFn } from "@tanstack/react-start"
import { eq } from "drizzle-orm"

import { authorized } from "~/src/integrations/better-auth/auth.middleware"
import { db } from "~/src/integrations/drizzle-orm/drizzle.database"

import { AppError, ERROR_CODES } from "~/src/modules/_core/constants/errors"
import { product } from "~/src/modules/product/product.schema"

const SINGLE_ROW_LIMIT = 1

export const getProduct = createServerFn({ method: "GET" })
  .middleware([authorized({ product: ["read"] })])
  .validator((data: string) => data)
  .handler(async ({ data: productId }) => {
    const [row] = await db.select().from(product).where(eq(product.id, productId)).limit(SINGLE_ROW_LIMIT)

    if (row === undefined) {
      throw new AppError(ERROR_CODES.NOT_FOUND)
    }

    return row
  })
