import { mutationOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import type * as zod from "zod"

import { authorized } from "~/src/integrations/better-auth/auth.middleware"
import { auth } from "~/src/integrations/better-auth/auth.server"

import { SESSION_MUTATION_KEYS } from "~/src/modules/session/session.constants"
import { sessionZodSchemas } from "~/src/modules/session/session.zod"

export const revokeUserSession = createServerFn({ method: "POST" })
  .middleware([authorized({ session: ["revoke"] })])
  .validator((input: zod.input<typeof sessionZodSchemas.revokeUserSession>) => sessionZodSchemas.revokeUserSession.parse(input))
  .handler(({ context, data }) => auth.api.revokeUserSession({ body: data, headers: context.requestHeaders }))

export const revokeUserSessionMutation = mutationOptions({
  mutationFn: (data: Parameters<typeof revokeUserSession>[0]["data"]) => revokeUserSession({ data }),
  mutationKey: SESSION_MUTATION_KEYS.REVOKE_USER,
})
