"use server"

import { eq } from "drizzle-orm"
import { z } from "zod/v4"

import { db } from "~/src/platform/db/client"

import { DomainError } from "~/src/modules/_core/errors/domain-error"
import { userIdField } from "~/src/modules/_core/utils/zod-fields"
import { CATEGORY_ERROR_MESSAGE } from "~/src/modules/category/category.errors"
import { category } from "~/src/modules/category/category.schema"
import { categoryZodSchemas } from "~/src/modules/category/category.zod"

import { PERMISSIONS } from "~/src/integrations/better-auth/auth.access"
import { authedActionClient } from "~/src/integrations/next-safe-action/action.client"

export const deleteCategory = authedActionClient(PERMISSIONS.category.delete)
  .inputSchema(categoryZodSchemas.deleteCategory)
  .outputSchema(z.object({ id: userIdField }))
  .action(async ({ parsedInput }) => {
    const [row] = await db.delete(category).where(eq(category.id, parsedInput.categoryId)).returning({ id: category.id })

    if (row === undefined) {
      throw new DomainError("NOT_FOUND", CATEGORY_ERROR_MESSAGE.notFound)
    }

    return row
  })
