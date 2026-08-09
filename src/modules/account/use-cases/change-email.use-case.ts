"use server"

import { accountZodSchemas } from "~/src/modules/account/account.zod"

import { auth } from "~/src/integrations/better-auth/auth.server"
import { actionClient, RATE_LIMITS, withAuth, withRateLimit } from "~/src/integrations/next-safe-action/action.client"

export const settingsChangeEmail = actionClient
  .use(withRateLimit("change-email", RATE_LIMITS.SENSITIVE))
  .use(withAuth())
  .inputSchema(accountZodSchemas.changeEmail)
  .action(({ ctx, parsedInput }) => auth.api.changeEmail({ body: parsedInput, headers: ctx.requestHeaders }))
