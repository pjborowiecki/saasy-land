/** @vitest-environment jsdom */

import type { JSX, ReactNode } from "react"

import { render, screen } from "@testing-library/react"
import { NextIntlClientProvider } from "next-intl"

import { loadLocaleMessagesFromDir } from "~/src/integrations/next-intl/i18n.utils"

import { OfflineBanner } from "~/src/presentation/components/custom/offline-banner"

function setNavigatorOnline(value: boolean): void {
  Object.defineProperty(globalThis.navigator, "onLine", { configurable: true, value })
}

function renderBanner(): void {
  const messages = loadLocaleMessagesFromDir("en-US")

  function Wrapper({ children }: { children: ReactNode }): JSX.Element {
    return (
      <NextIntlClientProvider locale="en-US" messages={messages}>
        {children}
      </NextIntlClientProvider>
    )
  }

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
})
