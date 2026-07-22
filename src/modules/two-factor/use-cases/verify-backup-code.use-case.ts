"use server"

import { twoFactorZodSchemas } from "~/src/modules/two-factor/two-factor.zod"

import { auth } from "~/src/integrations/better-auth/auth.server"
import { publicActionClient } from "~/src/integrations/next-safe-action/action.client"

export const verifyBackupCode = publicActionClient.inputSchema(twoFactorZodSchemas.verifyBackupCode).action(({ ctx, parsedInput }) =>
  auth.api.verifyBackupCode({
    body: {
      code: parsedInput.code,
      trustDevice: parsedInput.trustDevice,
    },
    headers: ctx.requestHeaders,
  }),
)
