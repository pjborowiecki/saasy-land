"use client"

import { useMemo, useRef } from "react"

import { useLocale } from "next-intl"

export interface DateOptions extends Intl.DateTimeFormatOptions {
  locale?: string
}

type HookDefaults = Partial<DateOptions>

export type DateValue = Date | number | string

interface DateFormatter {
  format: (args: { value: DateValue } & Partial<DateOptions>) => string
  formatToParts: (args: { value: DateValue } & Partial<DateOptions>) => Intl.DateTimeFormatPart[]
}

const formatterCache = new Map<string, Intl.DateTimeFormat>()

function getFormatter(locale: string, options: Omit<DateOptions, "locale">): Intl.DateTimeFormat {
  const optionKeys = Object.keys(options).toSorted((a, b) => a.localeCompare(b))
  const key = `${locale}\0${JSON.stringify(options, optionKeys)}`

  let formatter = formatterCache.get(key)
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(locale, options)
    formatterCache.set(key, formatter)
  }
  return formatter
}

export function useDateFormatter(defaults?: HookDefaults): DateFormatter {
  const routeLocale = useLocale()

  const config = useRef(defaults)
  config.current = defaults

  return useMemo((): DateFormatter => {
    const resolve = (args: { value: DateValue } & Partial<DateOptions>) => {
      const { value, locale: localeArg, ...callOptions } = args

      const { locale: _defaultLocale, ...defaultIntlOptions } = config.current ?? {}

      const locale = localeArg ?? config.current?.locale ?? routeLocale
      const options = { ...defaultIntlOptions, ...callOptions }

      const dateValue = value instanceof Date ? value : new Date(value)

      return {
        dateValue,
        formatter: getFormatter(locale, options),
      }
    }

    return {
      format: (args: { value: DateValue } & Partial<DateOptions>) => {
        const { formatter, dateValue } = resolve(args)
        return formatter.format(dateValue)
      },
      formatToParts: (args: { value: DateValue } & Partial<DateOptions>) => {
        const { formatter, dateValue } = resolve(args)
        return formatter.formatToParts(dateValue)
      },
    }
  }, [routeLocale])
}
