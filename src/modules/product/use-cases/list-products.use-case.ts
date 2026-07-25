"use server"

import { desc } from "drizzle-orm"
import { z } from "zod/v4"

import { db } from "~/src/platform/db/client"

import { product } from "~/src/modules/product/product.schema"
import { productZodSchemas } from "~/src/modules/product/product.zod"

import { PERMISSIONS } from "~/src/integrations/better-auth/auth.access"
import { authedActionClient } from "~/src/integrations/next-safe-action/action.client"

export const listProducts = authedActionClient(PERMISSIONS.product.read)
  .outputSchema(z.array(productZodSchemas.select))
  .action(async () => {
    const rows = await db.select().from(product).orderBy(desc(product.createdAt))
    return rows
  })
