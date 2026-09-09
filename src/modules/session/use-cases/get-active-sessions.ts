import { queryOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"

import { authorized } from "~/src/integrations/better-auth/auth.middleware"
import { auth } from "~/src/integrations/better-auth/auth.server"

import { SESSION_QUERY_KEYS } from "~/src/modules/session/session.constants"

export const getActiveSessions = createServerFn({ method: "GET" })
  .middleware([authorized()])
  .handler(({ context }) => auth.api.listSessions({ headers: context.requestHeaders }))

export const getActiveSessionsQuery = queryOptions({ queryFn: () => getActiveSessions(), queryKey: SESSION_QUERY_KEYS.ACTIVE })
