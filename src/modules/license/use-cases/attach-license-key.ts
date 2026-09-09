import "@tanstack/react-start/server-only"

import { eq } from "drizzle-orm"

import { db } from "~/src/integrations/drizzle-orm/drizzle.database"
import { polar } from "~/src/integrations/polar/polar.config"

import { license } from "~/src/modules/license/license.schema"

interface AttachLicenseKeyInput {
  readonly polarLicenseKeyId: string
  readonly userId: string
}

export const attachLicenseKey = async ({ polarLicenseKeyId, userId }: Readonly<AttachLicenseKeyInput>): Promise<void> => {
  const { key } = await polar.licenseKeys.get({ id: polarLicenseKeyId })

  const attached = await db.update(license).set({ key, polarLicenseKeyId }).where(eq(license.userId, userId)).returning({ id: license.id })

  if (attached.length === 0) {
    // Reject delivery so Polar retries if the benefit arrives before the paid order.
    throw new Error("The license purchase has not been recorded yet")
  }
}
