import { adminClient, multiSessionClient, twoFactorClient } from "better-auth/client/plugins"
import { admin, multiSession, twoFactor } from "better-auth/plugins"
import { getTestInstance } from "better-auth/test"

import { TEST_APP_URL } from "~/src/platform/testing/lib/test-request"

import { DEFAULT_ROLE_CODE, ROLES, ROLE_CODES, ac } from "~/src/integrations/better-auth/auth.access"

import { APP_NAME } from "~/src/presentation/branding"
import { ROUTES } from "~/src/routes"

const DEFAULT_RATE_LIMIT_MAX = 100
const DEFAULT_RATE_LIMIT_WINDOW_SECONDS = 60
const STRICT_RATE_LIMIT_MAX = 2

export const AUTH_TEST_BASE_URL = TEST_APP_URL
export const AUTH_TEST_SECRET = "ci-test-auth-secret-that-is-long-enough-for-validation-0000000000"
export const STRONG_TEST_PASSWORD = "Secret1!"

export interface AuthEmailPayload {
  readonly token: string
  readonly url: string
  readonly user: { readonly email: string; readonly name: string }
}

export interface ChangeEmailPayload extends AuthEmailPayload {
  readonly newEmail: string
}

export interface AuthEmailCapture {
  changeEmail: ChangeEmailPayload[]
  resetPassword: AuthEmailPayload[]
  verification: AuthEmailPayload[]
}

export const createEmptyEmailCapture = (): AuthEmailCapture => ({
  changeEmail: [],
  resetPassword: [],
  verification: [],
})

export const createTestUserPayload = (
  overrides?: Partial<{ email: string; name: string; password: string }>,
): {
  email: string
  name: string
  password: string
} => ({
  email: overrides?.email ?? `user-${globalThis.crypto.randomUUID()}@example.com`,
  name: overrides?.name ?? "Test User",
  password: overrides?.password ?? STRONG_TEST_PASSWORD,
})

export const extractQueryParam = (url: string, key: string): string | undefined => new URL(url).searchParams.get(key) ?? undefined

type AuthTestContext = Awaited<ReturnType<typeof createAuthTestInstance>>

export type { AuthTestContext }

interface AuthTestUserRecord {
  email: string
  emailVerified?: boolean
  id: string
  role?: string | null
}

interface AdminAuthApiExtension {
  setRole: (input: { body: { role: string; userId: string }; headers: Headers }) => Promise<unknown>
  userHasPermission: (input: {
    body: { permissions: Record<string, string[]>; role: string }
    headers: Headers
  }) => Promise<{ success: boolean }>
}

type ExtendedAuthApi = AuthTestContext["auth"]["api"] & AdminAuthApiExtension

const hasAdminAuthApiExtension = (api: AuthTestContext["auth"]["api"]): api is ExtendedAuthApi =>
  "setRole" in api && typeof api.setRole === "function" && "userHasPermission" in api && typeof api.userHasPermission === "function"

const isAuthTestUserRecord = (record: unknown): record is AuthTestUserRecord => {
  if (typeof record !== "object" || record === null) {
    return false
  }

  if (!("id" in record) || typeof record.id !== "string") {
    return false
  }

  if (!("email" in record) || typeof record.email !== "string") {
    return false
  }

  if ("emailVerified" in record && typeof record.emailVerified !== "boolean" && record.emailVerified !== undefined) {
    return false
  }

  if ("role" in record && record.role !== null && typeof record.role !== "string" && record.role !== undefined) {
    return false
  }

  return true
}

const readOptionalRole = (user: unknown): string | undefined => {
  if (typeof user !== "object" || user === null || !("role" in user)) {
    return undefined
  }

  const role: unknown = Reflect.get(user, "role")

  if (typeof role === "string") {
    return role
  }

  return undefined
}

export const getExtendedAuthApi = (context: AuthTestContext): ExtendedAuthApi => {
  const { api } = context.auth

  if (!hasAdminAuthApiExtension(api)) {
    throw new Error("Auth API does not expose admin plugin methods")
  }

  return api
}

export const readSignUpRole = (user: Record<string, unknown>): string => {
  const { role } = user

  if (typeof role === "string") {
    return role
  }

  return DEFAULT_ROLE_CODE
}

export const findAuthTestUser = async (context: AuthTestContext, email: string): Promise<AuthTestUserRecord> => {
  const record = await context.db.findOne({
    model: "user",
    where: [{ field: "email", value: email }],
  })

  if (!isAuthTestUserRecord(record)) {
    throw new Error(`Expected user record for ${email}`)
  }

  return record
}

export const getSessionUserRole = async (context: AuthTestContext, headers: Headers): Promise<string> => {
  const session = await context.auth.api.getSession({ headers })
  const role = readOptionalRole(session?.user)

  if (role !== undefined) {
    return role
  }

  return DEFAULT_ROLE_CODE
}

export const requireSessionUserId = async (context: AuthTestContext, headers: Headers): Promise<string> => {
  const session = await context.auth.api.getSession({ headers })

  if (session?.user.id === undefined) {
    throw new Error("Expected authenticated user")
  }

  return session.user.id
}

export const signUpVerifyAndSignIn = async (
  context: AuthTestContext,
  user: { email: string; name: string; password: string } = createTestUserPayload(),
): Promise<{ headers: Headers; user: { email: string; name: string; password: string } }> => {
  await context.auth.api.signUpEmail({ body: user })

  const verification = context.emailCapture.verification.find((entry) => entry.user.email === user.email)
  const token = verification === undefined ? undefined : extractQueryParam(verification.url, "token")

  if (token === undefined) {
    throw new Error("Verification email was not captured")
  }

  await context.auth.api.verifyEmail({ query: { token } })

  const { headers } = await context.signInWithUser(user.email, user.password)

  return { headers, user }
}

