"use server"

import { twoFactorZodSchemas } from "~/src/modules/two-factor/two-factor.zod"

import { PERMISSIONS } from "~/src/integrations/better-auth/auth.access"
import { auth } from "~/src/integrations/better-auth/auth.server"
import { authedActionClient } from "~/src/integrations/next-safe-action/action.client"

export const disableTwoFactor = authedActionClient(PERMISSIONS.settings.manage)
  .inputSchema(twoFactorZodSchemas.disableTwoFactor)
  .action(({ ctx, parsedInput }) =>
    auth.api.disableTwoFactor({
      body: { password: parsedInput.password },
      headers: ctx.requestHeaders,
    }),
  )
