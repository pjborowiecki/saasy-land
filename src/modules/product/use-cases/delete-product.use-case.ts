"use server"

import { eq } from "drizzle-orm"
import { z } from "zod/v4"

import { db } from "~/src/platform/db/client"

import { AppError, ERROR_CODES } from "~/src/modules/_core/constants/errors"
import { userIdField } from "~/src/modules/_core/utils/zod-fields"
import { product } from "~/src/modules/product/product.schema"
import { productZodSchemas } from "~/src/modules/product/product.zod"

import { actionClient, withAuth } from "~/src/integrations/next-safe-action/action.client"

export const deleteProduct = actionClient
  .use(withAuth({ product: ["delete"] }))
  .inputSchema(productZodSchemas.deleteProduct)
  .outputSchema(z.object({ id: userIdField }))
  .action(async ({ parsedInput }) => {
    const [row] = await db.delete(product).where(eq(product.id, parsedInput.productId)).returning({ id: product.id })

    if (row === undefined) {
      throw new AppError(ERROR_CODES.NOT_FOUND, "product.errors.notFound")
    }

    return row
  })
