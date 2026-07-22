import "server-only"

import { PERMISSIONS } from "~/src/integrations/better-auth/auth.access"
import { requirePermissionSession } from "~/src/integrations/better-auth/auth.guards"
import { auth } from "~/src/integrations/better-auth/auth.server"
import type { AuthActiveSession } from "~/src/integrations/better-auth/auth.types"

export async function listActiveSessions(requestHeaders: Headers): Promise<readonly AuthActiveSession[]> {
  await requirePermissionSession(PERMISSIONS.settings.manage)

  return auth.api.listSessions({ headers: requestHeaders })
}
