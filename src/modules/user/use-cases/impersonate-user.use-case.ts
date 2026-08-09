"use server"

import { userZodSchemas } from "~/src/modules/user/user.zod"

import { auth } from "~/src/integrations/better-auth/auth.server"
import { actionClient, withAuth } from "~/src/integrations/next-safe-action/action.client"

export const impersonateUser = actionClient
  .use(withAuth({ user: ["impersonate"] }))
  .inputSchema(userZodSchemas.impersonateUser)
  .action(({ ctx, parsedInput }) => auth.api.impersonateUser({ body: parsedInput, headers: ctx.requestHeaders }))
