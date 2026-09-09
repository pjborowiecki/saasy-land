import { mutationOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import type * as zod from "zod"

import { RATE_LIMITS, withRateLimit } from "~/src/integrations/better-auth/auth.middleware"
import { auth } from "~/src/integrations/better-auth/auth.server"

import { TWO_FACTOR_MUTATION_KEYS } from "~/src/modules/two-factor/two-factor.constants"
import { twoFactorZodSchemas } from "~/src/modules/two-factor/two-factor.zod"

export const verifyBackupCode = createServerFn({ method: "POST" })
  .middleware([withRateLimit("verify-backup-code", RATE_LIMITS.SENSITIVE)])
  .validator((input: zod.input<typeof twoFactorZodSchemas.verifyBackupCode>) => twoFactorZodSchemas.verifyBackupCode.parse(input))
  .handler(({ context, data }) =>
    auth.api.verifyBackupCode({
      body: {
        code: data.code,
        trustDevice: data.trustDevice,
      },
      headers: context.requestHeaders,
    }),
  )

export const verifyBackupCodeMutation = mutationOptions({
  mutationFn: (data: Parameters<typeof verifyBackupCode>[0]["data"]) => verifyBackupCode({ data }),
  mutationKey: TWO_FACTOR_MUTATION_KEYS.VERIFY_BACKUP_CODE,
})
