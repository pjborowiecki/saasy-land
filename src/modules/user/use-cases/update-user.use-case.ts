"use server"

import { userZodSchemas } from "~/src/modules/user/user.zod"

import { auth } from "~/src/integrations/better-auth/auth.server"
import { actionClient, withAuth } from "~/src/integrations/next-safe-action/action.client"

export const updateUser = actionClient
  .use(withAuth({ user: ["update"] }))
  .inputSchema(userZodSchemas.updateUser)
  .action(({ ctx, parsedInput }) => {
    const { userId, ...data } = parsedInput

    return auth.api.adminUpdateUser({
      body: { data, userId },
      headers: ctx.requestHeaders,
    })
  })
