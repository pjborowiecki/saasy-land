"use server"

import { eq } from "drizzle-orm"

import { db } from "~/src/platform/db/client"

import { DomainError } from "~/src/modules/_core/errors/domain-error"
import { PRODUCT_ERROR_MESSAGE } from "~/src/modules/product/product.errors"
import { product } from "~/src/modules/product/product.schema"
import { productZodSchemas } from "~/src/modules/product/product.zod"

import { PERMISSIONS } from "~/src/integrations/better-auth/auth.access"
import { authedActionClient } from "~/src/integrations/next-safe-action/action.client"

const SINGLE_ROW_LIMIT = 1

export const getProduct = authedActionClient(PERMISSIONS.product.read)
  .inputSchema(productZodSchemas.getProduct)
  .outputSchema(productZodSchemas.select)
  .action(async ({ parsedInput }) => {
    const [row] = await db.select().from(product).where(eq(product.id, parsedInput.productId)).limit(SINGLE_ROW_LIMIT)

    if (row === undefined) {
      throw new DomainError("NOT_FOUND", PRODUCT_ERROR_MESSAGE.notFound)
    }

    return row
  })
