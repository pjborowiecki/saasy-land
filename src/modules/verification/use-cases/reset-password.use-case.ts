"use server"

import { verificationZodSchemas } from "~/src/modules/verification/verification.zod"

import { auth } from "~/src/integrations/better-auth/auth.server"
import { actionClient, RATE_LIMITS, withRateLimit } from "~/src/integrations/next-safe-action/action.client"

export const resetPassword = actionClient
  .use(withRateLimit("reset-password", RATE_LIMITS.TOKEN))
  .inputSchema(verificationZodSchemas.resetPassword)
  .action(({ ctx, parsedInput }) => {
    const { password, token } = parsedInput

    return auth.api.resetPassword({
      body: { newPassword: password, token },
      headers: ctx.requestHeaders,
    })
  })
