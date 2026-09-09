import { mutationOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import type * as zod from "zod"

import { RATE_LIMITS, authorized, withRateLimit } from "~/src/integrations/better-auth/auth.middleware"
import { auth } from "~/src/integrations/better-auth/auth.server"

import { TWO_FACTOR_MUTATION_KEYS } from "~/src/modules/two-factor/two-factor.constants"
import { twoFactorZodSchemas } from "~/src/modules/two-factor/two-factor.zod"

export const enableTwoFactor = createServerFn({ method: "POST" })
  .middleware([withRateLimit("enable-two-factor", RATE_LIMITS.SENSITIVE), authorized()])
  .validator((input: zod.input<typeof twoFactorZodSchemas.enableTwoFactor>) => twoFactorZodSchemas.enableTwoFactor.parse(input))
  .handler(({ context, data }) =>
    auth.api.enableTwoFactor({
      body: { password: data.password },
      headers: context.requestHeaders,
    }),
  )

export const enableTwoFactorMutation = mutationOptions({
  mutationFn: (data: Parameters<typeof enableTwoFactor>[0]["data"]) => enableTwoFactor({ data }),
  mutationKey: TWO_FACTOR_MUTATION_KEYS.ENABLE,
})
