import { mutationOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import { eq } from "drizzle-orm"
import type * as zod from "zod"

import { withAuth } from "~/src/integrations/better-auth/auth.middleware"
import { db } from "~/src/integrations/drizzle-orm/drizzle.database"

import { AppError, ERROR_CODES } from "~/src/modules/_core/constants/errors"
import { product } from "~/src/modules/product/product.schema"
import { productZodSchemas } from "~/src/modules/product/product.zod"

export const deleteProduct = createServerFn({ method: "POST" })
  .middleware([withAuth({ product: ["delete"] })])
  .validator((input: zod.input<typeof productZodSchemas.deleteProduct>) => productZodSchemas.deleteProduct.parse(input))
  .handler(async ({ data }) => {
    const [row] = await db.delete(product).where(eq(product.id, data.productId)).returning({ id: product.id })

    if (row === undefined) {
      throw new AppError(ERROR_CODES.NOT_FOUND, "product.errors.notFound")
    }

    return row
  })

export const deleteProductMutation = mutationOptions({
  mutationFn: (data: Parameters<typeof deleteProduct>[0]["data"]) => deleteProduct({ data }),
  mutationKey: ["product", "deleteProduct"],
})
