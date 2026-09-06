import { queryOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"

import { withAuth } from "~/src/integrations/better-auth/auth.middleware"
import { fetchLicenseActivations } from "~/src/integrations/polar/polar.utils"

import { getLicense } from "~/src/modules/license/use-cases/get-license"

// TanStack Query requires a defined result; null represents an absent license.
// oxlint-disable-next-line unicorn/no-null
const NO_LICENSE = null

export const getCurrentLicense = createServerFn({ method: "GET" })
  .middleware([withAuth()])
  .handler(async ({ context }) => (await getLicense(context.auth.user.id)) ?? NO_LICENSE)

export const currentLicenseQuery = queryOptions({ queryFn: () => getCurrentLicense(), queryKey: ["license", "current"] })

export const getCurrentLicenseActivations = createServerFn({ method: "GET" })
  .middleware([withAuth()])
  .handler(async ({ context }) => {
    const license = await getLicense(context.auth.user.id)
    if (typeof license?.polarLicenseKeyId !== "string" || license.polarLicenseKeyId.length === 0) {
      return { activations: [], limitActivations: 0 }
    }
    return fetchLicenseActivations(license.polarLicenseKeyId)
  })

export const licenseActivationsQuery = queryOptions({ queryFn: () => getCurrentLicenseActivations(), queryKey: ["license", "activations"] })
