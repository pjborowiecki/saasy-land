import type * as NextHeadersModule from "next/headers"

import { updateCategory } from "~/src/modules/category/use-cases/update-category.use-case"

import { createAuthSessionFixture } from "~/src/integrations/better-auth/__test__/fixtures/auth.session.fixture"
import { ROLE_CODES } from "~/src/integrations/better-auth/auth.access"
import type { auth } from "~/src/integrations/better-auth/auth.server"
import * as authServer from "~/src/integrations/better-auth/auth.server"

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

vi.mock(import("server-only"), () => ({}))

vi.mock(
  import("next/headers"),
  (): Partial<typeof NextHeadersModule> => ({
    headers: vi.fn<() => Promise<Headers>>(() => Promise.resolve(HEADERS)),
  }),
)

// @ts-expect-error Vitest module mock factory is not inferred for the Drizzle db client export.
vi.mock(import("~/src/platform/db/client"), () => ({
  db: { update: dbMocks.updateMock },
}))

describe("update-category", () => {
  it("updates a category for admins", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: ROLE_CODES.ADMIN, userId: USER_ID }))

    await expect(
      updateCategory({
        categoryId: CATEGORY_ID,
        name: "Updated SaaS Plans",
      }),
    ).resolves.toMatchObject({
      data: dbMocks.dbRow,
    })

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
      updateCategory({
        categoryId: CATEGORY_ID,
        name: "Missing",
      }),
    ).resolves.toMatchObject({
      serverError: { code: "NOT_FOUND" },
    })
  })

  it("returns a domain error when the caller is not an admin", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: ROLE_CODES.CUSTOMER, userId: USER_ID }))

    await expect(
      updateCategory({
        categoryId: CATEGORY_ID,
        name: "Updated SaaS Plans",
      }),
    ).resolves.toMatchObject({
      serverError: { code: "FORBIDDEN" },
    })
  })
})
