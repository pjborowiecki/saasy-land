"use server"

import { eq } from "drizzle-orm"

import { db } from "~/src/platform/db/client"

import { AppError, ERROR_CODES } from "~/src/modules/_core/constants/errors"
import { product } from "~/src/modules/product/product.schema"
import { productZodSchemas } from "~/src/modules/product/product.zod"

import { actionClient, withAuth } from "~/src/integrations/next-safe-action/action.client"

export const updateProduct = actionClient
  .use(withAuth({ product: ["update"] }))
  .inputSchema(productZodSchemas.updateProduct)
  .outputSchema(productZodSchemas.select)
  .action(async ({ parsedInput }) => {
    const { productId, ...fields } = parsedInput

    const [row] = await db.update(product).set(fields).where(eq(product.id, productId)).returning()

    if (row === undefined) {
      throw new AppError(ERROR_CODES.NOT_FOUND, "product.errors.notFound")
    }

    return row
  })
