"use server"

import { verificationZodSchemas } from "~/src/modules/verification/verification.zod"

import { auth } from "~/src/integrations/better-auth/auth.server"
import { actionClient, RATE_LIMITS, withRateLimit } from "~/src/integrations/next-safe-action/action.client"

export const sendVerificationEmail = actionClient
  .use(withRateLimit("send-verification-email", RATE_LIMITS.SENSITIVE))
  .inputSchema(verificationZodSchemas.sendVerificationEmail)
  .action(({ ctx, parsedInput }) => auth.api.sendVerificationEmail({ body: parsedInput, headers: ctx.requestHeaders }))
