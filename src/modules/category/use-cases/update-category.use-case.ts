"use server"

import { eq } from "drizzle-orm"

import { db } from "~/src/platform/db/client"

import { DomainError } from "~/src/modules/_core/errors/domain-error"
import { CATEGORY_ERROR_MESSAGE } from "~/src/modules/category/category.errors"
import { category } from "~/src/modules/category/category.schema"
import { categoryZodSchemas } from "~/src/modules/category/category.zod"

import { PERMISSIONS } from "~/src/integrations/better-auth/auth.access"
import { authedActionClient } from "~/src/integrations/next-safe-action/action.client"

export const updateCategory = authedActionClient(PERMISSIONS.category.update)
  .inputSchema(categoryZodSchemas.updateCategory)
  .outputSchema(categoryZodSchemas.select)
  .action(async ({ parsedInput }) => {
    const { categoryId, ...fields } = parsedInput

    const [row] = await db.update(category).set(fields).where(eq(category.id, categoryId)).returning()

    if (row === undefined) {
      throw new DomainError("NOT_FOUND", CATEGORY_ERROR_MESSAGE.notFound)
    }

    return row
  })
