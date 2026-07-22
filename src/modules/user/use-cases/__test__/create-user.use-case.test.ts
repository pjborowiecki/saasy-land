import type * as NextHeadersModule from "next/headers"

import { createUser } from "~/src/modules/user/use-cases/create-user.use-case"

import {
  createAuthSessionFixture,
  createAuthUserMutationResult,
} from "~/src/integrations/better-auth/__test__/fixtures/auth.session.fixture"
import { RoleCode } from "~/src/integrations/better-auth/auth.access"
import type { auth } from "~/src/integrations/better-auth/auth.server"
import * as authServer from "~/src/integrations/better-auth/auth.server"

const HEADERS = new Headers()
const ADMIN_USER_ID = "01900000-0000-7000-8000-000000000001"

type AuthApi = typeof auth.api

const getSessionMock = vi.hoisted(() => vi.fn<AuthApi["getSession"]>())
const createUserMock = vi.hoisted(() => vi.fn<AuthApi["createUser"]>())

vi.mock(import("server-only"), () => ({}))

vi.mock(
  import("next/headers"),
  (): Partial<typeof NextHeadersModule> => ({
    headers: vi.fn<() => Promise<Headers>>(() => Promise.resolve(HEADERS)),
  }),
)

describe("create-user", () => {
  it("creates a user when the caller is an admin", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    createUserMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    vi.spyOn(authServer.auth.api, "createUser").mockImplementation(createUserMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: RoleCode.ADMIN, userId: ADMIN_USER_ID }))
    const mutationResult = createAuthUserMutationResult()
    createUserMock.mockResolvedValue(mutationResult)

    await expect(
      createUser({
        email: "new@example.com",
        name: "New User",
        password: "Password1!",
      }),
    ).resolves.toMatchObject({ data: mutationResult })

    expect(createUserMock).toHaveBeenCalledWith({
      body: {
        email: "new@example.com",
        name: "New User",
        password: "Password1!",
      },
      headers: HEADERS,
    })
  })

  it("returns a domain error when the caller is not an admin", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: RoleCode.CUSTOMER, userId: ADMIN_USER_ID }))

    await expect(
      createUser({
        email: "new@example.com",
        name: "New User",
      }),
    ).resolves.toMatchObject({
      serverError: { code: "FORBIDDEN" },
    })
  })
})
