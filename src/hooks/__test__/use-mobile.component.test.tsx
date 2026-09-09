import { act, renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vite-plus/test"

import { useIsMobile } from "~/src/hooks/use-mobile"

const MOBILE_BREAKPOINT = 768
const MOBILE_VIEWPORT_WIDTH = 500
const DESKTOP_VIEWPORT_WIDTH = 1024

const mobileChangeListener = { current: () => {} }

const createMatchMedia = (query: string) => ({
  addEventListener: (_type: string, listener: EventListenerOrEventListenerObject) => {
    if (typeof listener === "function") {
      mobileChangeListener.current = () => {
        listener(new Event("change"))
      }
    }
  },
  dispatchEvent: () => false,
  matches: globalThis.innerWidth < MOBILE_BREAKPOINT,
  media: query,
  removeEventListener: vi.fn<() => void>(),
})

describe("use is mobile component", () => {
  it("tracks viewport width changes", () => {
    expect.hasAssertions()

    vi.stubGlobal("matchMedia", vi.fn(createMatchMedia))

    Object.defineProperty(globalThis, "innerWidth", { configurable: true, value: MOBILE_VIEWPORT_WIDTH, writable: true })

    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(true)

    Object.defineProperty(globalThis, "innerWidth", { configurable: true, value: DESKTOP_VIEWPORT_WIDTH, writable: true })
    act(() => {
      mobileChangeListener.current()
    })

    expect(result.current).toBe(false)
  })
})
