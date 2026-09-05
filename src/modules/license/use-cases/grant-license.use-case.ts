import "server-only"

import { randomUUIDv7 } from "bun"

import { db } from "~/src/platform/db/client"

import { LICENSE_STATUS } from "~/src/modules/license/license.constants"
import { license, type LicenseTier } from "~/src/modules/license/license.schema"

interface GrantLicenseInput {
  readonly polarCustomerId: string
  readonly polarOrderId: string
  readonly tier: LicenseTier
  readonly userId: string
}

export async function grantLicense({ polarCustomerId, polarOrderId, tier, userId }: Readonly<GrantLicenseInput>): Promise<void> {
  await db
    .insert(license)
    .values({ id: randomUUIDv7(), polarCustomerId, polarOrderId, tier, userId })
    .onConflictDoUpdate({
      set: { polarCustomerId, polarOrderId, status: LICENSE_STATUS.ACTIVE, tier },
      target: license.userId,
    })
}
