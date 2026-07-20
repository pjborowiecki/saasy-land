/** @vitest-environment jsdom */

import { type JSX, type ReactNode } from "react"

import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { NextIntlClientProvider } from "next-intl"
import type * as Sonner from "sonner"

import { CONSTANTS } from "~/src/constants"

import type * as AuthClient from "~/src/integrations/better-auth/auth._client"
import type * as I18nNavigation from "~/src/integrations/next-intl/i18n.navigation"
import { loadLocaleMessagesFromDir } from "~/src/integrations/next-intl/i18n.utils"

import { Button } from "~/src/components/shadcn/button"
import { DropdownMenu, DropdownMenuTrigger } from "~/src/components/shadcn/dropdown-menu"

import { SignOutButton } from "~/src/app/[locale]/(admin)/admin/_components/sign-out-button"
import { OAuthButton } from "~/src/app/[locale]/(auth)/auth/_components/oauth-button"
import { ForgotPasswordForm } from "~/src/app/[locale]/(auth)/auth/forgot-password/_components/forgot-password-form"
import { ResetPasswordForm } from "~/src/app/[locale]/(auth)/auth/reset-password/_components/reset-password-form"
import { SignInWithPasswordForm } from "~/src/app/[locale]/(auth)/auth/sign-in/_components/sign-in-with-password-form"
import { SignUpWithPasswordForm } from "~/src/app/[locale]/(auth)/auth/sign-up/_components/sign-up-with-password-form"

type I18nRouter = ReturnType<typeof I18nNavigation.useRouter>

const TEST_EMAIL = "user@example.com"
const TEST_PASSWORD = "Secret1!"
const TEST_NAME = "Test User"
const RESET_TOKEN = "reset-token-123"

const enMessages = loadLocaleMessagesFromDir("en-US")

const pushMock = vi.hoisted(() => vi.fn<I18nRouter["push"]>())
const signInEmailMock = vi.hoisted(() => vi.fn<typeof AuthClient.signIn.email>())
const signUpEmailMock = vi.hoisted(() => vi.fn<typeof AuthClient.signUp.email>())
const getSessionMock = vi.hoisted(() => vi.fn<typeof AuthClient.getSession>())
const requestPasswordResetMock = vi.hoisted(() => vi.fn<typeof AuthClient.requestPasswordReset>())
const resetPasswordMock = vi.hoisted(() => vi.fn<typeof AuthClient.resetPassword>())
const signOutMock = vi.hoisted(() => vi.fn<typeof AuthClient.authClient.signOut>())
const signInSocialMock = vi.hoisted(() => vi.fn<typeof AuthClient.authClient.signIn.social>())
const toastSuccessMock = vi.hoisted(() => vi.fn<(message: string) => void>())
const toastErrorMock = vi.hoisted(() => vi.fn<(message: string) => void>())
const triggerConfettiMock = vi.hoisted(() => vi.fn<() => void>())

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

function renderWithAuthMessages(ui: ReactNode): ReturnType<typeof render> {
  return render(
    <NextIntlClientProvider locale="en-US" messages={enMessages}>
      {ui}
    </NextIntlClientProvider>,
  )
}

function getPasswordInput(id: string): HTMLInputElement {
  const input = document.querySelector<HTMLInputElement>(`#${id}`)
  if (!input) {
    throw new Error(`Missing input: #${id}`)
  }

  return input
}

function setupSignInWithPasswordFormMocks(): void {
  pushMock.mockClear()
  signInEmailMock.mockClear()
  getSessionMock.mockClear()
  toastSuccessMock.mockClear()
  toastErrorMock.mockClear()

  signInEmailMock.mockImplementation(async ({ fetchOptions }) => {
    await fetchOptions?.onSuccess?.({} as never)
  })
  getSessionMock.mockResolvedValue({ data: { user: { role: CONSTANTS.PERMISSIONS.ROLES.CUSTOMER } } })
}

function setupSignUpWithPasswordFormMocks(): void {
  pushMock.mockClear()
  signUpEmailMock.mockClear()
  getSessionMock.mockClear()
  triggerConfettiMock.mockClear()
  toastSuccessMock.mockClear()

  signUpEmailMock.mockImplementation(async ({ fetchOptions }) => {
    await fetchOptions?.onSuccess?.({} as never)
  })
  getSessionMock.mockResolvedValue({ data: { user: { role: CONSTANTS.PERMISSIONS.ROLES.CUSTOMER } } })
}

function setupForgotPasswordFormMocks(): void {
  requestPasswordResetMock.mockClear()
  toastSuccessMock.mockClear()
  toastErrorMock.mockClear()

  requestPasswordResetMock.mockImplementation(async ({ fetchOptions }) => {
    await fetchOptions?.onSuccess?.({} as never)
  })
}

