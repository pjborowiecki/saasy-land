"use server"

import { userZodSchemas } from "~/src/modules/user/user.zod"

import { PERMISSIONS } from "~/src/integrations/better-auth/auth.access"
import { auth } from "~/src/integrations/better-auth/auth.server"
import { authedActionClient } from "~/src/integrations/next-safe-action/action.client"

export const getUser = authedActionClient(PERMISSIONS.user.get)
  .inputSchema(userZodSchemas.getUser)
  .action(({ ctx, parsedInput }) => auth.api.getUser({ headers: ctx.requestHeaders, query: { id: parsedInput.userId } }))
