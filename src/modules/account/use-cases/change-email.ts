import { mutationOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import type * as zod from "zod"

import { RATE_LIMITS, authorized, withRateLimit } from "~/src/integrations/better-auth/auth.middleware"
import { auth } from "~/src/integrations/better-auth/auth.server"

import { ACCOUNT_MUTATION_KEYS } from "~/src/modules/account/account.constants"
import { accountZodSchemas } from "~/src/modules/account/account.zod"

export const settingsChangeEmail = createServerFn({ method: "POST" })
  .middleware([withRateLimit("change-email", RATE_LIMITS.SENSITIVE), authorized()])
  .validator((input: zod.input<typeof accountZodSchemas.changeEmail>) => accountZodSchemas.changeEmail.parse(input))
  .handler(({ context, data }) => auth.api.changeEmail({ body: data, headers: context.requestHeaders }))

export const settingsChangeEmailMutation = mutationOptions({
  mutationFn: (data: Parameters<typeof settingsChangeEmail>[0]["data"]) => settingsChangeEmail({ data }),
  mutationKey: ACCOUNT_MUTATION_KEYS.CHANGE_EMAIL,
})
