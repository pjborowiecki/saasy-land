/** @vitest-environment jsdom */

import { act, renderHook } from "@testing-library/react"
import { withNuqsTestingAdapter, type OnUrlUpdateFunction } from "nuqs/adapters/testing"

import { useQueryTab } from "~/src/hooks/use-query-tab"

const TAB_QUERY_KEY = "tab"
const TAB_VALUES = ["all", "active"] as const
const [DEFAULT_TAB, ACTIVE_TAB] = TAB_VALUES
const LAST_URL_UPDATE_INDEX = -1

describe("use query tab hook", () => {
  it("defaults to the configured tab value", () => {
    expect.hasAssertions()
    const { result } = renderHook(() => useQueryTab(TAB_QUERY_KEY, TAB_VALUES, DEFAULT_TAB), {
      wrapper: withNuqsTestingAdapter({ searchParams: "" }),
    })

    expect(result.current[0]).toBe(DEFAULT_TAB)
  })

  it("reads the tab from the query string", () => {
    expect.hasAssertions()
    const { result } = renderHook(() => useQueryTab(TAB_QUERY_KEY, TAB_VALUES, DEFAULT_TAB), {
      wrapper: withNuqsTestingAdapter({ searchParams: `?${TAB_QUERY_KEY}=${ACTIVE_TAB}` }),
    })

    expect(result.current[0]).toBe(ACTIVE_TAB)
  })

  it("updates the tab query param", async () => {
    expect.hasAssertions()
    const urlUpdates: string[] = []
    const onUrlUpdate: OnUrlUpdateFunction = ({ queryString }) => {
      urlUpdates.push(queryString)
    }
    const { result } = renderHook(() => useQueryTab(TAB_QUERY_KEY, TAB_VALUES, DEFAULT_TAB), {
      wrapper: withNuqsTestingAdapter({ hasMemory: true, onUrlUpdate, searchParams: "" }),
    })

    await act(async () => {
      await result.current[1](ACTIVE_TAB)
    })

    expect(urlUpdates.at(LAST_URL_UPDATE_INDEX)).toContain(`${TAB_QUERY_KEY}=${ACTIVE_TAB}`)
    expect(result.current[0]).toBe(ACTIVE_TAB)
  })
})
