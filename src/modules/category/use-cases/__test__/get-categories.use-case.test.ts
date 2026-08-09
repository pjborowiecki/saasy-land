import type * as NextCacheModule from "next/cache"
import type * as NextHeadersModule from "next/headers"

import { getCategories } from "~/src/modules/category/use-cases/get-categories.use-case"

import {
  createAuthSessionFixture,
  createMissingAuthSessionResult,
} from "~/src/integrations/better-auth/__test__/fixtures/auth.session.fixture"
import { ROLE_CODES } from "~/src/integrations/better-auth/auth.access"
import type { auth } from "~/src/integrations/better-auth/auth.server"
import * as authServer from "~/src/integrations/better-auth/auth.server"

const HEADERS = new Headers()
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

  const orderBy = vi.fn<() => Promise<(typeof dbRow)[]>>().mockResolvedValue([dbRow])
  const from = vi.fn<() => { orderBy: typeof orderBy }>().mockReturnValue({ orderBy })
  const selectMock = vi.fn<() => { from: typeof from }>().mockReturnValue({ from })

  return { dbRow, selectMock }
})

vi.mock(import("server-only"), () => ({}))

vi.mock(
  import("next/cache"),
  (): Partial<typeof NextCacheModule> => ({
    cacheLife: vi.fn<() => void>(),
    cacheTag: vi.fn<(tag: string) => void>(),
    revalidateTag: vi.fn<(tag: string, profile: string | { expire?: number }) => undefined>(),
    updateTag: vi.fn<(tag: string) => undefined>(),
  }),
)

vi.mock(
  import("next/headers"),
  (): Partial<typeof NextHeadersModule> => ({
    headers: vi.fn<() => Promise<Headers>>(() => Promise.resolve(HEADERS)),
  }),
)

// @ts-expect-error Vitest module mock factory is not inferred for the Drizzle db client export.
vi.mock(import("~/src/platform/db/client"), () => ({
  db: { select: dbMocks.selectMock },
}))

describe("list-categories", () => {
  it("lists categories for admins", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: ROLE_CODES.ADMIN, userId: USER_ID }))

    await expect(getCategories()).resolves.toStrictEqual([dbMocks.dbRow])

    expect(dbMocks.selectMock).toHaveBeenCalledTimes(SINGLE_CALL)
    expect(getSessionMock).toHaveBeenCalledTimes(SINGLE_CALL)
  })

  it("rejects when the caller is not an admin", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: ROLE_CODES.CUSTOMER, userId: USER_ID }))

    await expect(getCategories()).rejects.toMatchObject({ digest: "NEXT_HTTP_ERROR_FALLBACK;403" })
  })

  it("rejects when the caller is signed out", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    getSessionMock.mockResolvedValue(createMissingAuthSessionResult())

    await expect(getCategories()).rejects.toMatchObject({ digest: "NEXT_HTTP_ERROR_FALLBACK;401" })
  })
})
