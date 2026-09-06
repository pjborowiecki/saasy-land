import "@tanstack/react-start/server-only"

import { eq } from "drizzle-orm"

import { db } from "~/src/integrations/drizzle-orm/drizzle.database"

import { LICENSE_STATUS } from "~/src/modules/license/license.constants"
import { license } from "~/src/modules/license/license.schema"

export const revokeLicense = async (userId: string): Promise<void> => {
  await db.update(license).set({ status: LICENSE_STATUS.REVOKED }).where(eq(license.userId, userId))
}
