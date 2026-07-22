"use server"

import { desc } from "drizzle-orm"
import { z } from "zod/v4"

import { db } from "~/src/platform/db/client"

import { category } from "~/src/modules/category/category.schema"
import { categoryZodSchemas } from "~/src/modules/category/category.zod"

import { PERMISSIONS } from "~/src/integrations/better-auth/auth.access"
import { authedActionClient } from "~/src/integrations/next-safe-action/action.client"

export const listCategories = authedActionClient(PERMISSIONS.category.read)
  .outputSchema(z.array(categoryZodSchemas.select))
  .action(() => db.select().from(category).orderBy(desc(category.createdAt)))
