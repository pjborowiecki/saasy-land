import { mutationOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import { eq } from "drizzle-orm"
import type * as zod from "zod"

import { RATE_LIMITS, withAuth, withRateLimit } from "~/src/integrations/better-auth/auth.middleware"
import { db } from "~/src/integrations/drizzle-orm/drizzle.database"
import { deactivateLicense as deactivateWithPolar } from "~/src/integrations/polar/polar.utils"

import { AppError, ERROR_CODES } from "~/src/modules/_core/constants/errors"
import { license } from "~/src/modules/license/license.schema"
import { licenseZodSchemas } from "~/src/modules/license/license.zod"

const SINGLE_ROW = 1

export const deactivateLicense = createServerFn({ method: "POST" })
  .middleware([withAuth(), withRateLimit("deactivate-license", RATE_LIMITS.SENSITIVE)])
  .validator((input: zod.input<typeof licenseZodSchemas.deactivateLicense>) => licenseZodSchemas.deactivateLicense.parse(input))
  .handler(async ({ context, data: { activationId } }) => {
    const [row] = await db.select({ key: license.key }).from(license).where(eq(license.userId, context.auth.user.id)).limit(SINGLE_ROW)

    if (row === undefined || row.key === null || row.key.length === 0) {
      throw new AppError(ERROR_CODES.NOT_FOUND)
    }

    await deactivateWithPolar({ activationId, key: row.key })

    return { deactivated: true }
  })

export const deactivateLicenseMutation = mutationOptions({
  mutationFn: (data: Parameters<typeof deactivateLicense>[0]["data"]) => deactivateLicense({ data }),
  mutationKey: ["license", "deactivateLicense"],
})
