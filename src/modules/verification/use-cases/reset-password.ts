import { mutationOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import type * as zod from "zod"

import { RATE_LIMITS, withRateLimit } from "~/src/integrations/better-auth/auth.middleware"
import { auth } from "~/src/integrations/better-auth/auth.server"

import { VERIFICATION_MUTATION_KEYS } from "~/src/modules/verification/verification.constants"
import { verificationZodSchemas } from "~/src/modules/verification/verification.zod"

export const resetPassword = createServerFn({ method: "POST" })
  .middleware([withRateLimit("reset-password", RATE_LIMITS.TOKEN)])
  .validator((input: zod.input<typeof verificationZodSchemas.resetPassword>) => verificationZodSchemas.resetPassword.parse(input))
  .handler(({ context, data }) => {
    const { password, token } = data

    return auth.api.resetPassword({
      body: { newPassword: password, token },
      headers: context.requestHeaders,
    })
  })

export const resetPasswordMutation = mutationOptions({
  mutationFn: (data: Parameters<typeof resetPassword>[0]["data"]) => resetPassword({ data }),
  mutationKey: VERIFICATION_MUTATION_KEYS.RESET_PASSWORD,
})
