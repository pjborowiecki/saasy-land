/** @vitest-environment jsdom */

import { type ReactNode } from "react"

import { renderHook } from "@testing-library/react"
import { NextIntlClientProvider } from "next-intl"

import { loadLocaleMessagesFromDir } from "~/src/integrations/next-intl/i18n.utils"

import { useDateFormatter } from "~/src/hooks/use-date-formatter"

const SAMPLE_YEAR = 2024
const SAMPLE_MONTH = 5
const SAMPLE_DAY = 15
const SAMPLE_HOUR = 12
const SAMPLE_MINUTE = 0
const SAMPLE_SECOND = 0
const SAMPLE_UTC = new Date(Date.UTC(SAMPLE_YEAR, SAMPLE_MONTH, SAMPLE_DAY, SAMPLE_HOUR, SAMPLE_MINUTE, SAMPLE_SECOND))

function createWrapper(locale: "en-US" | "pl-PL" = "en-US") {
  const messages = loadLocaleMessagesFromDir(locale)

  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
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
})
