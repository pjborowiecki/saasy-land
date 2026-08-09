"use server"

import { updateTag } from "next/cache"

import { ADMIN_USERS_CACHE_TAG } from "~/src/modules/user/user.constants"
import { userZodSchemas } from "~/src/modules/user/user.zod"

import { auth } from "~/src/integrations/better-auth/auth.server"
import { actionClient, withAuth } from "~/src/integrations/next-safe-action/action.client"

export const deleteUser = actionClient
  .use(withAuth({ user: ["delete"] }))
  .inputSchema(userZodSchemas.deleteUser)
  .action(async ({ ctx, parsedInput }) => {
    const result = await auth.api.removeUser({ body: parsedInput, headers: ctx.requestHeaders })
    updateTag(ADMIN_USERS_CACHE_TAG)
    return result
  })
