"use server"

import { twoFactorZodSchemas } from "~/src/modules/two-factor/two-factor.zod"

import { auth } from "~/src/integrations/better-auth/auth.server"
import { actionClient, RATE_LIMITS, withRateLimit } from "~/src/integrations/next-safe-action/action.client"

export const verifyTotp = actionClient
  .use(withRateLimit("verify-totp", RATE_LIMITS.SENSITIVE))
  .inputSchema(twoFactorZodSchemas.verifyTotp)
  .action(({ ctx, parsedInput }) =>
    auth.api.verifyTOTP({
      body: parsedInput,
      headers: ctx.requestHeaders,
    }),
  )