function setupResetPasswordFormMocks(): void {
  pushMock.mockClear()
  resetPasswordMock.mockClear()
  toastSuccessMock.mockClear()

  resetPasswordMock.mockImplementation(async ({ fetchOptions }) => {
    await fetchOptions?.onSuccess?.({} as never)
  })
}

function setupOAuthButtonMocks(): void {
  signInSocialMock.mockClear()
  toastSuccessMock.mockClear()

  signInSocialMock.mockImplementation(async ({ fetchOptions }) => {
    await fetchOptions?.onSuccess?.({} as never)
  })
}

function setupSignOutButtonMocks(): void {
  pushMock.mockClear()
  signOutMock.mockClear()
  toastSuccessMock.mockClear()

  signOutMock.mockImplementation(async (options) => {
    await options?.fetchOptions?.onSuccess?.({} as never)
  })
}

function GitHubIconMock(): JSX.Element {
  return <span aria-hidden="true" />
}

vi.mock(import("~/src/hooks/use-confetti"), () => ({
  useConfetti: () => ({ triggerConfetti: triggerConfettiMock }),
}))

vi.mock(
  import("sonner"),
  (): Partial<typeof Sonner> => ({
    toast: {
      error: toastErrorMock,
      success: toastSuccessMock,
    } as unknown as typeof Sonner.toast,
  }),
)

vi.mock(import("~/src/integrations/next-intl/i18n.navigation"), async (): Promise<Partial<typeof I18nNavigation>> => {
  const { createI18nNavigationPartialMock } = await import("~/tests/mocks/i18n-navigation-for-component-tests")

  return createI18nNavigationPartialMock(createI18nRouterMock)
})

vi.mock(
  import("~/src/integrations/better-auth/auth._client"),
  (): Partial<typeof AuthClient> => ({
    authClient: {
      signIn: { social: signInSocialMock },
      signOut: signOutMock,
    } as unknown as typeof AuthClient.authClient,
    getSession: getSessionMock,
    requestPasswordReset: requestPasswordResetMock,
    resetPassword: resetPasswordMock,
    signIn: { email: signInEmailMock } as unknown as typeof AuthClient.signIn,
    signUp: { email: signUpEmailMock },
  }),
)

describe("sign in with password form component", () => {
  it("blocks submit when email is invalid", async () => {
    expect.hasAssertions()
    setupSignInWithPasswordFormMocks()
    const user = userEvent.setup()
    renderWithAuthMessages(<SignInWithPasswordForm />)

    await user.type(screen.getByLabelText(/email/iu), "not-an-email")
    await user.type(getPasswordInput("sign-in-password"), TEST_PASSWORD)
    await user.click(screen.getByTestId("sign-in-form-submit-button"))

    expect(signInEmailMock).not.toHaveBeenCalled()
  })

  it("signs in and redirects to the app area", async () => {
    expect.hasAssertions()
    setupSignInWithPasswordFormMocks()
    const user = userEvent.setup()
    renderWithAuthMessages(<SignInWithPasswordForm />)

    await user.type(screen.getByLabelText(/email/iu), TEST_EMAIL)
    await user.type(getPasswordInput("sign-in-password"), TEST_PASSWORD)
    await user.click(screen.getByTestId("sign-in-form-submit-button"))

    await waitFor(() => {
      expect(signInEmailMock).toHaveBeenCalledWith(
        expect.objectContaining({
          email: TEST_EMAIL,
          password: TEST_PASSWORD,
        }),
      )
    })
    expect(pushMock).toHaveBeenCalledWith(expect.stringContaining(CONSTANTS.ROUTES.APP))
    expect(toastSuccessMock).toHaveBeenCalledWith(enMessages.pages.auth["sign-in"].form.success)
  })
})

describe("sign up with password form component", () => {
  it("blocks submit when passwords do not match", async () => {
    expect.hasAssertions()
    setupSignUpWithPasswordFormMocks()
    const user = userEvent.setup()
    renderWithAuthMessages(<SignUpWithPasswordForm />)

    await user.type(screen.getByLabelText(/^name$/iu), TEST_NAME)
    await user.type(screen.getByLabelText(/email/iu), TEST_EMAIL)
    await user.type(getPasswordInput("sign-up-password"), TEST_PASSWORD)
    await user.type(getPasswordInput("sign-up-confirmPassword"), "Different1!")
    await user.click(screen.getByRole("button", { name: "Continue" }))

    expect(signUpEmailMock).not.toHaveBeenCalled()
  })

  it("signs up, celebrates, and redirects", async () => {
    expect.hasAssertions()
    setupSignUpWithPasswordFormMocks()
    const user = userEvent.setup()
    renderWithAuthMessages(<SignUpWithPasswordForm />)

    await user.type(screen.getByLabelText(/^name$/iu), TEST_NAME)
    await user.type(screen.getByLabelText(/email/iu), TEST_EMAIL)
    await user.type(getPasswordInput("sign-up-password"), TEST_PASSWORD)
    await user.type(getPasswordInput("sign-up-confirmPassword"), TEST_PASSWORD)
    await user.click(screen.getByRole("button", { name: "Continue" }))

    await waitFor(() => {
      expect(signUpEmailMock).toHaveBeenCalledWith(
        expect.objectContaining({
          email: TEST_EMAIL,
          name: TEST_NAME,
          password: TEST_PASSWORD,
        }),
      )
    })
    expect(triggerConfettiMock).toHaveBeenCalledWith()
    expect(pushMock).toHaveBeenCalledWith(expect.stringContaining(CONSTANTS.ROUTES.VERIFY_EMAIL))
    expect(pushMock).toHaveBeenCalledWith(expect.stringContaining(encodeURIComponent(TEST_EMAIL)))
  })
})

