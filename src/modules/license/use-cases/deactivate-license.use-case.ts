"use server"

import { eq } from "drizzle-orm"

import { db } from "~/src/platform/db/client"

import { AppError, ERROR_CODES } from "~/src/modules/_core/constants/errors"
import { license } from "~/src/modules/license/license.schema"
import { licenseZodSchemas } from "~/src/modules/license/license.zod"

import { actionClient, RATE_LIMITS, withAuth, withRateLimit } from "~/src/integrations/next-safe-action/action.client"
import { deactivateLicense as deactivateWithPolar } from "~/src/integrations/polar/polar.utils"

const SINGLE_ROW = 1

export const deactivateLicense = actionClient
  .use(withAuth())
  .use(withRateLimit("deactivate-license", RATE_LIMITS.SENSITIVE))
  .inputSchema(licenseZodSchemas.deactivateLicense)
  .outputSchema(licenseZodSchemas.deactivated)
  .action(async ({ ctx, parsedInput: { activationId } }) => {
    const [row] = await db.select({ key: license.key }).from(license).where(eq(license.userId, ctx.auth.user.id)).limit(SINGLE_ROW)

    if (!row?.key) {
      throw new AppError(ERROR_CODES.NOT_FOUND)
    }

    await deactivateWithPolar({ activationId, key: row.key })

    return { deactivated: true }
  })
