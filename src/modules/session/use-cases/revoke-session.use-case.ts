"use server"

import { sessionZodSchemas } from "~/src/modules/session/session.zod"

import { auth } from "~/src/integrations/better-auth/auth.server"
import { actionClient, withAuth } from "~/src/integrations/next-safe-action/action.client"

export const settingsRevokeSession = actionClient
  .use(withAuth())
  .inputSchema(sessionZodSchemas.revokeSession)
  .action(({ ctx, parsedInput }) => auth.api.revokeSession({ body: parsedInput, headers: ctx.requestHeaders }))
