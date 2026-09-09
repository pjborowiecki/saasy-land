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

export const updateCategory = createServerFn({ method: "POST" })
  .middleware([authorized({ category: ["update"] })])
  .validator((input: zod.input<typeof categoryZodSchemas.updateCategory>) => categoryZodSchemas.updateCategory.parse(input))
  .handler(async ({ data }) => {
    const { categoryId, ...fields } = data

    const [row] = await db.update(category).set(fields).where(eq(category.id, categoryId)).returning()

    if (row === undefined) {
      throw new AppError(ERROR_CODES.NOT_FOUND, "category.errors.notFound")
    }

    return row
  })

export const updateCategoryMutation = mutationOptions({
  mutationFn: (data: Parameters<typeof updateCategory>[0]["data"]) => updateCategory({ data }),
  mutationKey: CATEGORY_MUTATION_KEYS.UPDATE,
})
