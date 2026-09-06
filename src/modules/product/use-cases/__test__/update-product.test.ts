import type * as StartServerModule from "@tanstack/react-start/server"
import { describe, expect, it, vi } from "vite-plus/test"

import { executeMutation } from "~/src/platform/testing/lib/query"

import { createAuthSessionFixture } from "~/src/integrations/better-auth/__test__/fixtures/auth.session.fixture"
import { ROLE_CODES } from "~/src/integrations/better-auth/auth.access"
import type { auth } from "~/src/integrations/better-auth/auth.server"
import * as authServer from "~/src/integrations/better-auth/auth.server"

import { updateProductMutation } from "~/src/modules/product/use-cases/update-product"

const HEADERS = new Headers()
const PRODUCT_ID = "01900000-0000-7000-8000-000000000002"
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
    name: "Updated Starter",
    priceCents: 9900,
    status: "published" as const,
    type: "subscription" as const,
    updatedAt,
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

describe("update-product", () => {
  it("updates a product for admins", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: ROLE_CODES.ADMIN, userId: USER_ID }))

    await expect(
      executeMutation(updateProductMutation, {
        name: "Updated Starter",
        productId: PRODUCT_ID,
      }),
    ).resolves.toMatchObject(dbMocks.dbRow)

    expect(dbMocks.updateMock).toHaveBeenCalledTimes(SINGLE_CALL)
    expect(getSessionMock).toHaveBeenCalledTimes(SINGLE_CALL)
  })

  it("returns not found when the product does not exist", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    dbMocks.mockEmptyUpdateOnce()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: ROLE_CODES.ADMIN, userId: USER_ID }))

    await expect(
      executeMutation(updateProductMutation, {
        name: "Missing",
        productId: PRODUCT_ID,
      }),
    ).rejects.toThrow("NOT_FOUND")
  })

  it("returns a domain error when the caller is not an admin", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: ROLE_CODES.CUSTOMER, userId: USER_ID }))

    await expect(
      executeMutation(updateProductMutation, {
        name: "Updated Starter",
        productId: PRODUCT_ID,
      }),
    ).rejects.toThrow("FORBIDDEN")
  })
})
