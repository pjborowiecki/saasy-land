"use server"

import { userZodSchemas } from "~/src/modules/user/user.zod"

import { PERMISSIONS } from "~/src/integrations/better-auth/auth.access"
import { auth } from "~/src/integrations/better-auth/auth.server"
import { authedActionClient } from "~/src/integrations/next-safe-action/action.client"

export const setUserRole = authedActionClient(PERMISSIONS.user.setRole)
  .inputSchema(userZodSchemas.setUserRole)
  .action(({ ctx, parsedInput }) =>
    auth.api.setRole({ body: { role: parsedInput.role, userId: parsedInput.userId }, headers: ctx.requestHeaders }),
  )
