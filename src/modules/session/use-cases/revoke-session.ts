import { mutationOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import type * as zod from "zod"

import { authorized } from "~/src/integrations/better-auth/auth.middleware"
import { auth } from "~/src/integrations/better-auth/auth.server"

import { SESSION_MUTATION_KEYS } from "~/src/modules/session/session.constants"
import { sessionZodSchemas } from "~/src/modules/session/session.zod"

export const settingsRevokeSession = createServerFn({ method: "POST" })
  .middleware([authorized()])
  .validator((input: zod.input<typeof sessionZodSchemas.revokeSession>) => sessionZodSchemas.revokeSession.parse(input))
  .handler(({ context, data }) => auth.api.revokeSession({ body: data, headers: context.requestHeaders }))

export const settingsRevokeSessionMutation = mutationOptions({
  mutationFn: (data: Parameters<typeof settingsRevokeSession>[0]["data"]) => settingsRevokeSession({ data }),
  mutationKey: SESSION_MUTATION_KEYS.REVOKE,
})
