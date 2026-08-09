"use server"

import { verificationZodSchemas } from "~/src/modules/verification/verification.zod"

import { auth } from "~/src/integrations/better-auth/auth.server"
import { actionClient, RATE_LIMITS, withRateLimit } from "~/src/integrations/next-safe-action/action.client"

export const verifyEmail = actionClient
  .use(withRateLimit("verify-email", RATE_LIMITS.TOKEN))
  .inputSchema(verificationZodSchemas.verifyEmail)
  .action(({ ctx, parsedInput }) => auth.api.verifyEmail({ headers: ctx.requestHeaders, query: { token: parsedInput.token } }))
