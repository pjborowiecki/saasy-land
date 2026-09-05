import "server-only"

import { eq } from "drizzle-orm"

import { db } from "~/src/platform/db/client"

import { license } from "~/src/modules/license/license.schema"
import type { License } from "~/src/modules/license/license.types"

const SINGLE_ROW = 1

export async function getLicense(userId: string): Promise<License["select"] | undefined> {
  const [row] = await db.select().from(license).where(eq(license.userId, userId)).limit(SINGLE_ROW)

  return row
}
