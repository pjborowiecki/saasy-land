"use server"

import { accountZodSchemas } from "~/src/modules/account/account.zod"

import { PERMISSIONS } from "~/src/integrations/better-auth/auth.access"
import { auth } from "~/src/integrations/better-auth/auth.server"
import { authedActionClient } from "~/src/integrations/next-safe-action/action.client"

export const settingsChangePassword = authedActionClient(PERMISSIONS.settings.manage)
  .inputSchema(accountZodSchemas.changePassword)
  .action(({ ctx, parsedInput }) =>
    auth.api.changePassword({
      body: {
        currentPassword: parsedInput.currentPassword,
        newPassword: parsedInput.newPassword,
        revokeOtherSessions: parsedInput.revokeOtherSessions ?? false,
      },
      headers: ctx.requestHeaders,
    }),
  )