describe("forgot password form component", () => {
  it("requests a password reset email", async () => {
    expect.hasAssertions()
    setupForgotPasswordFormMocks()
    const user = userEvent.setup()
    renderWithAuthMessages(<ForgotPasswordForm />)

    await user.type(screen.getByLabelText(/email/iu), TEST_EMAIL)
    await user.click(screen.getByTestId("forgot-password-form-submit-button"))

    await waitFor(() => {
      expect(requestPasswordResetMock).toHaveBeenCalledWith(
        expect.objectContaining({
          email: TEST_EMAIL,
        }),
      )
    })
    const resetRequest = requestPasswordResetMock.mock.calls.at(0)?.[0]
    expect(resetRequest?.redirectTo).toContain(CONSTANTS.ROUTES.RESET_PASSWORD)
    expect(toastSuccessMock).toHaveBeenCalledWith(enMessages.pages.auth["forgot-password"].form.success)
    expect(screen.getByTestId("forgot-password-form-submit-button")).toBeDisabled()
  })
})

describe("reset password form component", () => {
  it("blocks submit when passwords do not match", async () => {
    expect.hasAssertions()
    setupResetPasswordFormMocks()
    const user = userEvent.setup()
    renderWithAuthMessages(<ResetPasswordForm token={RESET_TOKEN} />)

    await user.type(getPasswordInput("reset-password-password"), TEST_PASSWORD)
    await user.type(getPasswordInput("reset-password-confirmPassword"), "Different1!")
    await user.click(screen.getByTestId("reset-password-form-submit-button"))

    expect(resetPasswordMock).not.toHaveBeenCalled()
  })

  it("submits the new password with the reset token", async () => {
    expect.hasAssertions()
    setupResetPasswordFormMocks()
    const user = userEvent.setup()
    renderWithAuthMessages(<ResetPasswordForm token={RESET_TOKEN} />)

    await user.type(getPasswordInput("reset-password-password"), TEST_PASSWORD)
    await user.type(getPasswordInput("reset-password-confirmPassword"), TEST_PASSWORD)
    await user.click(screen.getByTestId("reset-password-form-submit-button"))

    await waitFor(() => {
      expect(resetPasswordMock).toHaveBeenCalledWith(
        expect.objectContaining({
          newPassword: TEST_PASSWORD,
          token: RESET_TOKEN,
        }),
      )
    })
    expect(pushMock).toHaveBeenCalledWith(CONSTANTS.ROUTES.SIGN_IN)
  })
})

describe("o auth button component", () => {
  it("starts GitHub OAuth sign-in", async () => {
    expect.hasAssertions()
    setupOAuthButtonMocks()
    const user = userEvent.setup()
    renderWithAuthMessages(<OAuthButton provider="github" Icon={GitHubIconMock} />)

    await user.click(screen.getByRole("button", { name: /sign in with github/iu }))

    await waitFor(() => {
      expect(signInSocialMock).toHaveBeenCalledWith(
        expect.objectContaining({
          callbackURL: CONSTANTS.ROUTES.AUTH_CALLBACK,
          provider: "github",
        }),
      )
    })
    expect(toastSuccessMock).toHaveBeenCalledWith(enMessages.auth.oauth.success)
  })
})

describe("sign out button component", () => {
  it("signs out and returns home", async () => {
    expect.hasAssertions()
    setupSignOutButtonMocks()
    const user = userEvent.setup()

    renderWithAuthMessages(
      <DropdownMenuTrigger defaultOpen>
        <Button>Account</Button>
        <DropdownMenu>
          <SignOutButton />
        </DropdownMenu>
      </DropdownMenuTrigger>,
    )

    await user.click(screen.getByRole("menuitem", { name: /sign out/iu }))

    await waitFor(() => {
      expect(signOutMock).toHaveBeenCalledWith(expect.objectContaining({}))
    })
    expect(pushMock).toHaveBeenCalledWith(CONSTANTS.ROUTES.HOME)
    expect(toastSuccessMock).toHaveBeenCalledWith(enMessages.pages.admin.components.signOutButton.success)
  })
})
