"use server"

import { uuidv7 } from "uuidv7"

import { db } from "~/src/platform/db/client"

import { DEFAULT_CURRENCY_CODE } from "~/src/modules/_core/constants/currency"
import { product } from "~/src/modules/product/product.schema"
import { productZodSchemas } from "~/src/modules/product/product.zod"

import { actionClient, withAuth } from "~/src/integrations/next-safe-action/action.client"

export const createProduct = actionClient
  .use(withAuth({ product: ["create"] }))
  .inputSchema(productZodSchemas.createProduct)
  .outputSchema(productZodSchemas.select)
  .action(async ({ parsedInput }) => {
    const [row] = await db
      .insert(product)
      .values({
        billingCycle: parsedInput.billingCycle,
        currency: parsedInput.currency ?? DEFAULT_CURRENCY_CODE,
        description: parsedInput.description ?? "",
        id: uuidv7(),
        name: parsedInput.name,
        priceCents: parsedInput.priceCents,
        status: parsedInput.status ?? "draft",
        type: parsedInput.type,
      })
      .returning()

    return row!
  })
