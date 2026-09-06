import { type JSX, type ReactNode } from "react"
/** @vitest-environment jsdom */

import type { SuccessContext } from "@better-fetch/fetch"
import type * as StartServerModule from "@tanstack/react-start/server"
import { screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import type * as Sonner from "sonner"
import type { ExternalToast } from "sonner"
import { IntlProvider } from "use-intl/react"
import { describe, expect, it, vi } from "vite-plus/test"

import { createTestRouter, renderWithRouter as render } from "~/src/platform/testing/lib/render"

import { createAuthSessionFixture } from "~/src/integrations/better-auth/__test__/fixtures/auth.session.fixture"
import { ROLE_CODES } from "~/src/integrations/better-auth/auth.access"
import type * as AuthClient from "~/src/integrations/better-auth/auth.client"
import type * as AuthSession from "~/src/integrations/better-auth/auth.session"
import { getTestMessages } from "~/src/integrations/use-intl/__test__/fixtures/messages"

import type * as SignOutUseCase from "~/src/modules/account/use-cases/sign-out-user"
import type * as RequestPasswordResetUseCase from "~/src/modules/verification/use-cases/request-password-reset"
import type * as ResetPasswordUseCase from "~/src/modules/verification/use-cases/reset-password"

import { Button } from "~/src/presentation/components/shadcn/button"
import { DropdownMenu, DropdownMenuTrigger } from "~/src/presentation/components/shadcn/dropdown-menu"

import { SignOutButton } from "~/src/presentation/components/custom/admin/components/sign-out-button"
import { OAuthButton } from "~/src/presentation/components/custom/auth/components/oauth-button"
import { ForgotPasswordForm } from "~/src/presentation/components/custom/auth/forgot-password/components/forgot-password-form"
import { ResetPasswordForm } from "~/src/presentation/components/custom/auth/reset-password/components/reset-password-form"
import { SignInWithPasswordForm } from "~/src/presentation/components/custom/auth/sign-in/components/sign-in-with-password-form"
import { SignUpWithPasswordForm } from "~/src/presentation/components/custom/auth/sign-up/components/sign-up-with-password-form"

import { ROUTES } from "~/src/routes"

type SonnerTitle = (() => ReactNode) | ReactNode
type ToastMethod = (message: SonnerTitle, data?: ExternalToast) => string | number

const TEST_EMAIL = "user@example.com"
const TEST_PASSWORD = "Secret1!"
const TEST_NAME = "Test User"
const RESET_TOKEN = "reset-token-123"

const enMessages = getTestMessages("en-US")

const router = createTestRouter()
const pushMock = vi.spyOn(router, "navigate").mockResolvedValue()
const signInEmailMock = vi.hoisted(() => vi.fn<typeof AuthClient.signIn.email>())
const signUpEmailMock = vi.hoisted(() => vi.fn<typeof AuthClient.signUp.email>())
const getSessionMock = vi.hoisted(() => vi.fn<typeof AuthSession.getCurrentSession>())
const settingsSignOutUserMock = vi.hoisted(() => vi.fn<NonNullable<typeof SignOutUseCase.settingsSignOutUserMutation.mutationFn>>())
const requestPasswordResetMock = vi.hoisted(() =>
  vi.fn<NonNullable<typeof RequestPasswordResetUseCase.requestPasswordResetMutation.mutationFn>>(),
)
const resetPasswordMock = vi.hoisted(() => vi.fn<NonNullable<typeof ResetPasswordUseCase.resetPasswordMutation.mutationFn>>())
const signInSocialMock = vi.hoisted(() => vi.fn<typeof AuthClient.authClient.signIn.social>())
const toastSuccessMock = vi.hoisted(() => vi.fn<ToastMethod>(() => 0))
const toastErrorMock = vi.hoisted(() => vi.fn<ToastMethod>(() => 0))
const triggerConfettiMock = vi.hoisted(() => vi.fn<() => void>())

const createAuthSuccessContext = (data?: unknown): SuccessContext => ({
  data,
  request: {
    body: undefined,
    headers: new Headers(),
    method: "POST",
    signal: new AbortController().signal,
    url: "http://localhost/api/auth",
  },
  response: new Response(),
})

const invokeFetchOnSuccess = async (
  fetchOptions: { onSuccess?: (context: SuccessContext) => Promise<void> | void } | undefined,
): Promise<void> => {
  await fetchOptions?.onSuccess?.(createAuthSuccessContext())
}

const renderWithAuthMessages = (ui: ReactNode): ReturnType<typeof render> =>
  render(
    <IntlProvider locale="en-US" messages={enMessages}>
      {ui}
    </IntlProvider>,
    { router },
  )

const getPasswordInput = (id: string): HTMLInputElement => {
  const input = document.querySelector<HTMLInputElement>(`#${id}`)
  if (!input) {
    throw new Error(`Missing input: #${id}`)
  }

  return input
}

const setupSignInWithPasswordFormMocks = (): void => {
  pushMock.mockClear()
  signInEmailMock.mockClear()
  getSessionMock.mockClear()
  toastSuccessMock.mockClear()
  toastErrorMock.mockClear()

  signInEmailMock.mockResolvedValue({
    data: { redirect: false, token: "test-token", user: createAuthSessionFixture().user },
    error: null,
  })
  getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: ROLE_CODES.CUSTOMER }))
}

