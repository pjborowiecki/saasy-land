import type { Formats } from "next-intl"

import { CONSTANTS } from "~/src/constants"
import type { Locale } from "~/src/constants/types"

export const getFormats = (locale: Locale): Formats => {
  const currency = CONSTANTS.I18N.CURRENCIES[locale]

  return {
    dateTime: {
      dateTimeLong: { day: "numeric", hour: "numeric", minute: "numeric", month: "long", timeZoneName: "short", year: "numeric" }, // e.g., April 6, 2026, 10:04 PM CEST
      dateTimeShort: { day: "numeric", hour: "numeric", minute: "numeric", month: "short", year: "numeric" }, // e.g., Apr 6, 2026, 10:04 PM
      dayMonth: { day: "numeric", month: "long" }, // e.g., April 6 (For recurring events)
      full: { day: "numeric", month: "long", weekday: "long", year: "numeric" }, // e.g., Monday, April 6, 2026
      long: { day: "numeric", month: "long", year: "numeric" }, // e.g., April 6, 2026
      medium: { day: "numeric", month: "short", year: "numeric" }, // e.g., Apr 6, 2026
      monthYear: { month: "long", year: "numeric" }, // e.g., April 2026 (For billing/filters)
      short: { day: "2-digit", month: "2-digit", year: "numeric" }, // e.g., 04/06/2026
      timeMedium: { hour: "numeric", minute: "numeric", second: "numeric" }, // e.g., 10:04:52 PM
      timeShort: { hour: "numeric", minute: "numeric" }, // e.g., 10:04 PM
      timeWithZone: { hour: "numeric", minute: "numeric", timeZoneName: "short" }, // e.g., 10:04 PM CEST
      weekdayOnly: { weekday: "long" }, // e.g., Monday
      weekdayShort: { weekday: "short" }, // e.g., Mon
    },

    number: {
      compact: { compactDisplay: "short", notation: "compact" }, // e.g., 1.2K, 5M
      currency: { currency, currencyDisplay: "symbol", style: "currency" }, // Default: native decimal handling
      currencyAccounting: { currency, currencyDisplay: "symbol", maximumFractionDigits: 2, minimumFractionDigits: 2, style: "currency" }, // e.g. $99.00
      currencyCompact: { compactDisplay: "short", currency, currencyDisplay: "symbol", notation: "compact", style: "currency" }, // e.g., $1.5M, $50K
      currencyWhole: { currency, currencyDisplay: "symbol", maximumFractionDigits: 0, style: "currency" }, // e.g. $99
      percent: { maximumFractionDigits: 2, style: "percent" },
      readingTime: { style: "unit", unit: "minute", unitDisplay: "long" }, // e.g., "40 minutes"
      readingTimeShort: { style: "unit", unit: "minute", unitDisplay: "short" }, // e.g., "40 min"
    },
  }
}
