import { mutationOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"

import { withAuth } from "~/src/integrations/better-auth/auth.middleware"
import { auth } from "~/src/integrations/better-auth/auth.server"

export const settingsRevokeOtherSessions = createServerFn({ method: "POST" })
  .middleware([withAuth()])
  .handler(({ context }) => auth.api.revokeOtherSessions({ headers: context.requestHeaders }))

export const settingsRevokeOtherSessionsMutation = mutationOptions({
  mutationFn: () => settingsRevokeOtherSessions(),
  mutationKey: ["session", "settingsRevokeOtherSessions"],
})
