"use server"

import { eq } from "drizzle-orm"

import { db } from "~/src/platform/db/client"

import { DomainError } from "~/src/modules/_core/errors/domain-error"
import { CATEGORY_ERROR_MESSAGE } from "~/src/modules/category/category.errors"
import { category } from "~/src/modules/category/category.schema"
import { categoryZodSchemas } from "~/src/modules/category/category.zod"

import { PERMISSIONS } from "~/src/integrations/better-auth/auth.access"
import { authedActionClient } from "~/src/integrations/next-safe-action/action.client"

const SINGLE_ROW_LIMIT = 1

export const getCategory = authedActionClient(PERMISSIONS.category.read)
  .inputSchema(categoryZodSchemas.getCategory)
  .outputSchema(categoryZodSchemas.select)
  .action(async ({ parsedInput }) => {
    const [row] = await db.select().from(category).where(eq(category.id, parsedInput.categoryId)).limit(SINGLE_ROW_LIMIT)

    if (row === undefined) {
      throw new DomainError("NOT_FOUND", CATEGORY_ERROR_MESSAGE.notFound)
    }

    return row
  })
