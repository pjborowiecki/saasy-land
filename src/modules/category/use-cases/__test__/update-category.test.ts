import type * as StartServerModule from "@tanstack/react-start/server"
import { describe, expect, it, vi } from "vite-plus/test"

import { executeMutation } from "~/src/platform/testing/lib/query"

import { createAuthSessionFixture } from "~/src/integrations/better-auth/__test__/fixtures/auth.session.fixture"
import { ROLE_CODES } from "~/src/integrations/better-auth/auth.access"
import type { auth } from "~/src/integrations/better-auth/auth.server"
import * as authServer from "~/src/integrations/better-auth/auth.server"

import { updateCategoryMutation } from "~/src/modules/category/use-cases/update-category"

const HEADERS = new Headers()
const CATEGORY_ID = "01900000-0000-7000-8000-000000000002"
const SINGLE_CALL = 1
const USER_ID = "01900000-0000-7000-8000-000000000001"

type AuthApi = typeof auth.api

const getSessionMock = vi.hoisted(() => vi.fn<AuthApi["getSession"]>())

const dbMocks = vi.hoisted(() => {
  const updatedAt = new Date("2026-07-24T12:00:00.000Z")
  const dbRow = {
    createdAt: updatedAt,
    description: "Core subscription tiers",
    icon: "FolderOpen" as const,
    id: "01900000-0000-7000-8000-000000000002",
    kind: "category" as const,
    name: "Updated SaaS Plans",
    updatedAt,
    visibility: "public" as const,
  }

  const returning = vi.fn<() => Promise<(typeof dbRow)[]>>().mockResolvedValue([dbRow])
  const where = vi.fn<() => { returning: typeof returning }>().mockReturnValue({ returning })
  const set = vi.fn<() => { where: typeof where }>().mockReturnValue({ where })
  const updateMock = vi.fn<() => { set: typeof set }>().mockReturnValue({ set })
  const emptyReturning = vi.fn<() => Promise<(typeof dbRow)[]>>().mockResolvedValue([])
  const emptyWhere = vi.fn<() => { returning: typeof emptyReturning }>().mockReturnValue({ returning: emptyReturning })
  const emptySet = vi.fn<() => { where: typeof emptyWhere }>().mockReturnValue({ where: emptyWhere })

  const mockEmptyUpdateOnce = (): void => {
    updateMock.mockReturnValueOnce({ set: emptySet })
  }

  return { dbRow, mockEmptyUpdateOnce, updateMock }
})

vi.mock(import("@tanstack/react-start/server-only"), () => ({}))

vi.mock(import("@tanstack/react-start/server"), (): Partial<typeof StartServerModule> => ({
  getRequest: vi.fn(() => new Request("http://127.0.0.1:3000/", { headers: HEADERS })),
}))

// @ts-expect-error Vitest module mock factory is not inferred for the Drizzle db client export.
vi.mock(import("~/src/integrations/drizzle-orm/drizzle.database"), () => ({
  db: { update: dbMocks.updateMock },
}))

describe("update-category", () => {
  it("updates a category for admins", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: ROLE_CODES.ADMIN, userId: USER_ID }))

    await expect(
      executeMutation(updateCategoryMutation, {
        categoryId: CATEGORY_ID,
        name: "Updated SaaS Plans",
      }),
    ).resolves.toMatchObject(dbMocks.dbRow)

    expect(dbMocks.updateMock).toHaveBeenCalledTimes(SINGLE_CALL)
    expect(getSessionMock).toHaveBeenCalledTimes(SINGLE_CALL)
  })

  it("returns not found when the category does not exist", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    dbMocks.mockEmptyUpdateOnce()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: ROLE_CODES.ADMIN, userId: USER_ID }))

    await expect(
      executeMutation(updateCategoryMutation, {
        categoryId: CATEGORY_ID,
        name: "Missing",
      }),
    ).rejects.toThrow("NOT_FOUND")
  })

  it("returns a domain error when the caller is not an admin", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: ROLE_CODES.CUSTOMER, userId: USER_ID }))

    await expect(
      executeMutation(updateCategoryMutation, {
        categoryId: CATEGORY_ID,
        name: "Updated SaaS Plans",
      }),
    ).rejects.toThrow("FORBIDDEN")
  })
})
