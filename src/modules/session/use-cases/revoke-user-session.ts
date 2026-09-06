import { mutationOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import type * as zod from "zod"

import { withAuth } from "~/src/integrations/better-auth/auth.middleware"
import { auth } from "~/src/integrations/better-auth/auth.server"

import { sessionZodSchemas } from "~/src/modules/session/session.zod"

export const revokeUserSession = createServerFn({ method: "POST" })
  .middleware([withAuth({ session: ["revoke"] })])
  .validator((input: zod.input<typeof sessionZodSchemas.revokeUserSession>) => sessionZodSchemas.revokeUserSession.parse(input))
  .handler(({ context, data }) => auth.api.revokeUserSession({ body: data, headers: context.requestHeaders }))

export const revokeUserSessionMutation = mutationOptions({
  mutationFn: (data: Parameters<typeof revokeUserSession>[0]["data"]) => revokeUserSession({ data }),
  mutationKey: ["session", "revokeUserSession"],
})
