import { act, render, renderHook, screen, waitFor } from "@testing-library/react"
/** @vitest-environment jsdom */
import type * as CanvasConfetti from "canvas-confetti"
import { describe, expect, it, vi } from "vite-plus/test"

import { useConfetti } from "~/src/hooks/use-confetti"
import { useIsMobile } from "~/src/hooks/use-mobile"
import { usePasswordRules } from "~/src/hooks/use-password-rules"

const CONFETTI_BURST_COUNT = 5
const MOBILE_BREAKPOINT = 768
const MOBILE_VIEWPORT_WIDTH = 500
const DESKTOP_VIEWPORT_WIDTH = 1024

const confettiMock = vi.hoisted(() => vi.fn<typeof CanvasConfetti.default>())

vi.mock(import("canvas-confetti"), (): Partial<typeof CanvasConfetti> => ({
  default: confettiMock,
}))

const PasswordRulesProbe = ({ password }: { password?: string }) => {
  const rules = usePasswordRules(password)
  return (
    <div>
      <span data-testid="min">{String(rules.isMinLength)}</span>
      <span data-testid="upper">{String(rules.hasUppercase)}</span>
      <span data-testid="special">{String(rules.hasSpecialChar)}</span>
    </div>
  )
}

const PasswordRulesWrapper = ({ password }: { password?: string }) => (
  <PasswordRulesProbe {...(password === undefined ? {} : { password })} />
)

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

describe("use confetti component", () => {
  it("fires five confetti bursts", () => {
    expect.hasAssertions()
    const { result } = renderHook(() => useConfetti())

    act(() => {
      result.current.triggerConfetti()
    })

    expect(confettiMock).toHaveBeenCalledTimes(CONFETTI_BURST_COUNT)
  })
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

describe("use password rules component", () => {
  it("returns false rules when password is missing", () => {
    expect.hasAssertions()
    render(<PasswordRulesWrapper />)
    expect(screen.getByTestId("min").textContent).toBe("false")
    expect(screen.getByTestId("upper").textContent).toBe("false")
    expect(screen.getByTestId("special").textContent).toBe("false")
  })

  it("returns false rules for empty password", () => {
    expect.hasAssertions()
    render(<PasswordRulesWrapper password="" />)
    expect(screen.getByTestId("min").textContent).toBe("false")
    expect(screen.getByTestId("upper").textContent).toBe("false")
    expect(screen.getByTestId("special").textContent).toBe("false")
  })

  it("returns true rules for strong password", async () => {
    expect.hasAssertions()
    render(<PasswordRulesWrapper password="Secret1!" />)

    await waitFor(() => {
      expect(screen.getByTestId("min").textContent).toBe("true")
      expect(screen.getByTestId("upper").textContent).toBe("true")
      expect(screen.getByTestId("special").textContent).toBe("true")
    })
  })
})
