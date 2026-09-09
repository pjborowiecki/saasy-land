import { mutationOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import type * as zod from "zod"

import { RATE_LIMITS, withRateLimit } from "~/src/integrations/better-auth/auth.middleware"
import { auth } from "~/src/integrations/better-auth/auth.server"

import { VERIFICATION_MUTATION_KEYS } from "~/src/modules/verification/verification.constants"
import { verificationZodSchemas } from "~/src/modules/verification/verification.zod"

export const requestPasswordReset = createServerFn({ method: "POST" })
  .middleware([withRateLimit("request-password-reset", RATE_LIMITS.SENSITIVE)])
  .validator((input: zod.input<typeof verificationZodSchemas.requestPasswordReset>) =>
    verificationZodSchemas.requestPasswordReset.parse(input),
  )
  .handler(({ context, data }) => auth.api.requestPasswordReset({ body: data, headers: context.requestHeaders }))

export const requestPasswordResetMutation = mutationOptions({
  mutationFn: (data: Parameters<typeof requestPasswordReset>[0]["data"]) => requestPasswordReset({ data }),
  mutationKey: VERIFICATION_MUTATION_KEYS.REQUEST_PASSWORD_RESET,
})