const HEADERS = new Headers()

const setupSignUpWithPasswordFormMocks = (): void => {
  pushMock.mockClear()
  signUpEmailMock.mockClear()
  getSessionMock.mockClear()
  triggerConfettiMock.mockClear()
  toastSuccessMock.mockClear()

  signUpEmailMock.mockImplementation(async ({ fetchOptions }) => {
    await invokeFetchOnSuccess(fetchOptions)
  })
  getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: ROLE_CODES.CUSTOMER }))
}

const setupForgotPasswordFormMocks = (): void => {
  requestPasswordResetMock.mockClear()
  toastSuccessMock.mockClear()
  toastErrorMock.mockClear()

  requestPasswordResetMock.mockResolvedValue({ message: "ok", status: true })
}

const setupResetPasswordFormMocks = (): void => {
  pushMock.mockClear()
  resetPasswordMock.mockClear()
  toastSuccessMock.mockClear()

  resetPasswordMock.mockResolvedValue({ status: true })
}

const setupOAuthButtonMocks = (): void => {
  signInSocialMock.mockClear()
  toastSuccessMock.mockClear()

  signInSocialMock.mockImplementation(async ({ fetchOptions }) => {
    await invokeFetchOnSuccess(fetchOptions)
  })
}

const setupSignOutButtonMocks = (): void => {
  pushMock.mockClear()
  settingsSignOutUserMock.mockClear()
  toastSuccessMock.mockClear()

  settingsSignOutUserMock.mockResolvedValue({ redirect: undefined, success: true, url: undefined })
}

const GitHubIconMock = (): JSX.Element => <span aria-hidden="true" />

vi.mock(import("@tanstack/react-start/server-only"), () => ({}))

vi.mock(import("@tanstack/react-start/server"), (): Partial<typeof StartServerModule> => ({
  getRequest: vi.fn(() => new Request("http://127.0.0.1:3000/", { headers: HEADERS })),
}))

// @ts-expect-error Vitest module mock factory is not inferred for module export.
vi.mock(import("~/src/integrations/drizzle-orm/drizzle.database"), () => ({
  db: {},
}))

// @ts-expect-error Vitest module mock factory is not inferred for module export.
vi.mock(import("~/src/integrations/resend/resend.config"), () => ({
  resend: {},
}))

// @ts-expect-error Vitest module mock factory is not inferred for module export.
vi.mock(import("~/src/integrations/better-auth/auth.server"), () => ({
  auth: {
    api: {
      signUpEmail: signUpEmailMock,
    },
  },
}))

vi.mock(import("~/src/hooks/use-confetti"), () => ({
  useConfetti: () => ({ triggerConfetti: triggerConfettiMock }),
}))

vi.mock(import("sonner"), async (importOriginal): Promise<Partial<typeof Sonner>> => {
  const actual = await importOriginal<typeof Sonner>()

  vi.spyOn(actual.toast, "success").mockImplementation(toastSuccessMock)
  vi.spyOn(actual.toast, "error").mockImplementation(toastErrorMock)

  return actual
})

vi.mock(import("~/src/modules/account/use-cases/sign-out-user"), () => ({
  settingsSignOutUserMutation: { mutationFn: settingsSignOutUserMock, mutationKey: ["test", "settingsSignOutUserMutation"] },
}))

