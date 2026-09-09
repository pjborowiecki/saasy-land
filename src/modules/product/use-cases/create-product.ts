import { mutationOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import { v7 } from "uuid"
import type * as zod from "zod"

import { authorized } from "~/src/integrations/better-auth/auth.middleware"
import { db } from "~/src/integrations/drizzle-orm/drizzle.database"

import { DEFAULT_CURRENCY_CODE } from "~/src/modules/_core/constants/currency"
import { PRODUCT_MUTATION_KEYS } from "~/src/modules/product/product.constants"
import { product } from "~/src/modules/product/product.schema"
import { productZodSchemas } from "~/src/modules/product/product.zod"

export const createProduct = createServerFn({ method: "POST" })
  .middleware([authorized({ product: ["create"] })])
  .validator((input: zod.input<typeof productZodSchemas.createProduct>) => productZodSchemas.createProduct.parse(input))
  .handler(async ({ data }) => {
    const [row] = await db
      .insert(product)
      .values({
        billingCycle: data.billingCycle,
        currency: data.currency ?? DEFAULT_CURRENCY_CODE,
        description: data.description ?? "",
        id: v7(),
        name: data.name,
        priceCents: data.priceCents,
        status: data.status ?? "draft",
        type: data.type,
      })
      .returning()

    return row!
  })

export const createProductMutation = mutationOptions({
  mutationFn: (data: Parameters<typeof createProduct>[0]["data"]) => createProduct({ data }),
  mutationKey: PRODUCT_MUTATION_KEYS.CREATE,
})
