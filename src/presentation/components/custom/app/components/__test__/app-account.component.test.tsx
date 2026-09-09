import { QueryClient } from "@tanstack/react-query"
import { act, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { toast } from "sonner"
import { IntlProvider } from "use-intl/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test"

import { createTestRouter, renderWithRouter } from "~/src/platform/testing/lib/render"

import { createAuthSessionFixture } from "~/src/integrations/better-auth/__test__/fixtures/auth.session.fixture"
import { getCurrentSessionQuery } from "~/src/integrations/better-auth/auth.session"
import { getTestMessages } from "~/src/integrations/use-intl/__test__/fixtures/messages"
import type { SupportedLocale } from "~/src/integrations/use-intl/i18n.config"

import { ACCOUNT_MUTATION_KEYS } from "~/src/modules/account/account.constants"
import type { settingsSignOutUserMutation } from "~/src/modules/account/use-cases/sign-out-user"
import type { License } from "~/src/modules/license/license.types"
import { currentLicenseQuery } from "~/src/modules/license/use-cases/get-current-license"

import { AppAccount } from "~/src/presentation/components/custom/app/components/app-account"

import { ROUTES } from "~/src/routes"

type SignOutResult = Awaited<ReturnType<NonNullable<typeof settingsSignOutUserMutation.mutationFn>>>

const signOutMock = vi.hoisted(() => vi.fn<NonNullable<typeof settingsSignOutUserMutation.mutationFn>>())
const SIGN_OUT_SUCCESS = { redirect: undefined, success: true, url: undefined } satisfies SignOutResult
const session = createAuthSessionFixture()
const license = {
  createdAt: new Date("2026-09-01T00:00:00Z"),
  id: "fixture-license",
  key: "private-fixture-key",
  polarCustomerId: "fixture-customer",
  polarLicenseKeyId: "fixture-polar-license",
  polarOrderId: null,
  status: "active",
  tier: "core",
  updatedAt: new Date("2026-09-01T00:00:00Z"),
  userId: session.user.id,
} satisfies License["select"]

vi.mock(import("~/src/modules/account/use-cases/sign-out-user"), () => ({
  settingsSignOutUserMutation: { mutationFn: signOutMock, mutationKey: ACCOUNT_MUTATION_KEYS.SIGN_OUT },
}))

const renderAccount = (locale: SupportedLocale = "en-US") => {
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false }, queries: { retry: false } } })
  queryClient.setQueryData(getCurrentSessionQuery.queryKey, session)
  queryClient.setQueryData(currentLicenseQuery.queryKey, license)
  const router = createTestRouter(ROUTES.APP)
  const navigate = vi.spyOn(router, "navigate").mockResolvedValue()
  const messages = getTestMessages(locale)
  renderWithRouter(
    <IntlProvider locale={locale} messages={messages}>
      <AppAccount email={session.user.email} name={session.user.name} />
    </IntlProvider>,
    { queryClient, router },
  )
  return { messages, navigate, queryClient, user: userEvent.setup() }
}

beforeEach(() => {
  signOutMock.mockReset()
  signOutMock.mockResolvedValue(SIGN_OUT_SUCCESS)
  vi.spyOn(toast, "success").mockReturnValue(0)
  vi.spyOn(toast, "error").mockReturnValue(0)
})
afterEach(() => {
  vi.restoreAllMocks()
})

describe("app account", () => {
  it("shows the signed-in customer's name and email in the account region", () => {
    const { messages } = renderAccount()

    expect(screen.getByRole("region", { name: messages.pages.app.account.label })).toBeVisible()
    expect(screen.getByText(session.user.name)).toBeVisible()
    expect(screen.getByText(session.user.email)).toBeVisible()
    expect(screen.getByRole("button", { name: messages.pages.app.account.signOut })).toBeEnabled()
    expect(signOutMock).not.toHaveBeenCalled()
  })

  it("clears cached session and license data and opens sign in after successful sign-out", async () => {
    const { messages, navigate, queryClient, user } = renderAccount()

    await user.click(screen.getByRole("button", { name: messages.pages.app.account.signOut }))

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith({ replace: true, to: ROUTES.SIGN_IN })
    })
    expect(signOutMock).toHaveBeenCalledOnce()
    expect(queryClient.getQueryData(getCurrentSessionQuery.queryKey)).toBeUndefined()
    expect(queryClient.getQueryData(currentLicenseQuery.queryKey)).toBeUndefined()
    expect(toast.success).toHaveBeenCalledWith(messages.pages.app.account.signedOut)
    expect(toast.error).not.toHaveBeenCalled()
  })

  it("keeps the cached account and license when sign-out fails and shows the localized error", async () => {
    signOutMock.mockRejectedValue(new Error("Connection failed"))
    const { messages, navigate, queryClient, user } = renderAccount("pl-PL")

    await user.click(screen.getByRole("button", { name: messages.pages.app.account.signOut }))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(messages.errors.action.INTERNAL_ERROR)
    })
    expect(queryClient.getQueryData(getCurrentSessionQuery.queryKey)).toStrictEqual(session)
    expect(queryClient.getQueryData(currentLicenseQuery.queryKey)).toStrictEqual(license)
    expect(screen.getByText(session.user.name)).toBeVisible()
    expect(screen.getByText(session.user.email)).toBeVisible()
    expect(screen.getByRole("button", { name: messages.pages.app.account.signOut })).toBeEnabled()
    expect(navigate).not.toHaveBeenCalled()
    expect(toast.success).not.toHaveBeenCalled()
  })

  it("disables sign-out while pending and preserves the cache until the server confirms", async () => {
    const pending = Promise.withResolvers<SignOutResult>()
    signOutMock.mockReturnValue(pending.promise)
    const { messages, navigate, queryClient, user } = renderAccount()

    await user.click(screen.getByRole("button", { name: messages.pages.app.account.signOut }))
    const pendingButton = await screen.findByRole("button", { name: messages.pages.app.account.signingOut })
    expect(pendingButton).toBeDisabled()
    await user.click(pendingButton)
    expect(signOutMock).toHaveBeenCalledOnce()
    expect(queryClient.getQueryData(getCurrentSessionQuery.queryKey)).toStrictEqual(session)
    expect(queryClient.getQueryData(currentLicenseQuery.queryKey)).toStrictEqual(license)
    expect(navigate).not.toHaveBeenCalled()

    await act(async () => {
      pending.resolve(SIGN_OUT_SUCCESS)
      await pending.promise
    })

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith({ replace: true, to: ROUTES.SIGN_IN })
    })
    expect(queryClient.getQueryData(getCurrentSessionQuery.queryKey)).toBeUndefined()
    expect(queryClient.getQueryData(currentLicenseQuery.queryKey)).toBeUndefined()
  })
})
