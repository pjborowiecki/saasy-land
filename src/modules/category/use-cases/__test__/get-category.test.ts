import type * as StartServerModule from "@tanstack/react-start/server"
import { describe, expect, it, vi } from "vite-plus/test"

import {
  createAuthSessionFixture,
  createMissingAuthSessionResult,
} from "~/src/integrations/better-auth/__test__/fixtures/auth.session.fixture"
import { ROLE_CODES } from "~/src/integrations/better-auth/auth.access"
import type { auth } from "~/src/integrations/better-auth/auth.server"
import * as authServer from "~/src/integrations/better-auth/auth.server"

import { getCategory } from "~/src/modules/category/use-cases/get-category"

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
    name: "SaaS Plans",
    updatedAt,
    visibility: "public" as const,
  }

  const limit = vi.fn<() => Promise<(typeof dbRow)[]>>().mockResolvedValue([dbRow])
  const where = vi.fn<() => { limit: typeof limit }>().mockReturnValue({ limit })
  const from = vi.fn<() => { where: typeof where }>().mockReturnValue({ where })
  const selectMock = vi.fn<() => { from: typeof from }>().mockReturnValue({ from })
  const emptyLimit = vi.fn<() => Promise<(typeof dbRow)[]>>().mockResolvedValue([])
  const emptyWhere = vi.fn<() => { limit: typeof emptyLimit }>().mockReturnValue({ limit: emptyLimit })
  const emptyFrom = vi.fn<() => { where: typeof emptyWhere }>().mockReturnValue({ where: emptyWhere })

  const mockEmptySelectOnce = (): void => {
    selectMock.mockReturnValueOnce({ from: emptyFrom })
  }

  return { dbRow, mockEmptySelectOnce, selectMock }
})

vi.mock(import("@tanstack/react-start/server-only"), () => ({}))

vi.mock(import("@tanstack/react-start/server"), (): Partial<typeof StartServerModule> => ({
  getRequest: vi.fn(() => new Request("http://127.0.0.1:3000/", { headers: HEADERS })),
}))

// @ts-expect-error Vitest module mock factory is not inferred for the Drizzle db client export.
vi.mock(import("~/src/integrations/drizzle-orm/drizzle.database"), () => ({
  db: { select: dbMocks.selectMock },
}))

describe("get-category", () => {
  it("returns a category for admins", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: ROLE_CODES.ADMIN, userId: USER_ID }))

    await expect(getCategory({ data: CATEGORY_ID })).resolves.toStrictEqual(dbMocks.dbRow)

    expect(dbMocks.selectMock).toHaveBeenCalledTimes(SINGLE_CALL)
    expect(getSessionMock).toHaveBeenCalledTimes(SINGLE_CALL)
  })

  it("rejects with not-found when the category does not exist", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    dbMocks.mockEmptySelectOnce()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: ROLE_CODES.ADMIN, userId: USER_ID }))

    await expect(getCategory({ data: CATEGORY_ID })).rejects.toMatchObject({ code: "NOT_FOUND" })
  })

  it("rejects when the caller is not an admin", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: ROLE_CODES.CUSTOMER, userId: USER_ID }))

    await expect(getCategory({ data: CATEGORY_ID })).rejects.toMatchObject({ code: "FORBIDDEN" })
  })

  it("rejects when the caller is signed out", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    getSessionMock.mockResolvedValue(createMissingAuthSessionResult())

    await expect(getCategory({ data: CATEGORY_ID })).rejects.toMatchObject({ code: "UNAUTHORIZED" })
  })
})
