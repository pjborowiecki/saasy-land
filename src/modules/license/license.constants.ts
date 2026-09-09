export const LICENSE_TIER = {
  AGENCY: "agency",
  COMPLETE: "complete",
  CORE: "core",
} as const

export const LICENSE_STATUS = {
  ACTIVE: "active",
  REVOKED: "revoked",
} as const

export const LICENSE_QUERY_KEYS = {
  ACTIVATIONS: ["license", "activations"],
  ALL: ["license"],
  CURRENT: ["license", "current"],
} as const

export const LICENSE_MUTATION_KEYS = {
  DEACTIVATE: ["license", "deactivateLicense"],
  START_CHECKOUT: ["license", "startCheckout"],
} as const
