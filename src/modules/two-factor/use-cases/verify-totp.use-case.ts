"use server"

import { twoFactorZodSchemas } from "~/src/modules/two-factor/two-factor.zod"

import { auth } from "~/src/integrations/better-auth/auth.server"
import { publicActionClient } from "~/src/integrations/next-safe-action/action.client"

export const verifyTotp = publicActionClient.inputSchema(twoFactorZodSchemas.verifyTotp).action(({ ctx, parsedInput }) =>
  auth.api.verifyTOTP({
    body: parsedInput,
    headers: ctx.requestHeaders,
  }),
)
