const TIMEZONES = ["UTC", "America/New_York", "America/Los_Angeles"] as const

const DEFAULT_TIMEZONE = "UTC" satisfies (typeof TIMEZONES)[number]

export const TIMEZONE = {
  DEFAULT_TIMEZONE,
  TIMEZONES,
} as const
