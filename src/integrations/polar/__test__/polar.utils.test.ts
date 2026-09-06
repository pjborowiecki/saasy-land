import { env } from "cloudflare:workers"

import type { LicenseKeyWithActivations } from "@polar-sh/sdk/models/components/licensekeywithactivations.js"
import { describe, expect, it, vi } from "vite-plus/test"

import { JSON_NULL } from "~/src/platform/testing/lib/json-null"

import { polar } from "~/src/integrations/polar/polar.config"
import { deactivateLicense, fetchLicenseActivations, fetchLicenseKey } from "~/src/integrations/polar/polar.utils"

const LICENSE_KEY_ID = "lk_1"
const FULL_KEY = "SAASY-1111-2222-3333"

const ISSUED_AT = new Date("2026-01-01T00:00:00.000Z")

const LICENSE_KEY: LicenseKeyWithActivations = {
  activations: [],
  benefitId: "ben_1",
  createdAt: ISSUED_AT,
  customer: {
    avatarUrl: JSON_NULL,
    billingAddress: JSON_NULL,
    billingName: JSON_NULL,
    createdAt: ISSUED_AT,
    deletedAt: JSON_NULL,
    emailVerified: true,
    id: "cus_1",
    metadata: {},
    modifiedAt: JSON_NULL,
    name: JSON_NULL,
    organizationId: "org_1",
    taxId: JSON_NULL,
    type: "individual",
  },
  customerId: "cus_1",
  displayKey: "****-3333",
  expiresAt: JSON_NULL,
  id: LICENSE_KEY_ID,
  key: FULL_KEY,
  lastValidatedAt: JSON_NULL,
  limitActivations: JSON_NULL,
  limitUsage: JSON_NULL,
  modifiedAt: JSON_NULL,
  organizationId: "org_1",
  status: "granted",
  usage: 0,
  validations: 0,
}

vi.mock(import("@tanstack/react-start/server-only"), () => ({}))

describe("polar.utils", () => {
  it("returns the full key, not the masked one the webhook carries", async () => {
    expect.hasAssertions()
    const get = vi.spyOn(polar.licenseKeys, "get").mockResolvedValue(LICENSE_KEY)

    await expect(fetchLicenseKey(LICENSE_KEY_ID)).resolves.toBe(FULL_KEY)

    expect(get).toHaveBeenCalledWith({ id: LICENSE_KEY_ID })
    get.mockRestore()
  })

  it("reports the machines using a key and how many are allowed", async () => {
    expect.hasAssertions()
    const get = vi.spyOn(polar.licenseKeys, "get").mockResolvedValue(LICENSE_KEY)

    await expect(fetchLicenseActivations(LICENSE_KEY_ID)).resolves.toStrictEqual({ activations: [], limitActivations: JSON_NULL })

    get.mockRestore()
  })

  it("frees a slot against the organization that issued the key", async () => {
    expect.hasAssertions()
    const deactivate = vi.spyOn(polar.licenseKeys, "deactivate").mockResolvedValue()

    await deactivateLicense({ activationId: "act_1", key: FULL_KEY })

    expect(deactivate).toHaveBeenCalledWith({
      activationId: "act_1",
      key: FULL_KEY,
      organizationId: env.POLAR_ORGANIZATION_ID,
    })
    deactivate.mockRestore()
  })
})
