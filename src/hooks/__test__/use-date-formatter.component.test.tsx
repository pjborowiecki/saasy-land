import { type ReactNode } from "react"
/** @vitest-environment jsdom */

import { renderHook } from "@testing-library/react"
import { IntlProvider } from "use-intl/react"
import { describe, expect, it } from "vite-plus/test"

import { getTestMessages } from "~/src/integrations/use-intl/__test__/fixtures/messages"

import { useDateFormatter } from "~/src/hooks/use-date-formatter"

const SAMPLE_YEAR = 2024
const SAMPLE_MONTH = 5
const SAMPLE_DAY = 15
const SAMPLE_HOUR = 12
const SAMPLE_MINUTE = 0
const SAMPLE_SECOND = 0
const SAMPLE_UTC = new Date(Date.UTC(SAMPLE_YEAR, SAMPLE_MONTH, SAMPLE_DAY, SAMPLE_HOUR, SAMPLE_MINUTE, SAMPLE_SECOND))

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

describe("use date formatter component", () => {
  it("formats with route locale and call options", () => {
    expect.hasAssertions()

    const { result } = renderHook(() => useDateFormatter(), {
      wrapper: createWrapper("en-US"),
    })

    const expected = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(SAMPLE_UTC)

    expect(result.current.formatDate({ dateStyle: "medium", value: SAMPLE_UTC })).toBe(expected)
  })

  it("formats ISO strings and timestamps", () => {
    expect.hasAssertions()

    const { result } = renderHook(() => useDateFormatter({ dateStyle: "short" }), {
      wrapper: createWrapper("en-US"),
    })

    const expected = new Intl.DateTimeFormat("en-US", { dateStyle: "short" }).format(SAMPLE_UTC)

    expect(result.current.formatDate({ value: SAMPLE_UTC.toISOString() })).toBe(expected)
    expect(result.current.formatDate({ value: SAMPLE_UTC.getTime() })).toBe(expected)
  })

  it("prefers hook default locale over route locale", () => {
    expect.hasAssertions()

    const { result } = renderHook(() => useDateFormatter({ dateStyle: "medium", locale: "de-DE" }), { wrapper: createWrapper("en-US") })

    const expected = new Intl.DateTimeFormat("de-DE", { dateStyle: "medium" }).format(SAMPLE_UTC)

    expect(result.current.formatDate({ value: SAMPLE_UTC })).toBe(expected)
  })

  it("prefers per-call locale over hook and route locale", () => {
    expect.hasAssertions()

    const { result } = renderHook(() => useDateFormatter({ dateStyle: "medium", locale: "de-DE" }), { wrapper: createWrapper("en-US") })

    const expected = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(SAMPLE_UTC)

    expect(result.current.formatDate({ locale: "fr-FR", value: SAMPLE_UTC })).toBe(expected)
  })

  it("formatDateToParts returns Intl parts for the resolved locale", () => {
    expect.hasAssertions()

    const { result } = renderHook(() => useDateFormatter({ dateStyle: "medium" }), {
      wrapper: createWrapper("en-US"),
    })

    const parts = result.current.formatDateToParts({ value: SAMPLE_UTC })

    expect(parts.some((part) => part.type === "day")).toBe(true)
    expect(parts.some((part) => part.type === "month")).toBe(true)
    expect(parts.some((part) => part.type === "year")).toBe(true)
  })

  it("uses route locale when defaults do not set locale", () => {
    expect.hasAssertions()

    const { result } = renderHook(() => useDateFormatter({ dateStyle: "medium" }), {
      wrapper: createWrapper("pl-PL"),
    })

    const expected = new Intl.DateTimeFormat("pl-PL", { dateStyle: "medium" }).format(SAMPLE_UTC)

    expect(result.current.formatDate({ value: SAMPLE_UTC })).toBe(expected)
  })

  it("formats with multiple default Intl options for stable cache keys", () => {
    expect.hasAssertions()

    const { result } = renderHook(() => useDateFormatter({ dateStyle: "medium", timeStyle: "short" }), {
      wrapper: createWrapper("en-US"),
    })

    const expected = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(SAMPLE_UTC)

    expect(result.current.formatDate({ value: SAMPLE_UTC })).toBe(expected)
  })

  it("uses updated defaults after rerender while preserving per-call overrides", () => {
    expect.hasAssertions()

    const { result, rerender } = renderHook((defaults) => useDateFormatter(defaults), {
      initialProps: { dateStyle: "medium" as const, locale: "en-US", timeZone: "UTC" },
      wrapper: createWrapper(),
    })

    expect(result.current.formatDate({ value: SAMPLE_UTC })).toBe("Jun 15, 2024")

    rerender({ dateStyle: "medium", locale: "de-DE", timeZone: "Pacific/Kiritimati" })

    const expected = new Intl.DateTimeFormat("de-DE", { dateStyle: "medium", timeZone: "Pacific/Kiritimati" })
    const override = new Intl.DateTimeFormat("pl-PL", { dateStyle: "long", timeZone: "UTC" })

    expect(result.current.formatDate({ value: SAMPLE_UTC })).toBe(expected.format(SAMPLE_UTC))
    expect(result.current.formatDateToParts({ value: SAMPLE_UTC })).toEqual(expected.formatToParts(SAMPLE_UTC))
    expect(result.current.formatDate({ dateStyle: "long", locale: "pl-PL", timeZone: "UTC", value: SAMPLE_UTC })).toBe(
      override.format(SAMPLE_UTC),
    )
  })

  it("uses the new route locale after the provider changes", () => {
    expect.hasAssertions()

    let locale: "en-US" | "pl-PL" = "en-US"
    const { result, rerender } = renderHook(() => useDateFormatter({ dateStyle: "medium", timeZone: "UTC" }), {
      wrapper: ({ children }) => <IntlProvider locale={locale}>{children}</IntlProvider>,
    })

    expect(result.current.formatDate({ value: SAMPLE_UTC })).toBe("Jun 15, 2024")

    locale = "pl-PL"
    rerender()

    const expected = new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeZone: "UTC" })

    expect(result.current.formatDate({ value: SAMPLE_UTC })).toBe(expected.format(SAMPLE_UTC))
    expect(result.current.formatDateToParts({ value: SAMPLE_UTC })).toEqual(expected.formatToParts(SAMPLE_UTC))
  })
})
