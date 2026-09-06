import type { JSX, ReactNode } from "react"
/** @vitest-environment jsdom */

import { act, render, screen, waitFor } from "@testing-library/react"
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

  it("unregisters service workers and clears caches once on mount", async () => {
    expect.hasAssertions()
    setNavigatorOnline(true)

    const unregister = vi.fn<() => Promise<boolean>>().mockResolvedValue(true)
    Object.defineProperty(globalThis.navigator, "serviceWorker", {
      configurable: true,
      value: { getRegistrations: vi.fn<() => Promise<{ unregister: () => Promise<boolean> }[]>>().mockResolvedValue([{ unregister }]) },
    })
    const deleteCache = vi.fn<() => Promise<boolean>>().mockResolvedValue(true)
    Object.defineProperty(globalThis, "caches", {
      configurable: true,
      value: { delete: deleteCache, keys: vi.fn<() => Promise<string[]>>().mockResolvedValue(["retired-offline-cache"]) },
    })

    renderBanner()

    await waitFor(() => {
      expect(unregister).toHaveBeenCalledWith()
    })
    expect(deleteCache).toHaveBeenCalledWith("retired-offline-cache")
  })

  it("stays quiet when recovery fails", async () => {
    expect.hasAssertions()
    setNavigatorOnline(true)

    const getRegistrations = vi.fn<() => Promise<never>>().mockRejectedValue(new Error("sw registry unavailable"))
    Object.defineProperty(globalThis.navigator, "serviceWorker", {
      configurable: true,
      value: { getRegistrations },
    })

    renderBanner()

    await waitFor(() => {
      expect(getRegistrations).toHaveBeenCalledWith()
    })
    expect(screen.queryByRole("status")).not.toBeInTheDocument()
  })
})
