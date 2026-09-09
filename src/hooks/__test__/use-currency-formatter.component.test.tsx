import { type ReactNode } from "react"
/** @vitest-environment jsdom */

import { renderHook } from "@testing-library/react"
import { IntlProvider } from "use-intl/react"
import { describe, expect, it } from "vite-plus/test"

import { getTestMessages } from "~/src/integrations/use-intl/__test__/fixtures/messages"

import { useCurrencyFormatter } from "~/src/hooks/use-currency-formatter"

const USD_SAMPLE_AMOUNT = 1234.5
const MINIMAL_AMOUNT = 1
const EUR_SAMPLE_AMOUNT = 42
const LOCALE_COMPARE_AMOUNT = 50
const PARTS_SAMPLE_AMOUNT = 10
const PLN_SAMPLE_AMOUNT = 99
const MIN_FRACTION_DIGITS = 2

const createWrapper = (locale: "en-US" | "pl-PL" = "en-US") => {
  const messages = getTestMessages(locale)

  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <IntlProvider locale={locale} messages={messages}>
        {children}
      </IntlProvider>
    )
  }
}

describe("use currency formatter component", () => {
  it("formats with default currency and route locale", () => {
    expect.hasAssertions()

    const { result } = renderHook(() => useCurrencyFormatter({ currency: "USD" }), {
      wrapper: createWrapper("en-US"),
    })

    const expected = new Intl.NumberFormat("en-US", { currency: "USD", style: "currency" }).format(USD_SAMPLE_AMOUNT)

    expect(result.current.formatCurrency({ value: USD_SAMPLE_AMOUNT })).toBe(expected)
  })

  it("throws when resolved currency is empty", () => {
    expect.hasAssertions()

    const { result } = renderHook(() => useCurrencyFormatter({ currency: "" }), {
      wrapper: createWrapper("en-US"),
    })

    expect(() => result.current.formatCurrency({ value: MINIMAL_AMOUNT })).toThrow("formatCurrency requires a currency code")
  })

  it("accepts currency on each call when defaults omit it", () => {
    expect.hasAssertions()

    const { result } = renderHook(() => useCurrencyFormatter(), {
      wrapper: createWrapper("en-US"),
    })

    const expected = new Intl.NumberFormat("en-US", { currency: "EUR", style: "currency" }).format(EUR_SAMPLE_AMOUNT)

    expect(result.current.formatCurrency({ currency: "EUR", value: EUR_SAMPLE_AMOUNT })).toBe(expected)
  })

  it("prefers hook default locale over route locale", () => {
    expect.hasAssertions()

    const { result } = renderHook(() => useCurrencyFormatter({ currency: "EUR", locale: "de-DE" }), { wrapper: createWrapper("en-US") })

    const expected = new Intl.NumberFormat("de-DE", { currency: "EUR", style: "currency" }).format(LOCALE_COMPARE_AMOUNT)

    expect(result.current.formatCurrency({ value: LOCALE_COMPARE_AMOUNT })).toBe(expected)
  })

  it("prefers per-call locale over hook and route locale", () => {
    expect.hasAssertions()

    const { result } = renderHook(() => useCurrencyFormatter({ currency: "EUR", locale: "de-DE" }), { wrapper: createWrapper("en-US") })

    const expected = new Intl.NumberFormat("fr-FR", { currency: "EUR", style: "currency" }).format(LOCALE_COMPARE_AMOUNT)

    expect(result.current.formatCurrency({ locale: "fr-FR", value: LOCALE_COMPARE_AMOUNT })).toBe(expected)
  })

  it("formatCurrencyToParts returns Intl parts for the resolved locale", () => {
    expect.hasAssertions()

    const { result } = renderHook(() => useCurrencyFormatter({ currency: "USD" }), {
      wrapper: createWrapper("en-US"),
    })

    const parts = result.current.formatCurrencyToParts({ value: PARTS_SAMPLE_AMOUNT })

    expect(parts.some((part) => part.type === "currency")).toBe(true)
    expect(parts.some((part) => part.type === "integer")).toBe(true)
  })

  it("uses route locale when defaults do not set locale", () => {
    expect.hasAssertions()

    const { result } = renderHook(() => useCurrencyFormatter({ currency: "PLN" }), {
      wrapper: createWrapper("pl-PL"),
    })

    const expected = new Intl.NumberFormat("pl-PL", { currency: "PLN", style: "currency" }).format(PLN_SAMPLE_AMOUNT)

    expect(result.current.formatCurrency({ value: PLN_SAMPLE_AMOUNT })).toBe(expected)
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

    expect(result.current.formatCurrency({ value: USD_SAMPLE_AMOUNT })).toBe(expected)
  })

  it("uses updated defaults after rerender while preserving per-call overrides", () => {
    expect.hasAssertions()

    const { result, rerender } = renderHook((defaults) => useCurrencyFormatter(defaults), {
      initialProps: { currency: "USD", currencyDisplay: "symbol" as const, locale: "en-US" },
      wrapper: createWrapper(),
    })

    expect(result.current.formatCurrency({ value: USD_SAMPLE_AMOUNT })).toBe("$1,234.50")

    rerender({ currency: "EUR", currencyDisplay: "symbol", locale: "de-DE" })

    const expected = new Intl.NumberFormat("de-DE", { currency: "EUR", style: "currency" })
    const override = new Intl.NumberFormat("pl-PL", { currency: "PLN", currencyDisplay: "code", style: "currency" })

    expect(result.current.formatCurrency({ value: USD_SAMPLE_AMOUNT })).toBe(expected.format(USD_SAMPLE_AMOUNT))
    expect(result.current.formatCurrencyToParts({ value: USD_SAMPLE_AMOUNT })).toEqual(expected.formatToParts(USD_SAMPLE_AMOUNT))
    expect(result.current.formatCurrency({ currency: "PLN", currencyDisplay: "code", locale: "pl-PL", value: USD_SAMPLE_AMOUNT })).toBe(
      override.format(USD_SAMPLE_AMOUNT),
    )
  })

  it("uses the new route locale after the provider changes", () => {
    expect.hasAssertions()

    let locale: "en-US" | "pl-PL" = "en-US"
    const { result, rerender } = renderHook(() => useCurrencyFormatter({ currency: "USD" }), {
      wrapper: ({ children }) => <IntlProvider locale={locale}>{children}</IntlProvider>,
    })

    expect(result.current.formatCurrency({ value: USD_SAMPLE_AMOUNT })).toBe("$1,234.50")

    locale = "pl-PL"
    rerender()

    const expected = new Intl.NumberFormat(locale, { currency: "USD", style: "currency" })

    expect(result.current.formatCurrency({ value: USD_SAMPLE_AMOUNT })).toBe(expected.format(USD_SAMPLE_AMOUNT))
    expect(result.current.formatCurrencyToParts({ value: USD_SAMPLE_AMOUNT })).toEqual(expected.formatToParts(USD_SAMPLE_AMOUNT))
  })
})
