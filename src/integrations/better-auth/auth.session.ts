import { queryOptions } from "@tanstack/react-query"
import { createServerFn, createServerOnlyFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"

import { auth } from "~/src/integrations/better-auth/auth.server"

import { SESSION_QUERY_KEYS } from "~/src/modules/session/session.constants"

const SESSION_STALE_TIME_MS = 60_000

// Share the pending lookup within one HTTP request; never cache across requests.
// Weak keys allow completed requests and their sessions to be garbage-collected.
const requestSessions = new WeakMap<Request, ReturnType<typeof auth.api.getSession>>()

export const getRequestSession = createServerOnlyFn((request: Request) => {
  const cached = requestSessions.get(request)
  if (cached) {
    return cached
  }
  const session = auth.api.getSession({ headers: request.headers, query: { disableCookieCache: true } })
  requestSessions.set(request, session)
  return session
})

export const getCurrentSession = createServerFn({ method: "GET" }).handler(() => getRequestSession(getRequest()))

export const getCurrentSessionQuery = queryOptions({
  queryFn: () => getCurrentSession(),
  queryKey: SESSION_QUERY_KEYS.CURRENT,
  refetchOnReconnect: false,
  refetchOnWindowFocus: false,
  retry: false,
  staleTime: SESSION_STALE_TIME_MS,
})
