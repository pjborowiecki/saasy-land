import { mutationOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import type * as zod from "zod"

import { RATE_LIMITS, withAuth, withRateLimit } from "~/src/integrations/better-auth/auth.middleware"
import { auth } from "~/src/integrations/better-auth/auth.server"

import { accountZodSchemas } from "~/src/modules/account/account.zod"

export const settingsChangePassword = createServerFn({ method: "POST" })
  .middleware([withRateLimit("change-password", RATE_LIMITS.SENSITIVE), withAuth()])
  .validator((input: zod.input<typeof accountZodSchemas.changePassword>) => accountZodSchemas.changePassword.parse(input))
  .handler(({ context, data }) =>
    auth.api.changePassword({
      body: {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        revokeOtherSessions: data.revokeOtherSessions ?? false,
      },
      headers: context.requestHeaders,
    }),
  )

export const settingsChangePasswordMutation = mutationOptions({
  mutationFn: (data: Parameters<typeof settingsChangePassword>[0]["data"]) => settingsChangePassword({ data }),
  mutationKey: ["account", "settingsChangePassword"],
})
