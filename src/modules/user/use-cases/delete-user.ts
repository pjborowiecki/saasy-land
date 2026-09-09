import { mutationOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import type * as zod from "zod"

import { authorized } from "~/src/integrations/better-auth/auth.middleware"
import { auth } from "~/src/integrations/better-auth/auth.server"

import { USER_MUTATION_KEYS } from "~/src/modules/user/user.constants"
import { userZodSchemas } from "~/src/modules/user/user.zod"

export const deleteUser = createServerFn({ method: "POST" })
  .middleware([authorized({ user: ["delete"] })])
  .validator((input: zod.input<typeof userZodSchemas.deleteUser>) => userZodSchemas.deleteUser.parse(input))
  .handler(async ({ context, data }) => {
    const result = await auth.api.removeUser({ body: data, headers: context.requestHeaders })

    return result
  })

export const deleteUserMutation = mutationOptions({
  mutationFn: (data: Parameters<typeof deleteUser>[0]["data"]) => deleteUser({ data }),
  mutationKey: USER_MUTATION_KEYS.DELETE,
})
