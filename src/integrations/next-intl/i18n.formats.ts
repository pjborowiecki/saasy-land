import type { Formats } from "next-intl"

import { CONSTANTS } from "~/src/constants"
import type { Locale } from "~/src/constants/types"

export const getFormats = (locale: Locale): Formats => {
  const currency = CONSTANTS.CURRENCIES[locale]

  return {
    number: {
      currency: { currency, style: "currency", currencyDisplay: "symbol" }, // Default: native decimal handling
      currencyWhole: { currency, style: "currency", currencyDisplay: "symbol", maximumFractionDigits: 0 }, // e.g. $99
      currencyAccounting: { currency, style: "currency", currencyDisplay: "symbol", minimumFractionDigits: 2, maximumFractionDigits: 2 }, // e.g. $99.00
      currencyCompact: { currency, style: "currency", currencyDisplay: "symbol", notation: "compact", compactDisplay: "short" }, // e.g., $1.5M, $50K

      readingTime: { style: "unit", unit: "minute", unitDisplay: "long" }, // e.g., "40 minutes"
      readingTimeShort: { style: "unit", unit: "minute", unitDisplay: "short" }, // e.g., "40 min"

      percent: { style: "percent", maximumFractionDigits: 2 },
      compact: { notation: "compact", compactDisplay: "short" }, // e.g., 1.2K, 5M
    },

    dateTime: {
      short: { day: "2-digit", month: "2-digit", year: "numeric" }, // e.g., 04/06/2026
      medium: { day: "numeric", month: "short", year: "numeric" }, // e.g., Apr 6, 2026
      long: { day: "numeric", month: "long", year: "numeric" }, // e.g., April 6, 2026
      full: { weekday: "long", day: "numeric", month: "long", year: "numeric" }, // e.g., Monday, April 6, 2026

      timeShort: { hour: "numeric", minute: "numeric" }, // e.g., 10:04 PM
      timeMedium: { hour: "numeric", minute: "numeric", second: "numeric" }, // e.g., 10:04:52 PM
      timeWithZone: { hour: "numeric", minute: "numeric", timeZoneName: "short" }, // e.g., 10:04 PM CEST

      dateTimeShort: { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "numeric" }, // e.g., Apr 6, 2026, 10:04 PM
      dateTimeLong: { day: "numeric", month: "long", year: "numeric", hour: "numeric", minute: "numeric", timeZoneName: "short" }, // e.g., April 6, 2026, 10:04 PM CEST

      monthYear: { month: "long", year: "numeric" }, // e.g., April 2026 (For billing/filters)
      dayMonth: { day: "numeric", month: "long" }, // e.g., April 6 (For recurring events)
      weekdayOnly: { weekday: "long" }, // e.g., Monday
      weekdayShort: { weekday: "short" }, // e.g., Mon
    },
  }
}
