import { mutationOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import type * as zod from "zod"

import { withAuth } from "~/src/integrations/better-auth/auth.middleware"
import { auth } from "~/src/integrations/better-auth/auth.server"

import { userZodSchemas } from "~/src/modules/user/user.zod"

export const updateUser = createServerFn({ method: "POST" })
  .middleware([withAuth({ user: ["update"] })])
  .validator((input: zod.input<typeof userZodSchemas.updateUser>) => userZodSchemas.updateUser.parse(input))
  .handler(({ context, data: input }) => {
    const { userId, ...data } = input

    return auth.api.adminUpdateUser({
      body: { data, userId },
      headers: context.requestHeaders,
    })
  })

export const updateUserMutation = mutationOptions({
  mutationFn: (data: Parameters<typeof updateUser>[0]["data"]) => updateUser({ data }),
  mutationKey: ["user", "updateUser"],
})
