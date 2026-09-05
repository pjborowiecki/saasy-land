import { env } from "~/src/platform/env"

import { LICENSE_TIER } from "~/src/modules/license/license.constants"
import type { LicenseTier } from "~/src/modules/license/license.schema"

export function licenseTierForProduct(productId: string): LicenseTier | undefined {
  if (productId === env.POLAR_PRODUCT_ID_CORE) {
    return LICENSE_TIER.CORE
  }

  if (productId === env.POLAR_PRODUCT_ID_COMPLETE) {
    return LICENSE_TIER.COMPLETE
  }

  return undefined
}
