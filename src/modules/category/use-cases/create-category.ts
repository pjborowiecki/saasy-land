import { mutationOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import { v7 } from "uuid"
import type * as zod from "zod"

import { authorized } from "~/src/integrations/better-auth/auth.middleware"
import { db } from "~/src/integrations/drizzle-orm/drizzle.database"

import { CATEGORY_MUTATION_KEYS } from "~/src/modules/category/category.constants"
import { category } from "~/src/modules/category/category.schema"
import { categoryZodSchemas } from "~/src/modules/category/category.zod"

export const createCategory = createServerFn({ method: "POST" })
  .middleware([authorized({ category: ["create"] })])
  .validator((input: zod.input<typeof categoryZodSchemas.createCategory>) => categoryZodSchemas.createCategory.parse(input))
  .handler(async ({ data }) => {
    const [row] = await db
      .insert(category)
      .values({
        description: data.description ?? "",
        icon: data.icon ?? "FolderOpen",
        id: v7(),
        kind: data.kind,
        name: data.name,
        visibility: data.visibility ?? "public",
      })
      .returning()

    return row!
  })

export const createCategoryMutation = mutationOptions({
  mutationFn: (data: Parameters<typeof createCategory>[0]["data"]) => createCategory({ data }),
  mutationKey: CATEGORY_MUTATION_KEYS.CREATE,
})
