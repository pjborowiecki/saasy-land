/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { NextIntlClientProvider } from "next-intl"
import { Link } from "react-aria-components"

import { AppRouterProvider } from "~/src/providers/app-router-provider"

import type * as I18nNavigation from "~/src/integrations/next-intl/i18n.navigation"

type I18nRouter = ReturnType<typeof I18nNavigation.useRouter>

const EMPTY_MESSAGES = {}

const pushMock = vi.hoisted(() => vi.fn<I18nRouter["push"]>())

const getPathnameMock = vi.hoisted(() =>
  vi.fn<(args: { href: string; locale: string }) => string>(({ href, locale }) => `/${locale}${href}`),
)

// @ts-expect-error Vitest module mock factory is not inferred for the navigation exports.
vi.mock(import("~/src/integrations/next-intl/i18n.navigation"), () => ({
  getPathname: getPathnameMock,
  useRouter: () => ({ push: pushMock }),
}))

function renderWithProvider() {
  return render(
    <NextIntlClientProvider locale="pl-PL" messages={EMPTY_MESSAGES}>
      <AppRouterProvider>
        <Link href="/admin">Console</Link>
      </AppRouterProvider>
    </NextIntlClientProvider>,
  )
}

describe("app router provider", () => {
  it("renders react-aria links with locale-prefixed hrefs", () => {
    expect.hasAssertions()
    pushMock.mockReset()
    renderWithProvider()

    expect(screen.getByRole("link", { name: "Console" })).toHaveAttribute("href", "/pl-PL/admin")
    expect(getPathnameMock).toHaveBeenCalledWith({ href: "/admin", locale: "pl-PL" })
  })

  it("soft-navigates through the app router on click", async () => {
    expect.hasAssertions()
    pushMock.mockReset()
    const user = userEvent.setup()
    renderWithProvider()

    await user.click(screen.getByRole("link", { name: "Console" }))

    expect(pushMock).toHaveBeenCalledWith("/admin")
  })
})
