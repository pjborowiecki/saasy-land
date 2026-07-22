"use server"

import { userZodSchemas } from "~/src/modules/user/user.zod"

import { PERMISSIONS } from "~/src/integrations/better-auth/auth.access"
import { auth } from "~/src/integrations/better-auth/auth.server"
import { authedActionClient } from "~/src/integrations/next-safe-action/action.client"

export const createUser = authedActionClient(PERMISSIONS.user.create)
  .inputSchema(userZodSchemas.createUser)
  .action(({ ctx, parsedInput }) => auth.api.createUser({ body: parsedInput, headers: ctx.requestHeaders }))
