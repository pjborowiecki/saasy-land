import { mutationOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import type * as zod from "zod"

import { RATE_LIMITS, withRateLimit } from "~/src/integrations/better-auth/auth.middleware"
import { auth } from "~/src/integrations/better-auth/auth.server"

import { verificationZodSchemas } from "~/src/modules/verification/verification.zod"

export const verifyEmail = createServerFn({ method: "POST" })
  .middleware([withRateLimit("verify-email", RATE_LIMITS.TOKEN)])
  .validator((input: zod.input<typeof verificationZodSchemas.verifyEmail>) => verificationZodSchemas.verifyEmail.parse(input))
  .handler(({ context, data }) => auth.api.verifyEmail({ headers: context.requestHeaders, query: { token: data.token } }))

export const verifyEmailMutation = mutationOptions({
  mutationFn: (data: Parameters<typeof verifyEmail>[0]["data"]) => verifyEmail({ data }),
  mutationKey: ["verification", "verifyEmail"],
})
