import type * as NextHeadersModule from "next/headers"

import { JSON_NULL } from "~/src/platform/testing/lib/json-null"

import { ERROR_CODES } from "~/src/modules/_core/constants/errors"
import { deactivateLicense } from "~/src/modules/license/use-cases/deactivate-license.use-case"

import { createAuthSessionFixture } from "~/src/integrations/better-auth/__test__/fixtures/auth.session.fixture"
import { ROLE_CODES } from "~/src/integrations/better-auth/auth.access"
import type { auth } from "~/src/integrations/better-auth/auth.server"
import * as authServer from "~/src/integrations/better-auth/auth.server"
import type { deactivateLicense as deactivateWithPolar } from "~/src/integrations/polar/polar.utils"

const HEADERS = new Headers()
const USER_ID = "01900000-0000-7000-8000-00000000000a"
const ACTIVATION_ID = "01900000-0000-7000-8000-00000000000b"
const KEY = "SAASY-1111"
const SINGLE_CALL = 1

type AuthApi = typeof auth.api

const getSessionMock = vi.hoisted(() => vi.fn<AuthApi["getSession"]>())
const polarMocks = vi.hoisted(() => ({ deactivateLicense: vi.fn<typeof deactivateWithPolar>() }))

const dbMocks = vi.hoisted(() => {
  const limit = vi.fn<() => Promise<{ key: string | null }[]>>()
  const where = vi.fn<() => { limit: typeof limit }>().mockReturnValue({ limit })
  const from = vi.fn<() => { where: typeof where }>().mockReturnValue({ where })
  const selectMock = vi.fn<() => { from: typeof from }>().mockReturnValue({ from })

  return { limit, selectMock }
})

const redisMocks = vi.hoisted(() => {
  const FIRST_COUNT = 1
  return {
    del: vi.fn<() => Promise<number>>(() => Promise.resolve(FIRST_COUNT)),
    expire: vi.fn<() => Promise<number>>(() => Promise.resolve(FIRST_COUNT)),
    get: vi.fn<() => Promise<string | null>>(() => Promise.resolve(JSON_NULL)),
    getdel: vi.fn<() => Promise<string | null>>(() => Promise.resolve(JSON_NULL)),
    incr: vi.fn<() => Promise<number>>(() => Promise.resolve(FIRST_COUNT)),
    set: vi.fn<() => Promise<string | null>>(() => Promise.resolve(JSON_NULL)),
  }
})

vi.mock(import("server-only"), () => ({}))

vi.mock(import("~/src/integrations/redis/redis.config"), () => ({ redis: redisMocks }))

vi.mock(import("~/src/integrations/polar/polar.utils"), () => ({ deactivateLicense: polarMocks.deactivateLicense }))

vi.mock(import("~/src/platform/db/client"), async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual, db: Object.assign(actual.db, { select: dbMocks.selectMock }) }
})

vi.mock(
  import("next/headers"),
  (): Partial<typeof NextHeadersModule> => ({
    headers: vi.fn<() => Promise<Headers>>(() => Promise.resolve(HEADERS)),
  }),
)

function signedIn(): void {
  getSessionMock.mockReset()
  polarMocks.deactivateLicense.mockReset()
  vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
  getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: ROLE_CODES.CUSTOMER, userId: USER_ID }))
  dbMocks.limit.mockResolvedValue([{ key: KEY }])
}

describe("deactivate-license", () => {
  it("frees the slot using the caller's own key", async () => {
    expect.hasAssertions()
    signedIn()

    await expect(deactivateLicense({ activationId: ACTIVATION_ID })).resolves.toMatchObject({ data: { deactivated: true } })

    expect(polarMocks.deactivateLicense).toHaveBeenCalledWith({ activationId: ACTIVATION_ID, key: KEY })
  })

  it("refuses a caller whose license has no key yet", async () => {
    expect.hasAssertions()
    signedIn()
    dbMocks.limit.mockResolvedValue([{ key: JSON_NULL }])

    await expect(deactivateLicense({ activationId: ACTIVATION_ID })).resolves.toMatchObject({
      serverError: { code: ERROR_CODES.NOT_FOUND },
    })

    expect(polarMocks.deactivateLicense).not.toHaveBeenCalled()
  })

  it("refuses a caller who owns no license", async () => {
    expect.hasAssertions()
    signedIn()
    dbMocks.limit.mockResolvedValue([])

    await expect(deactivateLicense({ activationId: ACTIVATION_ID })).resolves.toMatchObject({
      serverError: { code: ERROR_CODES.NOT_FOUND },
    })
  })

  it("refuses a caller with no session", async () => {
    expect.hasAssertions()
    signedIn()
    getSessionMock.mockResolvedValue(JSON_NULL)

    await expect(deactivateLicense({ activationId: ACTIVATION_ID })).resolves.toMatchObject({
      serverError: { code: ERROR_CODES.UNAUTHORIZED },
    })

    expect(dbMocks.selectMock).not.toHaveBeenCalledTimes(SINGLE_CALL + SINGLE_CALL)
  })
})