export const promoteUserToAdmin = async (context: AuthTestContext, userId: string): Promise<void> => {
  await context.db.update({
    model: "user",
    update: { role: ROLE_CODES.ADMIN },
    where: [{ field: "id", value: userId }],
  })
}

export const completeChangeEmailFlow = async (context: AuthTestContext, headers: Headers, newEmail: string): Promise<void> => {
  const verificationCountBefore = context.emailCapture.verification.length

  await context.auth.api.changeEmail({
    body: { newEmail },
    headers,
  })

  const confirmation = context.emailCapture.changeEmail.find((entry) => entry.newEmail === newEmail)
  const confirmToken = confirmation?.token ?? (confirmation === undefined ? undefined : extractQueryParam(confirmation.url, "token"))

  if (confirmToken === undefined) {
    throw new Error("Change email confirmation was not captured")
  }

  await context.auth.api.verifyEmail({
    headers,
    query: { token: confirmToken },
  })

  const verification = context.emailCapture.verification.slice(verificationCountBefore).find((entry) => entry.user.email === newEmail)
  const verifyToken = verification?.token ?? (verification === undefined ? undefined : extractQueryParam(verification.url, "token"))

  if (verifyToken === undefined) {
    throw new Error("Change email verification was not captured")
  }

  await context.auth.api.verifyEmail({
    query: { token: verifyToken },
  })
}

interface CreateAuthTestInstanceOptions {
  emailCapture?: AuthEmailCapture
  rateLimitCustomRules?: Record<string, { max: number; window: number }>
  rateLimitEnabled?: boolean
  rateLimitMax?: number
  rateLimitWindow?: number
}

export const createAuthTestInstance = (options?: CreateAuthTestInstanceOptions) => {
  const emailCapture = options?.emailCapture ?? createEmptyEmailCapture()
  const rateLimitEnabled = options?.rateLimitEnabled ?? false

  return getTestInstance(
    {
      account: { accountLinking: { enabled: true, trustedProviders: ["github", "google"] } },
      appName: APP_NAME,
      baseURL: AUTH_TEST_BASE_URL,
      emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        sendResetPassword: (payload) => {
          emailCapture.resetPassword.push(payload)
          return Promise.resolve()
        },
      },
      emailVerification: {
        autoSignInAfterVerification: true,
        sendOnSignUp: true,
        sendVerificationEmail: (payload) => {
          emailCapture.verification.push(payload)
          return Promise.resolve()
        },
      },
      plugins: [
        admin({
          ac,
          adminRoles: [ROLE_CODES.ADMIN],
          defaultRole: DEFAULT_ROLE_CODE,
          roles: ROLES,
        }),
        multiSession({ maximumSessions: MAX_CONCURRENT_SESSIONS }),
        twoFactor({ issuer: APP_NAME }),
      ],
      rateLimit: {
        customRules: rateLimitEnabled
          ? (options?.rateLimitCustomRules ?? {
              [ROUTES.API_AUTH.REQUEST_PASSWORD_RESET]: {
                max: STRICT_RATE_LIMIT_MAX,
                window: options?.rateLimitWindow ?? DEFAULT_RATE_LIMIT_WINDOW_SECONDS,
              },
              [ROUTES.API_AUTH.RESET_PASSWORD]: {
                max: STRICT_RATE_LIMIT_MAX,
                window: options?.rateLimitWindow ?? DEFAULT_RATE_LIMIT_WINDOW_SECONDS,
              },
              [ROUTES.API_AUTH.SIGN_IN_EMAIL]: {
                max: options?.rateLimitMax ?? STRICT_RATE_LIMIT_MAX,
                window: options?.rateLimitWindow ?? DEFAULT_RATE_LIMIT_WINDOW_SECONDS,
              },
              [ROUTES.API_AUTH.SIGN_UP_EMAIL]: {
                max: STRICT_RATE_LIMIT_MAX,
                window: options?.rateLimitWindow ?? DEFAULT_RATE_LIMIT_WINDOW_SECONDS,
              },
            })
          : undefined,
        enabled: rateLimitEnabled,
        max: options?.rateLimitMax ?? DEFAULT_RATE_LIMIT_MAX,
        window: options?.rateLimitWindow ?? DEFAULT_RATE_LIMIT_WINDOW_SECONDS,
      },
      secret: AUTH_TEST_SECRET,
      session: { storeSessionInDatabase: true },
      socialProviders: {
        github: { clientId: "test-github-id", clientSecret: "test-github-secret" },
        google: { clientId: "test-google-id", clientSecret: "test-google-secret" },
      },
      trustedOrigins: [AUTH_TEST_BASE_URL],
      user: {
        changeEmail: {
          enabled: true,
          sendChangeEmailConfirmation: (payload) => {
            emailCapture.changeEmail.push(payload)
            return Promise.resolve()
          },
        },
      },
    },
    {
      clientOptions: {
        plugins: [adminClient({ ac, roles: ROLES }), multiSessionClient(), twoFactorClient()],
      },
      disableTestUser: true,
      testWith: "sqlite",
    },
  ).then((instance) => ({ ...instance, emailCapture }))
}

const MAX_CONCURRENT_SESSIONS = 10
