"use server"

import { sessionZodSchemas } from "~/src/modules/session/session.zod"

import { PERMISSIONS } from "~/src/integrations/better-auth/auth.access"
import { auth } from "~/src/integrations/better-auth/auth.server"
import { authedActionClient } from "~/src/integrations/next-safe-action/action.client"

export const listUserSessions = authedActionClient(PERMISSIONS.session.list)
  .inputSchema(sessionZodSchemas.listUserSessions)
  .action(({ ctx, parsedInput }) => auth.api.listUserSessions({ body: parsedInput, headers: ctx.requestHeaders }))
