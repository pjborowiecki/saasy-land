"use server"

import { accountZodSchemas } from "~/src/modules/account/account.zod"

import { PERMISSIONS } from "~/src/integrations/better-auth/auth.access"
import { auth } from "~/src/integrations/better-auth/auth.server"
import { authedActionClient } from "~/src/integrations/next-safe-action/action.client"

export const settingsChangeEmail = authedActionClient(PERMISSIONS.settings.manage)
  .inputSchema(accountZodSchemas.changeEmail)
  .action(({ ctx, parsedInput }) => auth.api.changeEmail({ body: parsedInput, headers: ctx.requestHeaders }))
