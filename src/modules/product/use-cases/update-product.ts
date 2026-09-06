import { mutationOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import { eq } from "drizzle-orm"
import type * as zod from "zod"

import { withAuth } from "~/src/integrations/better-auth/auth.middleware"
import { db } from "~/src/integrations/drizzle-orm/drizzle.database"

import { AppError, ERROR_CODES } from "~/src/modules/_core/constants/errors"
import { product } from "~/src/modules/product/product.schema"
import { productZodSchemas } from "~/src/modules/product/product.zod"

export const updateProduct = createServerFn({ method: "POST" })
  .middleware([withAuth({ product: ["update"] })])
  .validator((input: zod.input<typeof productZodSchemas.updateProduct>) => productZodSchemas.updateProduct.parse(input))
  .handler(async ({ data }) => {
    const { productId, ...fields } = data

    const [row] = await db.update(product).set(fields).where(eq(product.id, productId)).returning()

    if (row === undefined) {
      throw new AppError(ERROR_CODES.NOT_FOUND, "product.errors.notFound")
    }

    return row
  })

export const updateProductMutation = mutationOptions({
  mutationFn: (data: Parameters<typeof updateProduct>[0]["data"]) => updateProduct({ data }),
  mutationKey: ["product", "updateProduct"],
})
