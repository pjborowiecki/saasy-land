import "server-only"

import { eq } from "drizzle-orm"

import { db } from "~/src/platform/db/client"

import { LICENSE_STATUS } from "~/src/modules/license/license.constants"
import { license } from "~/src/modules/license/license.schema"

export async function revokeLicense(userId: string): Promise<void> {
  await db.update(license).set({ status: LICENSE_STATUS.REVOKED }).where(eq(license.userId, userId))
}
