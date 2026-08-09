"use server"

import { sessionZodSchemas } from "~/src/modules/session/session.zod"

import { auth } from "~/src/integrations/better-auth/auth.server"
import { actionClient, withAuth } from "~/src/integrations/next-safe-action/action.client"

export const listUserSessions = actionClient
  .use(withAuth({ session: ["list"] }))
  .inputSchema(sessionZodSchemas.listUserSessions)
  .action(({ ctx, parsedInput }) => auth.api.listUserSessions({ body: parsedInput, headers: ctx.requestHeaders }))
