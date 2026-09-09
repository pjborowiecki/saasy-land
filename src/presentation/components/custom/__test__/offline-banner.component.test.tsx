import type { JSX, ReactNode } from "react"
/** @vitest-environment jsdom */

import { act, render, screen } from "@testing-library/react"
import { IntlProvider } from "use-intl/react"
import { describe, expect, it, vi } from "vite-plus/test"

import { getTestMessages } from "~/src/integrations/use-intl/__test__/fixtures/messages"

import { OfflineBanner } from "~/src/presentation/components/custom/offline-banner"

const setNavigatorOnline = (value: boolean): void => {
  Object.defineProperty(globalThis.navigator, "onLine", { configurable: true, value })
}

const renderBanner = (): void => {
  const messages = getTestMessages("en-US")

  const Wrapper = ({ children }: { children: ReactNode }): JSX.Element => (
    <IntlProvider locale="en-US" messages={messages}>
      {children}
    </IntlProvider>
  )

  render(<OfflineBanner />, { wrapper: Wrapper })
}

describe("offline banner component", () => {
  it("renders nothing while the connection is up", () => {
    expect.hasAssertions()
    setNavigatorOnline(true)

    renderBanner()

    expect(screen.queryByRole("status")).not.toBeInTheDocument()
  })

  it("explains the wait once the connection drops", () => {
    expect.hasAssertions()
    setNavigatorOnline(false)

    renderBanner()

    expect(screen.getByRole("status")).toHaveTextContent(/offline/iu)
  })

  it("follows the browser's offline and online events after mount", () => {
    expect.hasAssertions()
    setNavigatorOnline(true)

    renderBanner()
    expect(screen.queryByRole("status")).not.toBeInTheDocument()

    act(() => {
      globalThis.dispatchEvent(new Event("offline"))
    })
    expect(screen.getByRole("status")).toHaveTextContent(/offline/iu)

    act(() => {
      globalThis.dispatchEvent(new Event("online"))
    })
    expect(screen.queryByRole("status")).not.toBeInTheDocument()
  })

  it("leaves browser caches and service workers alone", () => {
    expect.hasAssertions()
    const getRegistrations = vi.fn()
    const cacheKeys = vi.fn()
    vi.stubGlobal("navigator", { onLine: true, serviceWorker: { getRegistrations } })
    vi.stubGlobal("caches", { keys: cacheKeys })

    try {
      renderBanner()

      expect(getRegistrations).not.toHaveBeenCalled()
      expect(cacheKeys).not.toHaveBeenCalled()
      expect(screen.queryByRole("status")).not.toBeInTheDocument()
    } finally {
      vi.unstubAllGlobals()
    }
  })
})
