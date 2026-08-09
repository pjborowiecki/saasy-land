"use server"

import { auth } from "~/src/integrations/better-auth/auth.server"
import { signUpWithPasswordSchema } from "~/src/integrations/better-auth/auth.zod"
import { actionClient, RATE_LIMITS, withRateLimit } from "~/src/integrations/next-safe-action/action.client"

export const signUpWithPassword = actionClient
  .use(withRateLimit("sign-up", RATE_LIMITS.SENSITIVE))
  .inputSchema(signUpWithPasswordSchema)
  .action(({ ctx, parsedInput }) => auth.api.signUpEmail({ body: parsedInput, headers: ctx.requestHeaders }))
