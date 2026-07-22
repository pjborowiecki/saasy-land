"use server"

import { verificationZodSchemas } from "~/src/modules/verification/verification.zod"

import { auth } from "~/src/integrations/better-auth/auth.server"
import { publicActionClient } from "~/src/integrations/next-safe-action/action.client"

export const sendVerificationEmail = publicActionClient
  .inputSchema(verificationZodSchemas.sendVerificationEmail)
  .action(({ ctx, parsedInput }) => auth.api.sendVerificationEmail({ body: parsedInput, headers: ctx.requestHeaders }))
