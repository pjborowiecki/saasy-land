"use server"

import { twoFactorZodSchemas } from "~/src/modules/two-factor/two-factor.zod"

import { auth } from "~/src/integrations/better-auth/auth.server"
import { actionClient, RATE_LIMITS, withAuth, withRateLimit } from "~/src/integrations/next-safe-action/action.client"

export const enableTwoFactor = actionClient
  .use(withRateLimit("enable-two-factor", RATE_LIMITS.SENSITIVE))
  .use(withAuth())
  .inputSchema(twoFactorZodSchemas.enableTwoFactor)
  .action(({ ctx, parsedInput }) =>
    auth.api.enableTwoFactor({
      body: { password: parsedInput.password },
      headers: ctx.requestHeaders,
    }),
  )
