import { mutationOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"

import { withAuth } from "~/src/integrations/better-auth/auth.middleware"
import { auth } from "~/src/integrations/better-auth/auth.server"

export const settingsSignOutUser = createServerFn({ method: "POST" })
  .middleware([withAuth()])
  .handler(({ context }) => auth.api.signOut({ headers: context.requestHeaders }))

export const settingsSignOutUserMutation = mutationOptions({
  mutationFn: () => settingsSignOutUser(),
  mutationKey: ["account", "settingsSignOutUser"],
})
