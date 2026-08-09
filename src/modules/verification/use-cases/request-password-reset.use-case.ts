"use server"

import { verificationZodSchemas } from "~/src/modules/verification/verification.zod"

import { auth } from "~/src/integrations/better-auth/auth.server"
import { actionClient, RATE_LIMITS, withRateLimit } from "~/src/integrations/next-safe-action/action.client"

export const requestPasswordReset = actionClient
  .use(withRateLimit("request-password-reset", RATE_LIMITS.SENSITIVE))
  .inputSchema(verificationZodSchemas.requestPasswordReset)
  .action(({ ctx, parsedInput }) => auth.api.requestPasswordReset({ body: parsedInput, headers: ctx.requestHeaders }))
