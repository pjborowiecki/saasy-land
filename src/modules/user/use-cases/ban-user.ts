import { mutationOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import type * as zod from "zod"

import { authorized } from "~/src/integrations/better-auth/auth.middleware"
import { auth } from "~/src/integrations/better-auth/auth.server"

import { USER_MUTATION_KEYS } from "~/src/modules/user/user.constants"
import { userZodSchemas } from "~/src/modules/user/user.zod"

export const banUser = createServerFn({ method: "POST" })
  .middleware([authorized({ user: ["ban"] })])
  .validator((input: zod.input<typeof userZodSchemas.banUser>) => userZodSchemas.banUser.parse(input))
  .handler(async ({ context, data }) => {
    const result = await auth.api.banUser({ body: data, headers: context.requestHeaders })

    return result
  })

export const banUserMutation = mutationOptions({
  mutationFn: (data: Parameters<typeof banUser>[0]["data"]) => banUser({ data }),
  mutationKey: USER_MUTATION_KEYS.BAN,
})
