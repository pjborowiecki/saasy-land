"use server"

import { eq } from "drizzle-orm"
import { z } from "zod/v4"

import { db } from "~/src/platform/db/client"

import { DomainError } from "~/src/modules/_core/errors/domain-error"
import { userIdField } from "~/src/modules/_core/utils/zod-fields"
import { PRODUCT_ERROR_MESSAGE } from "~/src/modules/product/product.errors"
import { product } from "~/src/modules/product/product.schema"
import { productZodSchemas } from "~/src/modules/product/product.zod"

import { PERMISSIONS } from "~/src/integrations/better-auth/auth.access"
import { authedActionClient } from "~/src/integrations/next-safe-action/action.client"

export const deleteProduct = authedActionClient(PERMISSIONS.product.delete)
  .inputSchema(productZodSchemas.deleteProduct)
  .outputSchema(z.object({ id: userIdField }))
  .action(async ({ parsedInput }) => {
    const [row] = await db.delete(product).where(eq(product.id, parsedInput.productId)).returning({ id: product.id })

    if (row === undefined) {
      throw new DomainError("NOT_FOUND", PRODUCT_ERROR_MESSAGE.notFound)
    }

    return row
  })
