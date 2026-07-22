"use server"

import { userZodSchemas } from "~/src/modules/user/user.zod"

import { PERMISSIONS } from "~/src/integrations/better-auth/auth.access"
import { auth } from "~/src/integrations/better-auth/auth.server"
import { authedActionClient } from "~/src/integrations/next-safe-action/action.client"

export const setUserPassword = authedActionClient(PERMISSIONS.user.setPassword)
  .inputSchema(userZodSchemas.setUserPassword)
  .action(({ ctx, parsedInput }) => auth.api.setUserPassword({ body: parsedInput, headers: ctx.requestHeaders }))
