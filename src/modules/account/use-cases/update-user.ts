import { mutationOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import type * as zod from "zod"

import { authorized } from "~/src/integrations/better-auth/auth.middleware"
import { auth } from "~/src/integrations/better-auth/auth.server"

import { ACCOUNT_MUTATION_KEYS } from "~/src/modules/account/account.constants"
import { accountZodSchemas } from "~/src/modules/account/account.zod"

export const settingsUpdateUser = createServerFn({ method: "POST" })
  .middleware([authorized()])
  .validator((input: zod.input<typeof accountZodSchemas.updateUser>) => accountZodSchemas.updateUser.parse(input))
  .handler(({ context, data }) => auth.api.updateUser({ body: data, headers: context.requestHeaders }))

export const settingsUpdateUserMutation = mutationOptions({
  mutationFn: (data: Parameters<typeof settingsUpdateUser>[0]["data"]) => settingsUpdateUser({ data }),
  mutationKey: ACCOUNT_MUTATION_KEYS.UPDATE_USER,
})
