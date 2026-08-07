"use server"

import { auth } from "~/src/integrations/better-auth/auth.server"
import { signUpWithPasswordSchema } from "~/src/integrations/better-auth/auth.zod"
import { publicActionClient } from "~/src/integrations/next-safe-action/action.client"

export const signUpWithPassword = publicActionClient
  .inputSchema(signUpWithPasswordSchema)
  .action(({ ctx, parsedInput }) => auth.api.signUpEmail({ body: parsedInput, headers: ctx.requestHeaders }))
