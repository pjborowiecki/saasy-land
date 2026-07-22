"use server"

import { sessionZodSchemas } from "~/src/modules/session/session.zod"

import { PERMISSIONS } from "~/src/integrations/better-auth/auth.access"
import { auth } from "~/src/integrations/better-auth/auth.server"
import { authedActionClient } from "~/src/integrations/next-safe-action/action.client"

export const settingsRevokeSession = authedActionClient(PERMISSIONS.settings.manage)
  .inputSchema(sessionZodSchemas.revokeSession)
  .action(({ ctx, parsedInput }) => auth.api.revokeSession({ body: parsedInput, headers: ctx.requestHeaders }))
