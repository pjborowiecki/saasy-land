import { mutationOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import type * as zod from "zod"

import { withAuth } from "~/src/integrations/better-auth/auth.middleware"
import { auth } from "~/src/integrations/better-auth/auth.server"

import { sessionZodSchemas } from "~/src/modules/session/session.zod"

export const settingsRevokeSession = createServerFn({ method: "POST" })
  .middleware([withAuth()])
  .validator((input: zod.input<typeof sessionZodSchemas.revokeSession>) => sessionZodSchemas.revokeSession.parse(input))
  .handler(({ context, data }) => auth.api.revokeSession({ body: data, headers: context.requestHeaders }))

export const settingsRevokeSessionMutation = mutationOptions({
  mutationFn: (data: Parameters<typeof settingsRevokeSession>[0]["data"]) => settingsRevokeSession({ data }),
  mutationKey: ["session", "settingsRevokeSession"],
})
