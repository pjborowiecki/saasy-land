import type * as NextHeadersModule from "next/headers"

import { JSON_NULL } from "~/src/platform/testing/lib/json-null"

import { ERROR_CODES } from "~/src/modules/_core/constants/errors"
import { licenseZodSchemas } from "~/src/modules/license/license.zod"
import { startCheckout } from "~/src/modules/license/use-cases/start-checkout.use-case"

import { createAuthSessionFixture } from "~/src/integrations/better-auth/__test__/fixtures/auth.session.fixture"
import { ROLE_CODES } from "~/src/integrations/better-auth/auth.access"
import type { auth } from "~/src/integrations/better-auth/auth.server"
import * as authServer from "~/src/integrations/better-auth/auth.server"

const HEADERS = new Headers()
const USER_ID = "01900000-0000-7000-8000-000000000009"
const CHECKOUT_URL = "https://sandbox.polar.sh/checkout/abc"

type AuthApi = typeof auth.api

const getSessionMock = vi.hoisted(() => vi.fn<AuthApi["getSession"]>())
const checkoutMock = vi.hoisted(() => vi.fn<AuthApi["checkout"]>())

vi.mock(import("server-only"), () => ({}))

vi.mock(
  import("next/headers"),
  (): Partial<typeof NextHeadersModule> => ({
    headers: vi.fn<() => Promise<Headers>>(() => Promise.resolve(HEADERS)),
  }),
)

function signedIn(): void {
  getSessionMock.mockReset()
  checkoutMock.mockReset()
  vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
  vi.spyOn(authServer.auth.api, "checkout").mockImplementation(checkoutMock)
  getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: ROLE_CODES.CUSTOMER, userId: USER_ID }))
  checkoutMock.mockResolvedValue({ redirect: true, url: CHECKOUT_URL })
}

describe("start-checkout", () => {
  it("opens a hosted checkout for the requested tier", async () => {
    expect.hasAssertions()
    signedIn()

    await expect(startCheckout({ tier: "complete" })).resolves.toMatchObject({ data: { url: CHECKOUT_URL } })

    expect(checkoutMock).toHaveBeenCalledWith({ body: { slug: "complete" }, headers: HEADERS })
  })

  it("refuses a tier this app does not sell", () => {
    expect.hasAssertions()
    signedIn()

    expect(licenseZodSchemas.startCheckout.safeParse({ tier: "enterprise" }).success).toBe(false)
    expect(checkoutMock).not.toHaveBeenCalled()
  })

  it("refuses a caller with no session", async () => {
    expect.hasAssertions()
    signedIn()
    getSessionMock.mockResolvedValue(JSON_NULL)

    await expect(startCheckout({ tier: "core" })).resolves.toMatchObject({
      serverError: { code: ERROR_CODES.UNAUTHORIZED },
    })
  })
})
