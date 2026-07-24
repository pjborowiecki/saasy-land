/** @vitest-environment jsdom */

import { type ReactNode } from "react"

import { renderHook } from "@testing-library/react"
import { NextIntlClientProvider } from "next-intl"

import { loadLocaleMessagesFromDir } from "~/src/integrations/next-intl/i18n.utils"

import { useCurrencyFormatter } from "~/src/hooks/use-currency-formatter"

const USD_SAMPLE_AMOUNT = 1234.5
const MINIMAL_AMOUNT = 1
const EUR_SAMPLE_AMOUNT = 42
const LOCALE_COMPARE_AMOUNT = 50
const PARTS_SAMPLE_AMOUNT = 10
const PLN_SAMPLE_AMOUNT = 99
const MIN_FRACTION_DIGITS = 2

function createWrapper(locale: "en-US" | "pl-PL" = "en-US") {
  const messages = loadLocaleMessagesFromDir(locale)

  return ({ children }: { children: ReactNode }) => (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  )
}

describe("use currency formatter component", () => {
  it("formats with default currency and route locale", () => {
    expect.hasAssertions()

    const { result } = renderHook(() => useCurrencyFormatter({ currency: "USD" }), {
      wrapper: createWrapper("en-US"),
    })

    const expected = new Intl.NumberFormat("en-US", { currency: "USD", style: "currency" }).format(USD_SAMPLE_AMOUNT)

    expect(result.current.format({ value: USD_SAMPLE_AMOUNT })).toBe(expected)
  })

  it("throws when resolved currency is empty", () => {
    expect.hasAssertions()

    const { result } = renderHook(() => useCurrencyFormatter({ currency: "" }), {
      wrapper: createWrapper("en-US"),
    })

    expect(() => result.current.format({ value: MINIMAL_AMOUNT })).toThrow("formatCurrency requires a currency code")
  })

  it("accepts currency on each call when defaults omit it", () => {
    expect.hasAssertions()

    const { result } = renderHook(() => useCurrencyFormatter(), {
      wrapper: createWrapper("en-US"),
    })

    const expected = new Intl.NumberFormat("en-US", { currency: "EUR", style: "currency" }).format(EUR_SAMPLE_AMOUNT)

    expect(result.current.format({ currency: "EUR", value: EUR_SAMPLE_AMOUNT })).toBe(expected)
  })

  it("prefers hook default locale over route locale", () => {
    expect.hasAssertions()

    const { result } = renderHook(() => useCurrencyFormatter({ currency: "EUR", locale: "de-DE" }), { wrapper: createWrapper("en-US") })

    const expected = new Intl.NumberFormat("de-DE", { currency: "EUR", style: "currency" }).format(LOCALE_COMPARE_AMOUNT)

    expect(result.current.format({ value: LOCALE_COMPARE_AMOUNT })).toBe(expected)
  })

  it("prefers per-call locale over hook and route locale", () => {
    expect.hasAssertions()

    const { result } = renderHook(() => useCurrencyFormatter({ currency: "EUR", locale: "de-DE" }), { wrapper: createWrapper("en-US") })

    const expected = new Intl.NumberFormat("fr-FR", { currency: "EUR", style: "currency" }).format(LOCALE_COMPARE_AMOUNT)

    expect(result.current.format({ locale: "fr-FR", value: LOCALE_COMPARE_AMOUNT })).toBe(expected)
  })

  it("formatToParts returns Intl parts for the resolved locale", () => {
    expect.hasAssertions()

    const { result } = renderHook(() => useCurrencyFormatter({ currency: "USD" }), {
      wrapper: createWrapper("en-US"),
    })

    const parts = result.current.formatToParts({ value: PARTS_SAMPLE_AMOUNT })

    expect(parts.some((part) => part.type === "currency")).toBe(true)
    expect(parts.some((part) => part.type === "integer")).toBe(true)
  })

  it("uses route locale when defaults do not set locale", () => {
    expect.hasAssertions()

    const { result } = renderHook(() => useCurrencyFormatter({ currency: "PLN" }), {
      wrapper: createWrapper("pl-PL"),
    })

    const expected = new Intl.NumberFormat("pl-PL", { currency: "PLN", style: "currency" }).format(PLN_SAMPLE_AMOUNT)

    expect(result.current.format({ value: PLN_SAMPLE_AMOUNT })).toBe(expected)
  })

  it("formats with multiple default Intl options for stable cache keys", () => {
    expect.hasAssertions()

    const { result } = renderHook(() => useCurrencyFormatter({ currency: "USD", minimumFractionDigits: MIN_FRACTION_DIGITS }), {
      wrapper: createWrapper("en-US"),
    })

    const expected = new Intl.NumberFormat("en-US", {
      currency: "USD",
      minimumFractionDigits: MIN_FRACTION_DIGITS,
      style: "currency",
    }).format(USD_SAMPLE_AMOUNT)

    expect(result.current.format({ value: USD_SAMPLE_AMOUNT })).toBe(expected)
  })
})
