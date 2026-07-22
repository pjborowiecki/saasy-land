import type * as NextHeadersModule from "next/headers"

import { updateUser } from "~/src/modules/user/use-cases/update-user.use-case"

import {
  createAuthSessionFixture,
  createAuthUserMutationResult,
  createNullableStringNull,
} from "~/src/integrations/better-auth/__test__/fixtures/auth.session.fixture"
import { RoleCode } from "~/src/integrations/better-auth/auth.access"
import type { auth } from "~/src/integrations/better-auth/auth.server"
import * as authServer from "~/src/integrations/better-auth/auth.server"

const HEADERS = new Headers()
const TARGET_USER_ID = "01900000-0000-7000-8000-000000000002"
const ADMIN_USER_ID = "01900000-0000-7000-8000-000000000001"
const TIMEZONE = "Europe/Warsaw"
const CLEARED_IMAGE = createNullableStringNull()

type AuthApi = typeof auth.api

const getSessionMock = vi.hoisted(() => vi.fn<AuthApi["getSession"]>())
const adminUpdateUserMock = vi.hoisted(() => vi.fn<AuthApi["adminUpdateUser"]>())

vi.mock(import("server-only"), () => ({}))

vi.mock(
  import("next/headers"),
  (): Partial<typeof NextHeadersModule> => ({
    headers: vi.fn<() => Promise<Headers>>(() => Promise.resolve(HEADERS)),
  }),
)

function mockAdminSession(): void {
  getSessionMock.mockReset()
  adminUpdateUserMock.mockReset()
  vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
  vi.spyOn(authServer.auth.api, "adminUpdateUser").mockImplementation(adminUpdateUserMock)
  getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: RoleCode.ADMIN, userId: ADMIN_USER_ID }))
}

describe("update-user", () => {
  it("passes userId and patch data to auth.api.adminUpdateUser", async () => {
    expect.hasAssertions()
    mockAdminSession()
    const updatedUser = createAuthUserMutationResult({ userId: TARGET_USER_ID }).user
    adminUpdateUserMock.mockResolvedValue(updatedUser)

    await expect(updateUser({ name: "Updated Name", userId: TARGET_USER_ID })).resolves.toMatchObject({
      data: updatedUser,
    })

    expect(adminUpdateUserMock).toHaveBeenCalledExactlyOnceWith({
      body: { data: { name: "Updated Name" }, userId: TARGET_USER_ID },
      headers: HEADERS,
    })
  })

  it("forwards only the fields present in the action input", async () => {
    expect.hasAssertions()
    mockAdminSession()
    adminUpdateUserMock.mockResolvedValue(createAuthUserMutationResult({ userId: TARGET_USER_ID }).user)

    await updateUser({
      name: "Updated Name",
      timezone: TIMEZONE,
      userId: TARGET_USER_ID,
    })

    expect(adminUpdateUserMock).toHaveBeenCalledWith({
      body: {
        data: { name: "Updated Name", timezone: TIMEZONE },
        userId: TARGET_USER_ID,
      },
      headers: HEADERS,
    })
  })

  it("forwards null image clears in patch data", async () => {
    expect.hasAssertions()
    mockAdminSession()
    adminUpdateUserMock.mockResolvedValue(createAuthUserMutationResult({ userId: TARGET_USER_ID }).user)

    await updateUser({ image: CLEARED_IMAGE, userId: TARGET_USER_ID })

    expect(adminUpdateUserMock).toHaveBeenCalledWith({
      body: {
        data: { image: CLEARED_IMAGE },
        userId: TARGET_USER_ID,
      },
      headers: HEADERS,
    })
  })

  it("returns a domain error when the caller is not an admin", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    adminUpdateUserMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    vi.spyOn(authServer.auth.api, "adminUpdateUser").mockImplementation(adminUpdateUserMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: RoleCode.CUSTOMER, userId: ADMIN_USER_ID }))

    await expect(updateUser({ name: "Updated Name", userId: TARGET_USER_ID })).resolves.toMatchObject({
      serverError: { code: "FORBIDDEN" },
    })

    expect(adminUpdateUserMock).not.toHaveBeenCalled()
  })
})
