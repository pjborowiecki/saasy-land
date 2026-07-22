"use server"

import { userZodSchemas } from "~/src/modules/user/user.zod"

import { PERMISSIONS } from "~/src/integrations/better-auth/auth.access"
import { auth } from "~/src/integrations/better-auth/auth.server"
import { authedActionClient } from "~/src/integrations/next-safe-action/action.client"

export const unbanUser = authedActionClient(PERMISSIONS.user.ban)
  .inputSchema(userZodSchemas.unbanUser)
  .action(({ ctx, parsedInput }) => auth.api.unbanUser({ body: parsedInput, headers: ctx.requestHeaders }))
