/** @vitest-environment jsdom */

import { render, renderHook, screen, act, waitFor } from "@testing-library/react"
import type * as CanvasConfetti from "canvas-confetti"
import { FormProvider, useForm } from "react-hook-form"

import { useConfetti } from "~/src/hooks/use-confetti"
import { useIsMobile } from "~/src/hooks/use-mobile"
import { usePasswordRules } from "~/src/hooks/use-password-rules"

const CONFETTI_BURST_COUNT = 5
const MOBILE_BREAKPOINT = 768
const MOBILE_VIEWPORT_WIDTH = 500
const DESKTOP_VIEWPORT_WIDTH = 1024

const confettiMock = vi.hoisted(() => vi.fn<typeof CanvasConfetti.default>())

vi.mock(
  import("canvas-confetti"),
  (): Partial<typeof CanvasConfetti> => ({
    default: confettiMock,
  }),
)

function PasswordRulesProbe() {
  const rules = usePasswordRules()
  return (
    <div>
      <span data-testid="min">{String(rules.isMinLength)}</span>
      <span data-testid="upper">{String(rules.hasUppercase)}</span>
      <span data-testid="special">{String(rules.hasSpecialChar)}</span>
    </div>
  )
}

function PasswordRulesWrapper({ password }: Readonly<{ password?: string }>) {
  const form = useForm({ values: password === undefined ? {} : { password } })

  return (
    <FormProvider {...form}>
      <PasswordRulesProbe />
    </FormProvider>
  )
}

const mobileChangeListener = { current: () => {} }

function createMatchMedia(query: string) {
  return {
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
  }
}

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
