"use server"

import { verificationZodSchemas } from "~/src/modules/verification/verification.zod"

import { auth } from "~/src/integrations/better-auth/auth.server"
import { publicActionClient } from "~/src/integrations/next-safe-action/action.client"

export const verifyEmail = publicActionClient
  .inputSchema(verificationZodSchemas.verifyEmail)
  .action(({ ctx, parsedInput }) => auth.api.verifyEmail({ headers: ctx.requestHeaders, query: { token: parsedInput.token } }))
