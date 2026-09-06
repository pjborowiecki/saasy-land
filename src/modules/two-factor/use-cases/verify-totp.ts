import { mutationOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import type * as zod from "zod"

import { RATE_LIMITS, withRateLimit } from "~/src/integrations/better-auth/auth.middleware"
import { auth } from "~/src/integrations/better-auth/auth.server"

import { twoFactorZodSchemas } from "~/src/modules/two-factor/two-factor.zod"

export const verifyTotp = createServerFn({ method: "POST" })
  .middleware([withRateLimit("verify-totp", RATE_LIMITS.SENSITIVE)])
  .validator((input: zod.input<typeof twoFactorZodSchemas.verifyTotp>) => twoFactorZodSchemas.verifyTotp.parse(input))
  .handler(({ context, data }) =>
    auth.api.verifyTOTP({
      body: data,
      headers: context.requestHeaders,
    }),
  )

export const verifyTotpMutation = mutationOptions({
  mutationFn: (data: Parameters<typeof verifyTotp>[0]["data"]) => verifyTotp({ data }),
  mutationKey: ["two-factor", "verifyTotp"],
})
