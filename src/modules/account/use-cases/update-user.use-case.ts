"use server"

import { accountZodSchemas } from "~/src/modules/account/account.zod"

import { PERMISSIONS } from "~/src/integrations/better-auth/auth.access"
import { auth } from "~/src/integrations/better-auth/auth.server"
import { authedActionClient } from "~/src/integrations/next-safe-action/action.client"

export const settingsUpdateUser = authedActionClient(PERMISSIONS.settings.manage)
  .inputSchema(accountZodSchemas.updateUser)
  .action(({ ctx, parsedInput }) => auth.api.updateUser({ body: parsedInput, headers: ctx.requestHeaders }))
