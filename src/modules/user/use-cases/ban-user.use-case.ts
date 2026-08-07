"use server"

import { updateTag } from "next/cache"

import { ADMIN_USERS_CACHE_TAG } from "~/src/modules/user/user.constants"
import { userZodSchemas } from "~/src/modules/user/user.zod"

import { PERMISSIONS } from "~/src/integrations/better-auth/auth.access"
import { auth } from "~/src/integrations/better-auth/auth.server"
import { authedActionClient } from "~/src/integrations/next-safe-action/action.client"

export const banUser = authedActionClient(PERMISSIONS.user.ban)
  .inputSchema(userZodSchemas.banUser)
  .action(async ({ ctx, parsedInput }) => {
    const result = await auth.api.banUser({ body: parsedInput, headers: ctx.requestHeaders })
    updateTag(ADMIN_USERS_CACHE_TAG)
    return result
  })
