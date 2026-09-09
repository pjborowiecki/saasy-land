import { mutationOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import type * as zod from "zod"

import { authorized } from "~/src/integrations/better-auth/auth.middleware"
import { auth } from "~/src/integrations/better-auth/auth.server"

import { USER_MUTATION_KEYS } from "~/src/modules/user/user.constants"
import { userZodSchemas } from "~/src/modules/user/user.zod"

export const setUserRole = createServerFn({ method: "POST" })
  .middleware([authorized({ user: ["set-role"] })])
  .validator((input: zod.input<typeof userZodSchemas.setUserRole>) => userZodSchemas.setUserRole.parse(input))
  .handler(async ({ context, data }) => {
    const res = await auth.api.setRole({ body: { role: data.role, userId: data.userId }, headers: context.requestHeaders })

    return res
  })

export const setUserRoleMutation = mutationOptions({
  mutationFn: (data: Parameters<typeof setUserRole>[0]["data"]) => setUserRole({ data }),
  mutationKey: USER_MUTATION_KEYS.SET_ROLE,
})
