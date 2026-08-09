"use server"

import { randomUUIDv7 } from "bun"

import { db } from "~/src/platform/db/client"

import { category } from "~/src/modules/category/category.schema"
import { categoryZodSchemas } from "~/src/modules/category/category.zod"

import { actionClient, withAuth } from "~/src/integrations/next-safe-action/action.client"

export const createCategory = actionClient
  .use(withAuth({ category: ["create"] }))
  .inputSchema(categoryZodSchemas.createCategory)
  .outputSchema(categoryZodSchemas.select)
  .action(async ({ parsedInput }) => {
    const [row] = await db
      .insert(category)
      .values({
        description: parsedInput.description ?? "",
        icon: parsedInput.icon ?? "FolderOpen",
        id: randomUUIDv7(),
        kind: parsedInput.kind,
        name: parsedInput.name,
        visibility: parsedInput.visibility ?? "public",
      })
      .returning()

    return row!
  })
