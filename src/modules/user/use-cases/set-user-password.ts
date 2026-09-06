import { mutationOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import type * as zod from "zod"

import { withAuth } from "~/src/integrations/better-auth/auth.middleware"
import { auth } from "~/src/integrations/better-auth/auth.server"

import { userZodSchemas } from "~/src/modules/user/user.zod"

export const setUserPassword = createServerFn({ method: "POST" })
  .middleware([withAuth({ user: ["set-password"] })])
  .validator((input: zod.input<typeof userZodSchemas.setUserPassword>) => userZodSchemas.setUserPassword.parse(input))
  .handler(({ context, data }) => auth.api.setUserPassword({ body: data, headers: context.requestHeaders }))

export const setUserPasswordMutation = mutationOptions({
  mutationFn: (data: Parameters<typeof setUserPassword>[0]["data"]) => setUserPassword({ data }),
  mutationKey: ["user", "setUserPassword"],
})