vi.mock(import("~/src/modules/verification/use-cases/request-password-reset"), () => ({
  requestPasswordResetMutation: { mutationFn: requestPasswordResetMock, mutationKey: ["test", "requestPasswordResetMutation"] },
}))

vi.mock(import("~/src/modules/verification/use-cases/reset-password"), () => ({
  resetPasswordMutation: { mutationFn: resetPasswordMock, mutationKey: ["test", "resetPasswordMutation"] },
}))

vi.mock(import("~/src/integrations/better-auth/auth.client"), async (importOriginal): Promise<Partial<typeof AuthClient>> => {
  const actual = await importOriginal<typeof AuthClient>()

  return {
    ...actual,
    authClient: {
      ...actual.authClient,
      signIn: {
        ...actual.authClient.signIn,
        social: signInSocialMock,
      },
    },
    signIn: {
      ...actual.signIn,
      email: signInEmailMock,
    },
    signUp: {
      ...actual.signUp,
      email: signUpEmailMock,
    },
  }
})

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
    expect(pushMock).toHaveBeenCalledWith({ to: ROUTES.APP })
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
    expect(screen.getByText("Passwords match").parentElement).toHaveTextContent("Requirement not met")
    await user.clear(getPasswordInput("sign-up-confirmPassword"))
    await user.type(getPasswordInput("sign-up-confirmPassword"), TEST_PASSWORD)
    expect(screen.getByText("Passwords match").parentElement).toHaveTextContent("Requirement met")
    await user.type(getPasswordInput("sign-up-password"), "changed")
    expect(screen.getByText("Passwords match").parentElement).toHaveTextContent("Requirement not met")
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

    const expectedBody: unknown = expect.objectContaining({
      email: TEST_EMAIL,
      name: TEST_NAME,
      password: TEST_PASSWORD,
    })

    await waitFor(() => {
      expect(signUpEmailMock).toHaveBeenCalledWith(
        expect.objectContaining({
          body: expectedBody,
        }),
      )
    })
    expect(triggerConfettiMock).toHaveBeenCalledWith()
    const destination = pushMock.mock.calls.at(-1)?.[0]
    expect(destination?.to).toBe(ROUTES.VERIFY_EMAIL)
    expect(destination?.search).toStrictEqual({ email: TEST_EMAIL })
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
      expect(requestPasswordResetMock.mock.calls[0]?.[0]).toEqual(
        expect.objectContaining({
          email: TEST_EMAIL,
        }),
      )
    })
    const resetRequest = requestPasswordResetMock.mock.calls.at(0)?.[0]
    expect(resetRequest?.redirectTo).toContain(ROUTES.RESET_PASSWORD)
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
      expect(resetPasswordMock.mock.calls[0]?.[0]).toEqual(
        expect.objectContaining({
          password: TEST_PASSWORD,
          token: RESET_TOKEN,
        }),
      )
    })
    expect(pushMock).toHaveBeenCalledWith({ to: ROUTES.SIGN_IN })
  })
})

describe("o auth button component", () => {
  it("uses a neutral continue label when creating an account", () => {
    setupOAuthButtonMocks()
    renderWithAuthMessages(<OAuthButton intent="sign-up" provider="github" Icon={GitHubIconMock} />)

    expect(screen.getByRole("button", { name: "Continue with GitHub" })).toBeVisible()
    expect(screen.queryByRole("button", { name: "Sign in with GitHub" })).not.toBeInTheDocument()
  })

  it("starts GitHub OAuth sign-in", async () => {
    expect.hasAssertions()
    setupOAuthButtonMocks()
    const user = userEvent.setup()
    renderWithAuthMessages(<OAuthButton provider="github" Icon={GitHubIconMock} />)

    await user.click(screen.getByRole("button", { name: /sign in with github/iu }))

    await waitFor(() => {
      expect(signInSocialMock).toHaveBeenCalledWith(
        expect.objectContaining({
          callbackURL: ROUTES.AUTH_CALLBACK,
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
      expect(settingsSignOutUserMock).toHaveBeenCalled()
    })
    expect(pushMock).toHaveBeenCalledWith({ to: ROUTES.HOME })
    expect(toastSuccessMock).toHaveBeenCalledWith(enMessages.pages.admin.components.signOutButton.success)
  })
})

vi.mock(import("~/src/integrations/better-auth/auth.session"), () => ({ getCurrentSession: getSessionMock }))
