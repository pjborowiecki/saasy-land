"use server"

import { randomUUIDv7 } from "bun"

import { db } from "~/src/platform/db/client"

import { category } from "~/src/modules/category/category.schema"
import { categoryZodSchemas } from "~/src/modules/category/category.zod"

import { PERMISSIONS } from "~/src/integrations/better-auth/auth.access"
import { authedActionClient } from "~/src/integrations/next-safe-action/action.client"

export const createCategory = authedActionClient(PERMISSIONS.category.create)
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
