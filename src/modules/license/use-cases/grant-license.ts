import "@tanstack/react-start/server-only"

import { v7 } from "uuid"

import { db } from "~/src/integrations/drizzle-orm/drizzle.database"

import { LICENSE_STATUS } from "~/src/modules/license/license.constants"
import { type LicenseTier, license } from "~/src/modules/license/license.schema"

interface GrantLicenseInput {
  readonly polarCustomerId: string
  readonly polarOrderId: string
  readonly tier: LicenseTier
  readonly userId: string
}

export const grantLicense = async ({ polarCustomerId, polarOrderId, tier, userId }: Readonly<GrantLicenseInput>): Promise<void> => {
  await db
    .insert(license)
    .values({ id: v7(), polarCustomerId, polarOrderId, tier, userId })
    .onConflictDoUpdate({
      set: { polarCustomerId, polarOrderId, status: LICENSE_STATUS.ACTIVE, tier },
      target: license.userId,
    })
}
