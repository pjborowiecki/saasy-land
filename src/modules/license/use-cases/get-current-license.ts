import { queryOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"

import { authorized } from "~/src/integrations/better-auth/auth.middleware"
import { polar } from "~/src/integrations/polar/polar.config"

import { LICENSE_QUERY_KEYS } from "~/src/modules/license/license.constants"
import { getLicense } from "~/src/modules/license/use-cases/get-license"

// TanStack Query requires a defined result; null represents an absent license.
// oxlint-disable-next-line unicorn/no-null
const NO_LICENSE = null

export const getCurrentLicense = createServerFn({ method: "GET" })
  .middleware([authorized()])
  .handler(async ({ context }) => (await getLicense(context.auth.user.id)) ?? NO_LICENSE)

export const currentLicenseQuery = queryOptions({ queryFn: () => getCurrentLicense(), queryKey: LICENSE_QUERY_KEYS.CURRENT })

export const getCurrentLicenseActivations = createServerFn({ method: "GET" })
  .middleware([authorized()])
  .handler(async ({ context }) => {
    const license = await getLicense(context.auth.user.id)
    if (typeof license?.polarLicenseKeyId !== "string" || license.polarLicenseKeyId.length === 0) {
      return { activations: [], limitActivations: 0 }
    }
    const { activations, limitActivations } = await polar.licenseKeys.get({ id: license.polarLicenseKeyId })
    return { activations, limitActivations }
  })

export const licenseActivationsQuery = queryOptions({
  queryFn: () => getCurrentLicenseActivations(),
  queryKey: LICENSE_QUERY_KEYS.ACTIVATIONS,
})
