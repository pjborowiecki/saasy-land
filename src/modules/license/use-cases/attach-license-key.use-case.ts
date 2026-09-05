import "server-only"

import { eq } from "drizzle-orm"

import { db } from "~/src/platform/db/client"

import { license } from "~/src/modules/license/license.schema"

import { fetchLicenseKey } from "~/src/integrations/polar/polar.utils"

interface AttachLicenseKeyInput {
  readonly polarLicenseKeyId: string
  readonly userId: string
}

export async function attachLicenseKey({ polarLicenseKeyId, userId }: Readonly<AttachLicenseKeyInput>): Promise<void> {
  const key = await fetchLicenseKey(polarLicenseKeyId)

  const attached = await db.update(license).set({ key, polarLicenseKeyId }).where(eq(license.userId, userId)).returning({ id: license.id })

  if (attached.length === 0) {
    console.error(`[license] no license for user ${userId}, cannot attach key ${polarLicenseKeyId}`)
  }
}
