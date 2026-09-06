import { queryOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"

import { auth } from "~/src/integrations/better-auth/auth.server"

export const getCurrentSession = createServerFn({ method: "GET" }).handler(() =>
  auth.api.getSession({ headers: getRequest().headers, query: { disableCookieCache: true } }),
)

export const getCurrentSessionQuery = queryOptions({ queryFn: () => getCurrentSession(), queryKey: ["session", "getCurrentSession"] })
