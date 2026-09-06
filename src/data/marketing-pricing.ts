export const TIERS = ["core", "complete", "agency"] as const

export const TIER_PRICES = {
  agency: 899,
  complete: 399,
  core: 249,
} as const satisfies Record<(typeof TIERS)[number], number>

export const FEATURE_IDS = ["f1", "f2", "f3", "f4", "f5", "f6"] as const

export const FEATURED_TIER = "complete"
