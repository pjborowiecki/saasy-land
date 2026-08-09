"use server"

import { userZodSchemas } from "~/src/modules/user/user.zod"

import { auth } from "~/src/integrations/better-auth/auth.server"
import { actionClient, withAuth } from "~/src/integrations/next-safe-action/action.client"

export const setUserPassword = actionClient
  .use(withAuth({ user: ["set-password"] }))
  .inputSchema(userZodSchemas.setUserPassword)
  .action(({ ctx, parsedInput }) => auth.api.setUserPassword({ body: parsedInput, headers: ctx.requestHeaders }))
