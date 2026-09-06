import type * as StartServerModule from "@tanstack/react-start/server"
import { describe, expect, it, vi } from "vite-plus/test"

import { executeMutation } from "~/src/platform/testing/lib/query"

import { createAuthSessionFixture } from "~/src/integrations/better-auth/__test__/fixtures/auth.session.fixture"
import { ROLE_CODES } from "~/src/integrations/better-auth/auth.access"
import type { auth } from "~/src/integrations/better-auth/auth.server"
import * as authServer from "~/src/integrations/better-auth/auth.server"

import { deleteCategoryMutation } from "~/src/modules/category/use-cases/delete-category"

const HEADERS = new Headers()
const CATEGORY_ID = "01900000-0000-7000-8000-000000000002"
const SINGLE_CALL = 1
const USER_ID = "01900000-0000-7000-8000-000000000001"

type AuthApi = typeof auth.api

const getSessionMock = vi.hoisted(() => vi.fn<AuthApi["getSession"]>())

const dbMocks = vi.hoisted(() => {
  const returning = vi.fn<() => Promise<{ id: string }[]>>().mockResolvedValue([{ id: "01900000-0000-7000-8000-000000000002" }])
  const where = vi.fn<() => { returning: typeof returning }>().mockReturnValue({ returning })
  const deleteMock = vi.fn<() => { where: typeof where }>().mockReturnValue({ where })
  const emptyReturning = vi.fn<() => Promise<{ id: string }[]>>().mockResolvedValue([])
  const emptyWhere = vi.fn<() => { returning: typeof emptyReturning }>().mockReturnValue({ returning: emptyReturning })

  const mockEmptyDeleteOnce = (): void => {
    deleteMock.mockReturnValueOnce({ where: emptyWhere })
  }

  return { deleteMock, mockEmptyDeleteOnce }
})

vi.mock(import("@tanstack/react-start/server-only"), () => ({}))

vi.mock(import("@tanstack/react-start/server"), (): Partial<typeof StartServerModule> => ({
  getRequest: vi.fn(() => new Request("http://127.0.0.1:3000/", { headers: HEADERS })),
}))

// @ts-expect-error Vitest module mock factory is not inferred for the Drizzle db client export.
vi.mock(import("~/src/integrations/drizzle-orm/drizzle.database"), () => ({
  db: { delete: dbMocks.deleteMock },
}))

describe("delete-category", () => {
  it("deletes a category for admins", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: ROLE_CODES.ADMIN, userId: USER_ID }))

    await expect(executeMutation(deleteCategoryMutation, { categoryId: CATEGORY_ID })).resolves.toMatchObject({ id: CATEGORY_ID })

    expect(dbMocks.deleteMock).toHaveBeenCalledTimes(SINGLE_CALL)
    expect(getSessionMock).toHaveBeenCalledTimes(SINGLE_CALL)
  })

  it("returns not found when the category does not exist", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    dbMocks.mockEmptyDeleteOnce()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: ROLE_CODES.ADMIN, userId: USER_ID }))

    await expect(executeMutation(deleteCategoryMutation, { categoryId: CATEGORY_ID })).rejects.toThrow("NOT_FOUND")
  })

  it("returns a domain error when the caller is not an admin", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: ROLE_CODES.CUSTOMER, userId: USER_ID }))

    await expect(executeMutation(deleteCategoryMutation, { categoryId: CATEGORY_ID })).rejects.toThrow("FORBIDDEN")
  })
})
