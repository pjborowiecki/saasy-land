import { queryOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import type * as zod from "zod"

import { authorized } from "~/src/integrations/better-auth/auth.middleware"
import { auth } from "~/src/integrations/better-auth/auth.server"

import { SESSION_QUERY_KEYS } from "~/src/modules/session/session.constants"
import { sessionZodSchemas } from "~/src/modules/session/session.zod"

export const listUserSessions = createServerFn({ method: "GET" })
  .middleware([authorized({ session: ["list"] })])
  .validator((input: zod.input<typeof sessionZodSchemas.listUserSessions>) => sessionZodSchemas.listUserSessions.parse(input))
  .handler(({ context, data }) => auth.api.listUserSessions({ body: data, headers: context.requestHeaders }))

export const listUserSessionsQuery = (data: Parameters<typeof listUserSessions>[0]["data"]) =>
  queryOptions({
    queryFn: () => listUserSessions({ data }),
    queryKey: [...SESSION_QUERY_KEYS.USER, data],
  })
