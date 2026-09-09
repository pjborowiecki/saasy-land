import { mutationOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import type * as zod from "zod"

import { authorized } from "~/src/integrations/better-auth/auth.middleware"
import { auth } from "~/src/integrations/better-auth/auth.server"

import { USER_MUTATION_KEYS } from "~/src/modules/user/user.constants"
import { userZodSchemas } from "~/src/modules/user/user.zod"

export const impersonateUser = createServerFn({ method: "POST" })
  .middleware([authorized({ user: ["impersonate"] })])
  .validator((input: zod.input<typeof userZodSchemas.impersonateUser>) => userZodSchemas.impersonateUser.parse(input))
  .handler(({ context, data }) => auth.api.impersonateUser({ body: data, headers: context.requestHeaders }))

export const impersonateUserMutation = mutationOptions({
  mutationFn: (data: Parameters<typeof impersonateUser>[0]["data"]) => impersonateUser({ data }),
  mutationKey: USER_MUTATION_KEYS.IMPERSONATE,
})
