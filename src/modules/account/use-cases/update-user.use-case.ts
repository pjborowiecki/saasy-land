"use server"

import { accountZodSchemas } from "~/src/modules/account/account.zod"

import { auth } from "~/src/integrations/better-auth/auth.server"
import { actionClient, withAuth } from "~/src/integrations/next-safe-action/action.client"

export const settingsUpdateUser = actionClient
  .use(withAuth())
  .inputSchema(accountZodSchemas.updateUser)
  .action(({ ctx, parsedInput }) => auth.api.updateUser({ body: parsedInput, headers: ctx.requestHeaders }))
