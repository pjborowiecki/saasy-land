import type { auth } from "~/src/integrations/better-auth/auth.server"

const FIXTURE_DATE = new Date("2024-01-01T00:00:00.000Z")

type GetSessionResult = Awaited<ReturnType<typeof auth.api.getSession>>
type SessionResult = NonNullable<GetSessionResult>
type BanUserResult = Awaited<ReturnType<typeof auth.api.banUser>>

function readJsonNull(): null {
  const value: unknown = JSON.parse("null")

  if (value !== null) {
    throw new Error("Expected JSON null")
  }

  return value
}

export function createMissingAuthSessionResult(): GetSessionResult {
  return readJsonNull()
}

export function createNullableStringNull(): string | null {
  return readJsonNull()
}

function createFixtureUserCore(overrides: { role?: string }): Omit<SessionResult["user"], "id" | "isAnonymous"> {
  return {
    banned: false,
    createdAt: FIXTURE_DATE,
    email: "test@example.com",
    emailVerified: true,
    name: "Test User",
    role: overrides.role ?? "customer",
    timezone: "Europe/Warsaw",
    twoFactorEnabled: false,
    updatedAt: FIXTURE_DATE,
  }
}

export function createAuthSessionFixture(
  overrides: {
    role?: string
    userId?: string
  } = {},
): SessionResult {
  const userId = overrides.userId ?? "01900000-0000-7000-8000-000000000001"

  return {
    session: {
      createdAt: FIXTURE_DATE,
      expiresAt: FIXTURE_DATE,
      id: "01900000-0000-7000-8000-000000000002",
      token: "fixture-session-token",
      updatedAt: FIXTURE_DATE,
      userId,
    },
    user: {
      ...createFixtureUserCore(overrides),
      id: userId,
      isAnonymous: false,
    },
  }
}

export function createAuthUserMutationResult(
  overrides: {
    role?: string
    userId?: string
  } = {},
): BanUserResult {
  const userId = overrides.userId ?? "01900000-0000-7000-8000-000000000001"
  const user: BanUserResult["user"] = {
    ...createFixtureUserCore(overrides),
    banned: false,
    id: userId,
    role: overrides.role ?? "customer",
  }

  return { user }
}
