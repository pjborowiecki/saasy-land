"use server"

import { verificationZodSchemas } from "~/src/modules/verification/verification.zod"

import { auth } from "~/src/integrations/better-auth/auth.server"
import { publicActionClient } from "~/src/integrations/next-safe-action/action.client"

export const requestPasswordReset = publicActionClient
  .inputSchema(verificationZodSchemas.requestPasswordReset)
  .action(({ ctx, parsedInput }) => auth.api.requestPasswordReset({ body: parsedInput, headers: ctx.requestHeaders }))
