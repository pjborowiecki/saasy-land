import { mutationOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import { eq } from "drizzle-orm"
import type * as zod from "zod"

import { authorized } from "~/src/integrations/better-auth/auth.middleware"
import { db } from "~/src/integrations/drizzle-orm/drizzle.database"

import { AppError, ERROR_CODES } from "~/src/modules/_core/constants/errors"
import { CATEGORY_MUTATION_KEYS } from "~/src/modules/category/category.constants"
import { category } from "~/src/modules/category/category.schema"
import { categoryZodSchemas } from "~/src/modules/category/category.zod"

export const deleteCategory = createServerFn({ method: "POST" })
  .middleware([authorized({ category: ["delete"] })])
  .validator((input: zod.input<typeof categoryZodSchemas.deleteCategory>) => categoryZodSchemas.deleteCategory.parse(input))
  .handler(async ({ data }) => {
    const [row] = await db.delete(category).where(eq(category.id, data.categoryId)).returning({ id: category.id })

    if (row === undefined) {
      throw new AppError(ERROR_CODES.NOT_FOUND, "category.errors.notFound")
    }

    return row
  })

export const deleteCategoryMutation = mutationOptions({
  mutationFn: (data: Parameters<typeof deleteCategory>[0]["data"]) => deleteCategory({ data }),
  mutationKey: CATEGORY_MUTATION_KEYS.DELETE,
})
