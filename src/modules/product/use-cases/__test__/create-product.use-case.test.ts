import type * as NextHeadersModule from "next/headers"

import { createProduct } from "~/src/modules/product/use-cases/create-product.use-case"

import { createAuthSessionFixture } from "~/src/integrations/better-auth/__test__/fixtures/auth.session.fixture"
import { ROLE_CODES } from "~/src/integrations/better-auth/auth.access"
import type { auth } from "~/src/integrations/better-auth/auth.server"
import * as authServer from "~/src/integrations/better-auth/auth.server"

const HEADERS = new Headers()
const SINGLE_CALL = 1
const USER_ID = "01900000-0000-7000-8000-000000000001"

/** Matches `src/platform/testing/mocks/bun.ts` (vitest `bun` alias). */
const CREATED_ID = vi.hoisted(() => "00000000-0000-7000-8000-000000000001")

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
    description: "",
    id: CREATED_ID,
    name: "Pro",
    priceCents: 19_900,
    status: "draft" as const,
    type: "subscription" as const,
    updatedAt,
  }

  const returning = vi.fn<() => Promise<(typeof dbRow)[]>>().mockResolvedValue([dbRow])
  const values = vi.fn<() => { returning: typeof returning }>().mockReturnValue({ returning })
  const insertMock = vi.fn<() => { values: typeof values }>().mockReturnValue({ values })

  return { dbRow, insertMock }
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
  db: { insert: dbMocks.insertMock },
}))

describe("create-product", () => {
  it("creates a product for admins", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: ROLE_CODES.ADMIN, userId: USER_ID }))

    await expect(
      createProduct({
        name: "Pro",
        priceCents: 19_900,
        type: "subscription",
      }),
    ).resolves.toMatchObject({
      data: dbMocks.dbRow,
    })

    expect(dbMocks.insertMock).toHaveBeenCalledTimes(SINGLE_CALL)
    expect(getSessionMock).toHaveBeenCalledTimes(SINGLE_CALL)
  })

  it("returns a domain error when the caller is not an admin", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: ROLE_CODES.CUSTOMER, userId: USER_ID }))

    await expect(
      createProduct({
        name: "Pro",
        priceCents: 19_900,
        type: "subscription",
      }),
    ).resolves.toMatchObject({
      serverError: { code: "FORBIDDEN" },
    })
  })
})
