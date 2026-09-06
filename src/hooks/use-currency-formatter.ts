import { useMemo, useRef } from "react"

import { useLocale } from "use-intl/react"

export interface CurrencyOptions extends Omit<Intl.NumberFormatOptions, "style"> {
  currency: string
  locale?: string
}

type HookDefaults = Partial<CurrencyOptions>

type RequiresCurrency<TData> = TData extends { currency: string }
  ? Partial<CurrencyOptions>
  : Partial<CurrencyOptions> & { currency: string }

interface CurrencyFormatter<TData extends HookDefaults> {
  formatCurrency: (args: { value: number } & RequiresCurrency<TData>) => string
  formatCurrencyToParts: (args: { value: number } & RequiresCurrency<TData>) => Intl.NumberFormatPart[]
}

const formatterCache = new Map<string, Intl.NumberFormat>()

const getFormatter = (locale: string, options: Omit<CurrencyOptions, "locale">): Intl.NumberFormat => {
  const optionKeys = Object.keys(options).toSorted((first, second) => first.localeCompare(second))
  const key = `${locale}\0${JSON.stringify(options, optionKeys)}`

  let formatter = formatterCache.get(key)
  if (!formatter) {
    formatter = new Intl.NumberFormat(locale, { style: "currency", ...options })
    formatterCache.set(key, formatter)
  }
  return formatter
}

export const useCurrencyFormatter = <const TData extends HookDefaults>(defaults?: TData): CurrencyFormatter<TData> => {
  const routeLocale = useLocale()

  const config = useRef(defaults)
  config.current = defaults

  return useMemo((): CurrencyFormatter<TData> => {
    const resolve = (args: { value: number } & RequiresCurrency<TData>) => {
      const { value, locale: localeArg, currency: currencyArg, ...callOptions } = args

      const currency = currencyArg ?? config.current?.currency
      if (currency === undefined || currency.length === 0) {
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
      formatCurrency: (args: { value: number } & RequiresCurrency<TData>) => {
        const { formatter, value } = resolve(args)
        return formatter.format(value)
      },
      formatCurrencyToParts: (args: { value: number } & RequiresCurrency<TData>) => {
        const { formatter, value } = resolve(args)
        return formatter.formatToParts(value)
      },
    }
  }, [routeLocale])
}
