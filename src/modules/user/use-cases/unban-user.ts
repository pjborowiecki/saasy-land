import { mutationOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import type * as zod from "zod"

import { withAuth } from "~/src/integrations/better-auth/auth.middleware"
import { auth } from "~/src/integrations/better-auth/auth.server"

import { userZodSchemas } from "~/src/modules/user/user.zod"

export const unbanUser = createServerFn({ method: "POST" })
  .middleware([withAuth({ user: ["ban"] })])
  .validator((input: zod.input<typeof userZodSchemas.unbanUser>) => userZodSchemas.unbanUser.parse(input))
  .handler(async ({ context, data }) => {
    const result = await auth.api.unbanUser({ body: data, headers: context.requestHeaders })

    return result
  })

export const unbanUserMutation = mutationOptions({
  mutationFn: (data: Parameters<typeof unbanUser>[0]["data"]) => unbanUser({ data }),
  mutationKey: ["user", "unbanUser"],
})
