import { mutationOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import type * as zod from "zod"

import { RATE_LIMITS, withRateLimit } from "~/src/integrations/better-auth/auth.middleware"
import { auth } from "~/src/integrations/better-auth/auth.server"

import { verificationZodSchemas } from "~/src/modules/verification/verification.zod"

export const sendVerificationEmail = createServerFn({ method: "POST" })
  .middleware([withRateLimit("send-verification-email", RATE_LIMITS.SENSITIVE)])
  .validator((input: zod.input<typeof verificationZodSchemas.sendVerificationEmail>) =>
    verificationZodSchemas.sendVerificationEmail.parse(input),
  )
  .handler(({ context, data }) => auth.api.sendVerificationEmail({ body: data, headers: context.requestHeaders }))

export const sendVerificationEmailMutation = mutationOptions({
  mutationFn: (data: Parameters<typeof sendVerificationEmail>[0]["data"]) => sendVerificationEmail({ data }),
  mutationKey: ["verification", "sendVerificationEmail"],
})
