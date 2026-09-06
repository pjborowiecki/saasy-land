import { mutationOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import type * as zod from "zod"

import { withAuth } from "~/src/integrations/better-auth/auth.middleware"
import { auth } from "~/src/integrations/better-auth/auth.server"

import { userZodSchemas } from "~/src/modules/user/user.zod"

export const deleteUser = createServerFn({ method: "POST" })
  .middleware([withAuth({ user: ["delete"] })])
  .validator((input: zod.input<typeof userZodSchemas.deleteUser>) => userZodSchemas.deleteUser.parse(input))
  .handler(async ({ context, data }) => {
    const result = await auth.api.removeUser({ body: data, headers: context.requestHeaders })

    return result
  })

export const deleteUserMutation = mutationOptions({
  mutationFn: (data: Parameters<typeof deleteUser>[0]["data"]) => deleteUser({ data }),
  mutationKey: ["user", "deleteUser"],
})
