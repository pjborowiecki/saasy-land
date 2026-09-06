import { mutationOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import type * as zod from "zod"

import { withAuth } from "~/src/integrations/better-auth/auth.middleware"
import { auth } from "~/src/integrations/better-auth/auth.server"

import { userZodSchemas } from "~/src/modules/user/user.zod"

export const banUser = createServerFn({ method: "POST" })
  .middleware([withAuth({ user: ["ban"] })])
  .validator((input: zod.input<typeof userZodSchemas.banUser>) => userZodSchemas.banUser.parse(input))
  .handler(async ({ context, data }) => {
    const result = await auth.api.banUser({ body: data, headers: context.requestHeaders })

    return result
  })

export const banUserMutation = mutationOptions({
  mutationFn: (data: Parameters<typeof banUser>[0]["data"]) => banUser({ data }),
  mutationKey: ["user", "banUser"],
})
