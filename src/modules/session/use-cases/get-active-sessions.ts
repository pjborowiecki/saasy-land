import { queryOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"

import { auth } from "~/src/integrations/better-auth/auth.server"
import { getCurrentSession } from "~/src/integrations/better-auth/auth.session"

import { AppError, ERROR_CODES } from "~/src/modules/_core/constants/errors"

export const getActiveSessions = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getCurrentSession()

  if (!session) {
    throw new AppError(ERROR_CODES.UNAUTHORIZED)
  }

  return auth.api.listSessions({ headers: getRequest().headers })
})

export const getActiveSessionsQuery = queryOptions({ queryFn: () => getActiveSessions(), queryKey: ["session", "getActiveSessions"] })
