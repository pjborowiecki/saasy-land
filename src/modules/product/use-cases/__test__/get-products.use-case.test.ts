import type * as NextCacheModule from "next/cache"
import type * as NextHeadersModule from "next/headers"

import { getProducts } from "~/src/modules/product/use-cases/get-products.use-case"

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
  const nullableJsonValue: unknown = JSON.parse("null")
  if (nullableJsonValue !== null) {
    throw new Error("Expected JSON null")
  }

  const updatedAt = new Date("2026-07-21T12:00:00.000Z")
  const dbRow = {
    billingCycle: nullableJsonValue,
    createdAt: updatedAt,
    currency: "USD",
    description: "Starter plan",
    id: "01900000-0000-7000-8000-000000000002",
    name: "Starter",
    priceCents: 9900,
    status: "published" as const,
    type: "subscription" as const,
    updatedAt,
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

describe("list-products", () => {
  it("lists products for admins", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: ROLE_CODES.ADMIN, userId: USER_ID }))

    await expect(getProducts()).resolves.toStrictEqual([dbMocks.dbRow])

    expect(dbMocks.selectMock).toHaveBeenCalledTimes(SINGLE_CALL)
    expect(getSessionMock).toHaveBeenCalledTimes(SINGLE_CALL)
  })

  it("rejects when the caller is not an admin", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: ROLE_CODES.CUSTOMER, userId: USER_ID }))

    await expect(getProducts()).rejects.toMatchObject({ digest: "NEXT_HTTP_ERROR_FALLBACK;403" })
  })

  it("rejects when the caller is signed out", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    getSessionMock.mockResolvedValue(createMissingAuthSessionResult())

    await expect(getProducts()).rejects.toMatchObject({ digest: "NEXT_HTTP_ERROR_FALLBACK;401" })
  })
})
