import { queryOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import type * as zod from "zod"

import { withAuth } from "~/src/integrations/better-auth/auth.middleware"
import { auth } from "~/src/integrations/better-auth/auth.server"

import { sessionZodSchemas } from "~/src/modules/session/session.zod"

export const listUserSessions = createServerFn({ method: "GET" })
  .middleware([withAuth({ session: ["list"] })])
  .validator((input: zod.input<typeof sessionZodSchemas.listUserSessions>) => sessionZodSchemas.listUserSessions.parse(input))
  .handler(({ context, data }) => auth.api.listUserSessions({ body: data, headers: context.requestHeaders }))

export const listUserSessionsQuery = (data: Parameters<typeof listUserSessions>[0]["data"]) =>
  queryOptions({
    queryFn: () => listUserSessions({ data }),
    queryKey: ["session", "listUserSessions", data],
  })
