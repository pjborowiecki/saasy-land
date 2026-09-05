import "server-only"

import type { LicenseKeyActivationBase } from "@polar-sh/sdk/models/components/licensekeyactivationbase.js"

import { env } from "~/src/platform/env"

import { polar } from "~/src/integrations/polar/polar.config"

export async function fetchLicenseKey(id: string): Promise<string> {
  const { key } = await polar.licenseKeys.get({ id })

  return key
}

export async function fetchLicenseActivations(
  id: string,
): Promise<{ activations: LicenseKeyActivationBase[]; limitActivations: number | null }> {
  const { activations, limitActivations } = await polar.licenseKeys.get({ id })

  return { activations, limitActivations }
}

export async function deactivateLicense({ activationId, key }: Readonly<{ activationId: string; key: string }>): Promise<void> {
  await polar.licenseKeys.deactivate({ activationId, key, organizationId: env.POLAR_ORGANIZATION_ID })
}
