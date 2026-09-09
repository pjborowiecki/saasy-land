import { mutationOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import type * as zod from "zod"

import { authorized } from "~/src/integrations/better-auth/auth.middleware"
import { auth } from "~/src/integrations/better-auth/auth.server"

import { USER_MUTATION_KEYS } from "~/src/modules/user/user.constants"
import { userZodSchemas } from "~/src/modules/user/user.zod"

export const createUser = createServerFn({ method: "POST" })
  .middleware([authorized({ user: ["create"] })])
  .validator((input: zod.input<typeof userZodSchemas.createUser>) => userZodSchemas.createUser.parse(input))
  .handler(({ context, data }) => auth.api.createUser({ body: data, headers: context.requestHeaders }))

export const createUserMutation = mutationOptions({
  mutationFn: (data: Parameters<typeof createUser>[0]["data"]) => createUser({ data }),
  mutationKey: USER_MUTATION_KEYS.CREATE,
})
