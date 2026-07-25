"use client"

import { useMemo, useRef } from "react"

import { useLocale } from "next-intl"

export interface CurrencyOptions extends Omit<Intl.NumberFormatOptions, "style"> {
  currency: string
  locale?: string
}

type HookDefaults = Partial<CurrencyOptions>

type RequiresCurrency<D> = D extends { currency: string } ? Partial<CurrencyOptions> : Partial<CurrencyOptions> & { currency: string }

interface CurrencyFormatter<D extends HookDefaults> {
  formatCurrency: (args: { value: number } & RequiresCurrency<D>) => string
  formatCurrencyToParts: (args: { value: number } & RequiresCurrency<D>) => Intl.NumberFormatPart[]
}

const formatterCache = new Map<string, Intl.NumberFormat>()

function getFormatter(locale: string, options: Omit<CurrencyOptions, "locale">): Intl.NumberFormat {
  const optionKeys = Object.keys(options).toSorted((a, b) => a.localeCompare(b))
  const key = `${locale}\0${JSON.stringify(options, optionKeys)}`

  let formatter = formatterCache.get(key)
  if (!formatter) {
    formatter = new Intl.NumberFormat(locale, { style: "currency", ...options })
    formatterCache.set(key, formatter)
  }
  return formatter
}

export function useCurrencyFormatter<const D extends HookDefaults>(defaults?: D): CurrencyFormatter<D> {
  const routeLocale = useLocale()

  const config = useRef(defaults)
  config.current = defaults

  return useMemo((): CurrencyFormatter<D> => {
    const resolve = (args: { value: number } & RequiresCurrency<D>) => {
      const { value, locale: localeArg, currency: currencyArg, ...callOptions } = args

      const currency = currencyArg ?? config.current?.currency
      if (!currency) {
        throw new Error("formatCurrency requires a currency code")
      }

      const { locale: _defaultLocale, ...defaultIntlOptions } = config.current ?? {}

      const locale = localeArg ?? config.current?.locale ?? routeLocale
      const options = { ...defaultIntlOptions, ...callOptions, currency }

      return {
        formatter: getFormatter(locale, options),
        value,
      }
    }

    return {
      formatCurrency: (args: { value: number } & RequiresCurrency<D>) => {
        const { formatter, value } = resolve(args)
        return formatter.format(value)
      },
      formatCurrencyToParts: (args: { value: number } & RequiresCurrency<D>) => {
        const { formatter, value } = resolve(args)
        return formatter.formatToParts(value)
      },
    }
  }, [routeLocale])
}
