import { env } from "cloudflare:workers"

import type * as StartServerModule from "@tanstack/react-start/server"
import { afterEach, describe, expect, it, vi } from "vite-plus/test"

import { JSON_NULL } from "~/src/platform/testing/lib/json-null"
import { executeMutation } from "~/src/platform/testing/lib/query"

import { createAuthSessionFixture } from "~/src/integrations/better-auth/__test__/fixtures/auth.session.fixture"
import { ROLE_CODES } from "~/src/integrations/better-auth/auth.access"
import type { auth } from "~/src/integrations/better-auth/auth.server"
import * as authServer from "~/src/integrations/better-auth/auth.server"
import { polar } from "~/src/integrations/polar/polar.config"

import { ERROR_CODES } from "~/src/modules/_core/constants/errors"
import { deactivateLicenseMutation } from "~/src/modules/license/use-cases/deactivate-license"

const HEADERS = new Headers()
const USER_ID = "01900000-0000-7000-8000-00000000000a"
const ACTIVATION_ID = "01900000-0000-7000-8000-00000000000b"
const KEY = "SAASY-1111"

type AuthApi = typeof auth.api

const getSessionMock = vi.hoisted(() => vi.fn<AuthApi["getSession"]>())

const dbMocks = vi.hoisted(() => {
  const limit = vi.fn<() => Promise<{ key: string | null }[]>>()
  const where = vi.fn<() => { limit: typeof limit }>().mockReturnValue({ limit })
  const from = vi.fn<() => { where: typeof where }>().mockReturnValue({ where })
  const selectMock = vi.fn<() => { from: typeof from }>().mockReturnValue({ from })

  return { limit, selectMock }
})

vi.mock(import("@tanstack/react-start/server-only"), () => ({}))

vi.mock(import("~/src/integrations/drizzle-orm/drizzle.database"), async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual, db: Object.assign(actual.db, { select: dbMocks.selectMock }) }
})

vi.mock(import("@tanstack/react-start/server"), (): Partial<typeof StartServerModule> => ({
  getRequest: vi.fn(() => new Request("http://127.0.0.1:3000/", { headers: HEADERS })),
}))

const signedIn = () => {
  getSessionMock.mockReset()
  dbMocks.selectMock.mockClear()
  const deactivate = vi.spyOn(polar.licenseKeys, "deactivate").mockResolvedValue()
  vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
  getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: ROLE_CODES.CUSTOMER, userId: USER_ID }))
  dbMocks.limit.mockResolvedValue([{ key: KEY }])
  return deactivate
}

afterEach(() => vi.restoreAllMocks())

describe("deactivate-license", () => {
  it("frees the slot using the caller's own key", async () => {
    expect.hasAssertions()
    const deactivate = signedIn()

    await expect(executeMutation(deactivateLicenseMutation, { activationId: ACTIVATION_ID })).resolves.toMatchObject({ deactivated: true })

    expect(deactivate).toHaveBeenCalledWith({
      activationId: ACTIVATION_ID,
      key: KEY,
      organizationId: env.POLAR_ORGANIZATION_ID,
    })
  })

  it("refuses a caller whose license has no key yet", async () => {
    expect.hasAssertions()
    const deactivate = signedIn()
    dbMocks.limit.mockResolvedValue([{ key: JSON_NULL }])

    await expect(executeMutation(deactivateLicenseMutation, { activationId: ACTIVATION_ID })).rejects.toThrow(ERROR_CODES.NOT_FOUND)

    expect(deactivate).not.toHaveBeenCalled()
  })

  it("refuses a caller who owns no license", async () => {
    expect.hasAssertions()
    signedIn()
    dbMocks.limit.mockResolvedValue([])

    await expect(executeMutation(deactivateLicenseMutation, { activationId: ACTIVATION_ID })).rejects.toThrow(ERROR_CODES.NOT_FOUND)
  })

  it("refuses a caller with no session", async () => {
    expect.hasAssertions()
    const deactivate = signedIn()
    getSessionMock.mockResolvedValue(JSON_NULL)

    await expect(executeMutation(deactivateLicenseMutation, { activationId: ACTIVATION_ID })).rejects.toThrow(ERROR_CODES.UNAUTHORIZED)

    expect(dbMocks.selectMock).not.toHaveBeenCalled()
    expect(deactivate).not.toHaveBeenCalled()
  })
})
