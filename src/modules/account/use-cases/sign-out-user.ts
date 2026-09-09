import { mutationOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"

import { authorized } from "~/src/integrations/better-auth/auth.middleware"
import { auth } from "~/src/integrations/better-auth/auth.server"

import { ACCOUNT_MUTATION_KEYS } from "~/src/modules/account/account.constants"

export const settingsSignOutUser = createServerFn({ method: "POST" })
  .middleware([authorized()])
  .handler(({ context }) => auth.api.signOut({ headers: context.requestHeaders }))

export const settingsSignOutUserMutation = mutationOptions({
  mutationFn: () => settingsSignOutUser(),
  mutationKey: ACCOUNT_MUTATION_KEYS.SIGN_OUT,
})
