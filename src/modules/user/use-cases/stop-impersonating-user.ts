import { mutationOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"

import { withAuth } from "~/src/integrations/better-auth/auth.middleware"
import { auth } from "~/src/integrations/better-auth/auth.server"

export const stopImpersonatingUser = createServerFn({ method: "POST" })
  .middleware([withAuth()])
  .handler(({ context }) => auth.api.stopImpersonating({ headers: context.requestHeaders }))

export const stopImpersonatingUserMutation = mutationOptions({
  mutationFn: () => stopImpersonatingUser(),
  mutationKey: ["user", "stopImpersonatingUser"],
})
