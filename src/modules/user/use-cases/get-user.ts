import { createServerFn } from "@tanstack/react-start"

import { authorized } from "~/src/integrations/better-auth/auth.middleware"
import { auth } from "~/src/integrations/better-auth/auth.server"

export const getUser = createServerFn({ method: "GET" })
  .middleware([authorized({ user: ["get"] })])
  .validator((data: string) => data)
  .handler(({ context, data: userId }) => auth.api.getUser({ headers: context.requestHeaders, query: { id: userId } }))
