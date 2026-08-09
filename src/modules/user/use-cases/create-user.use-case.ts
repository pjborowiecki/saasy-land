"use server"

import { userZodSchemas } from "~/src/modules/user/user.zod"

import { auth } from "~/src/integrations/better-auth/auth.server"
import { actionClient, withAuth } from "~/src/integrations/next-safe-action/action.client"

export const createUser = actionClient
  .use(withAuth({ user: ["create"] }))
  .inputSchema(userZodSchemas.createUser)
  .action(({ ctx, parsedInput }) => auth.api.createUser({ body: parsedInput, headers: ctx.requestHeaders }))
