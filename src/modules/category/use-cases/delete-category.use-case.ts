"use server"

import { eq } from "drizzle-orm"
import z from "zod/v4"

import { db } from "~/src/platform/db/client"

import { AppError, ERROR_CODES } from "~/src/modules/_core/constants/errors"
import { userIdField } from "~/src/modules/_core/utils/zod-fields"
import { category } from "~/src/modules/category/category.schema"
import { categoryZodSchemas } from "~/src/modules/category/category.zod"

import { actionClient, withAuth } from "~/src/integrations/next-safe-action/action.client"

export const deleteCategory = actionClient
  .use(withAuth({ category: ["delete"] }))
  .inputSchema(categoryZodSchemas.deleteCategory)
  .outputSchema(z.object({ id: userIdField }))
  .action(async ({ parsedInput }) => {
    const [row] = await db.delete(category).where(eq(category.id, parsedInput.categoryId)).returning({ id: category.id })

    if (row === undefined) {
      throw new AppError(ERROR_CODES.NOT_FOUND, "category.errors.notFound")
    }

    return row
  })
