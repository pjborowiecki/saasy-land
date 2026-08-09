"use server"

import { sessionZodSchemas } from "~/src/modules/session/session.zod"

import { auth } from "~/src/integrations/better-auth/auth.server"
import { actionClient, withAuth } from "~/src/integrations/next-safe-action/action.client"

export const revokeUserSessions = actionClient
  .use(withAuth({ session: ["revoke"] }))
  .inputSchema(sessionZodSchemas.revokeUserSessions)
  .action(({ ctx, parsedInput }) => auth.api.revokeUserSessions({ body: parsedInput, headers: ctx.requestHeaders }))
