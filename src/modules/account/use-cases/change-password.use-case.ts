"use server"

import { accountZodSchemas } from "~/src/modules/account/account.zod"

import { auth } from "~/src/integrations/better-auth/auth.server"
import { actionClient, RATE_LIMITS, withAuth, withRateLimit } from "~/src/integrations/next-safe-action/action.client"

export const settingsChangePassword = actionClient
  .use(withRateLimit("change-password", RATE_LIMITS.SENSITIVE))
  .use(withAuth())
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
