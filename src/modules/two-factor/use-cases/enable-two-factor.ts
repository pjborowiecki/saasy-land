import { mutationOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import type * as zod from "zod"

import { RATE_LIMITS, withAuth, withRateLimit } from "~/src/integrations/better-auth/auth.middleware"
import { auth } from "~/src/integrations/better-auth/auth.server"

import { twoFactorZodSchemas } from "~/src/modules/two-factor/two-factor.zod"

export const enableTwoFactor = createServerFn({ method: "POST" })
  .middleware([withRateLimit("enable-two-factor", RATE_LIMITS.SENSITIVE), withAuth()])
  .validator((input: zod.input<typeof twoFactorZodSchemas.enableTwoFactor>) => twoFactorZodSchemas.enableTwoFactor.parse(input))
  .handler(({ context, data }) =>
    auth.api.enableTwoFactor({
      body: { password: data.password },
      headers: context.requestHeaders,
    }),
  )

export const enableTwoFactorMutation = mutationOptions({
  mutationFn: (data: Parameters<typeof enableTwoFactor>[0]["data"]) => enableTwoFactor({ data }),
  mutationKey: ["two-factor", "enableTwoFactor"],
})
