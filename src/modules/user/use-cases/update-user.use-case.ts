"use server"

import { userZodSchemas } from "~/src/modules/user/user.zod"

import { PERMISSIONS } from "~/src/integrations/better-auth/auth.access"
import { auth } from "~/src/integrations/better-auth/auth.server"
import { authedActionClient } from "~/src/integrations/next-safe-action/action.client"

export const updateUser = authedActionClient(PERMISSIONS.user.update)
  .inputSchema(userZodSchemas.updateUser)
  .action(({ ctx, parsedInput }) => {
    const { userId, ...data } = parsedInput

    return auth.api.adminUpdateUser({
      body: { data, userId },
      headers: ctx.requestHeaders,
    })
  })
