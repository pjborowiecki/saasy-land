"use server"

import { cacheLife, cacheTag } from "next/cache"

import { desc, eq } from "drizzle-orm"
import { z } from "zod/v4"

import { db } from "~/src/platform/db/client"

import { ADMIN_USERS_CACHE_TAG } from "~/src/modules/user/user.constants"
import { user } from "~/src/modules/user/user.schema"
import { userZodSchemas } from "~/src/modules/user/user.zod"

import { PERMISSIONS } from "~/src/integrations/better-auth/auth.access"
import { authedActionClient } from "~/src/integrations/next-safe-action/action.client"

export const listUsers = authedActionClient(PERMISSIONS.user.list)
  .outputSchema(z.array(userZodSchemas.select))
  .action(async () => {
    "use cache"

    cacheTag(ADMIN_USERS_CACHE_TAG)
    cacheLife("minutes")

    const rows = await db.select().from(user).where(eq(user.isAnonymous, false)).orderBy(desc(user.createdAt))
    return rows
  })
