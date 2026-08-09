"use server"

import { sessionZodSchemas } from "~/src/modules/session/session.zod"

import { auth } from "~/src/integrations/better-auth/auth.server"
import { actionClient, withAuth } from "~/src/integrations/next-safe-action/action.client"

export const revokeUserSession = actionClient
  .use(withAuth({ session: ["revoke"] }))
  .inputSchema(sessionZodSchemas.revokeUserSession)
  .action(({ ctx, parsedInput }) => auth.api.revokeUserSession({ body: parsedInput, headers: ctx.requestHeaders }))
