import type { LicenseKeyWithActivations } from "@polar-sh/sdk/models/components/licensekeywithactivations.js"

import { JSON_NULL } from "~/src/platform/testing/lib/json-null"

const LICENSE_KEY_ID = "lk_1"
const FULL_KEY = "SAASY-1111-2222-3333"

const ISSUED_AT = new Date("2026-01-01T00:00:00.000Z")

export const POLAR_LICENSE_KEY: LicenseKeyWithActivations = {
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
