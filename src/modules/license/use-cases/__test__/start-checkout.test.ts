import type * as StartServerModule from "@tanstack/react-start/server"
import { afterEach, describe, expect, it, vi } from "vite-plus/test"

import { JSON_NULL } from "~/src/platform/testing/lib/json-null"
import { executeMutation } from "~/src/platform/testing/lib/query"

import { createAuthSessionFixture } from "~/src/integrations/better-auth/__test__/fixtures/auth.session.fixture"
import { ROLE_CODES } from "~/src/integrations/better-auth/auth.access"
import type { auth } from "~/src/integrations/better-auth/auth.server"
import * as authServer from "~/src/integrations/better-auth/auth.server"
import { POLAR_PRODUCT_IDS } from "~/src/integrations/polar/polar.config"

import { ERROR_CODES } from "~/src/modules/_core/constants/errors"
import * as ppp from "~/src/modules/license/license.ppp"
import { licenseZodSchemas } from "~/src/modules/license/license.zod"
import { startCheckoutMutation } from "~/src/modules/license/use-cases/start-checkout"

const HEADERS = new Headers()
const USER_ID = "01900000-0000-7000-8000-000000000009"
const CHECKOUT_URL = "https://sandbox.polar.sh/checkout/abc"

type AuthApi = typeof auth.api

const getSessionMock = vi.hoisted(() => vi.fn<AuthApi["getSession"]>())
const checkoutMock = vi.hoisted(() => vi.fn<AuthApi["checkout"]>())

vi.mock(import("@tanstack/react-start/server-only"), () => ({}))

vi.mock(import("@tanstack/react-start/server"), (): Partial<typeof StartServerModule> => ({
  getRequest: vi.fn(() => new Request("http://127.0.0.1:3000/", { headers: HEADERS })),
}))

const signedIn = (): void => {
  getSessionMock.mockReset()
  checkoutMock.mockReset()
  vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
  vi.spyOn(authServer.auth.api, "checkout").mockImplementation(checkoutMock)
  getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: ROLE_CODES.CUSTOMER, userId: USER_ID }))
  checkoutMock.mockResolvedValue({ redirect: true, url: CHECKOUT_URL })
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe("start-checkout", () => {
  it("applies the server-resolved regional discount to the requested Agency checkout", async () => {
    signedIn()
    const discount = vi.spyOn(ppp, "pppDiscountId").mockResolvedValue("regional-discount-30")

    await expect(executeMutation(startCheckoutMutation, { tier: "agency" })).resolves.toEqual({ url: CHECKOUT_URL })

    expect(discount).toHaveBeenCalledExactlyOnceWith(HEADERS, POLAR_PRODUCT_IDS.agency)
    expect(checkoutMock).toHaveBeenCalledWith({
      body: { allowDiscountCodes: false, discountId: "regional-discount-30", slug: "agency" },
      headers: HEADERS,
    })
  })

  it("opens a hosted checkout for the requested tier", async () => {
    expect.hasAssertions()
    signedIn()

    await expect(executeMutation(startCheckoutMutation, { tier: "complete" })).resolves.toMatchObject({ url: CHECKOUT_URL })

    expect(checkoutMock).toHaveBeenCalledWith({ body: { allowDiscountCodes: false, slug: "complete" }, headers: HEADERS })
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

    await expect(executeMutation(startCheckoutMutation, { tier: "core" })).rejects.toThrow(ERROR_CODES.UNAUTHORIZED)
  })
})
