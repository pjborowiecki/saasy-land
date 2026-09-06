import "@tanstack/react-start/server-only"

import { env } from "cloudflare:workers"

import type { LicenseKeyActivationBase } from "@polar-sh/sdk/models/components/licensekeyactivationbase.js"

import { polar } from "~/src/integrations/polar/polar.config"

export const fetchLicenseKey = async (id: string): Promise<string> => {
  const { key } = await polar.licenseKeys.get({ id })

  return key
}

export const fetchLicenseActivations = async (
  id: string,
): Promise<{ activations: LicenseKeyActivationBase[]; limitActivations: number | null }> => {
  const { activations, limitActivations } = await polar.licenseKeys.get({ id })

  return { activations, limitActivations }
}

export const deactivateLicense = async ({ activationId, key }: Readonly<{ activationId: string; key: string }>): Promise<void> => {
  await polar.licenseKeys.deactivate({ activationId, key, organizationId: env.POLAR_ORGANIZATION_ID })
}
