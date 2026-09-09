import { mutationOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"

import { authorized } from "~/src/integrations/better-auth/auth.middleware"
import { auth } from "~/src/integrations/better-auth/auth.server"

import { SESSION_MUTATION_KEYS } from "~/src/modules/session/session.constants"

export const settingsRevokeOtherSessions = createServerFn({ method: "POST" })
  .middleware([authorized()])
  .handler(({ context }) => auth.api.revokeOtherSessions({ headers: context.requestHeaders }))

export const settingsRevokeOtherSessionsMutation = mutationOptions({
  mutationFn: () => settingsRevokeOtherSessions(),
  mutationKey: SESSION_MUTATION_KEYS.REVOKE_OTHER,
})
