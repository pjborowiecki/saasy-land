import { mutationOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import type * as zod from "zod"

import { RATE_LIMITS, withAuth, withRateLimit } from "~/src/integrations/better-auth/auth.middleware"
import { auth } from "~/src/integrations/better-auth/auth.server"

import { twoFactorZodSchemas } from "~/src/modules/two-factor/two-factor.zod"

export const disableTwoFactor = createServerFn({ method: "POST" })
  .middleware([withRateLimit("disable-two-factor", RATE_LIMITS.SENSITIVE), withAuth()])
  .validator((input: zod.input<typeof twoFactorZodSchemas.disableTwoFactor>) => twoFactorZodSchemas.disableTwoFactor.parse(input))
  .handler(({ context, data }) =>
    auth.api.disableTwoFactor({
      body: { password: data.password },
      headers: context.requestHeaders,
    }),
  )

export const disableTwoFactorMutation = mutationOptions({
  mutationFn: (data: Parameters<typeof disableTwoFactor>[0]["data"]) => disableTwoFactor({ data }),
  mutationKey: ["two-factor", "disableTwoFactor"],
})
