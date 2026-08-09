"use server"

import { eq } from "drizzle-orm"

import { db } from "~/src/platform/db/client"

import { AppError, ERROR_CODES } from "~/src/modules/_core/constants/errors"
import { category } from "~/src/modules/category/category.schema"
import { categoryZodSchemas } from "~/src/modules/category/category.zod"

import { actionClient, withAuth } from "~/src/integrations/next-safe-action/action.client"

export const updateCategory = actionClient
  .use(withAuth({ category: ["update"] }))
  .inputSchema(categoryZodSchemas.updateCategory)
  .outputSchema(categoryZodSchemas.select)
  .action(async ({ parsedInput }) => {
    const { categoryId, ...fields } = parsedInput

    const [row] = await db.update(category).set(fields).where(eq(category.id, categoryId)).returning()

    if (row === undefined) {
      throw new AppError(ERROR_CODES.NOT_FOUND, "category.errors.notFound")
    }

    return row
  })
