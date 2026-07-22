"use server"

import { PERMISSIONS } from "~/src/integrations/better-auth/auth.access"
import { auth } from "~/src/integrations/better-auth/auth.server"
import { authedActionClient } from "~/src/integrations/next-safe-action/action.client"

export const settingsRevokeOtherSessions = authedActionClient(PERMISSIONS.settings.manage).action(({ ctx }) =>
  auth.api.revokeOtherSessions({ headers: ctx.requestHeaders }),
)
