/** @vitest-environment jsdom */

import { type ReactNode } from "react"

import { act, renderHook } from "@testing-library/react"
import { NextIntlClientProvider } from "next-intl"

import { PERMISSIONS } from "~/src/integrations/better-auth/auth.access"
import type * as AuthClient from "~/src/integrations/better-auth/auth.client"
import type * as I18nNavigation from "~/src/integrations/next-intl/i18n.navigation"
import { loadLocaleMessagesFromDir } from "~/src/integrations/next-intl/i18n.utils"

import { usePostAuthRedirect } from "~/src/hooks/use-post-auth-redirect"

import { ROUTES } from "~/src/routes"

type I18nRouter = ReturnType<typeof I18nNavigation.useRouter>

const enMessages = loadLocaleMessagesFromDir("en-US")

const pushMock = vi.hoisted(() => vi.fn<I18nRouter["push"]>())
const getSessionMock = vi.hoisted(() => vi.fn<typeof AuthClient.getSession>())

function createI18nRouterMock(): I18nRouter {
  return {
    back: vi.fn<I18nRouter["back"]>(),
    forward: vi.fn<I18nRouter["forward"]>(),
    prefetch: vi.fn<I18nRouter["prefetch"]>(),
    push: pushMock,
    refresh: vi.fn<I18nRouter["refresh"]>(),
    replace: vi.fn<I18nRouter["replace"]>(),
  }
}

vi.mock(import("~/src/integrations/better-auth/auth.client"), async (importOriginal): Promise<Partial<typeof AuthClient>> => {
  const actual = await importOriginal<typeof AuthClient>()

  return {
    ...actual,
    getSession: getSessionMock,
  }
})

vi.mock(import("~/src/integrations/next-intl/i18n.navigation"), async (): Promise<Partial<typeof I18nNavigation>> => {
  const { createI18nNavigationPartialMock } =
    await import("~/src/integrations/next-intl/__test__/mocks/i18n-navigation-for-component-tests")

  return createI18nNavigationPartialMock(createI18nRouterMock)
})

function renderPostAuthRedirectHook() {
  return renderHook(() => usePostAuthRedirect(), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <NextIntlClientProvider locale="en-US" messages={enMessages}>
        {children}
      </NextIntlClientProvider>
    ),
  })
}

describe("use post auth redirect component", () => {
  it("navigates to the app dashboard for customers", async () => {
    expect.hasAssertions()
    pushMock.mockClear()
    getSessionMock.mockClear()
    getSessionMock.mockResolvedValue({ data: { user: { role: PERMISSIONS.ROLES.CUSTOMER } } })

    const { result } = renderPostAuthRedirectHook()

    await act(async () => {
      await result.current()
    })

    expect(getSessionMock).toHaveBeenCalledWith()
    expect(pushMock).toHaveBeenCalledWith(ROUTES.APP)
  })

  it("navigates to the admin panel for admins", async () => {
    expect.hasAssertions()
    pushMock.mockClear()
    getSessionMock.mockClear()
    getSessionMock.mockResolvedValue({ data: { user: { role: PERMISSIONS.ROLES.ADMIN } } })

    const { result } = renderPostAuthRedirectHook()

    await act(async () => {
      await result.current()
    })

    expect(getSessionMock).toHaveBeenCalledWith()
    expect(pushMock).toHaveBeenCalledWith(ROUTES.ADMIN)
  })
})
