import { env } from "~/src/platform/env"

import { JSON_NULL } from "~/src/platform/testing/lib/json-null"

import { licenseWebhookHandlers } from "~/src/modules/license/license.webhooks"
import type { attachLicenseKey } from "~/src/modules/license/use-cases/attach-license-key.use-case"
import type { grantLicense } from "~/src/modules/license/use-cases/grant-license.use-case"
import type { revokeLicense } from "~/src/modules/license/use-cases/revoke-license.use-case"

const USER_ID = "018f2b9c-0000-7000-8000-000000000005"
const UNKNOWN_PRODUCT_ID = "00000000-0000-4000-8000-00000000ffff"

const useCaseMocks = vi.hoisted(() => ({
  attachLicenseKey: vi.fn<typeof attachLicenseKey>(),
  grantLicense: vi.fn<typeof grantLicense>(),
  revokeLicense: vi.fn<typeof revokeLicense>(),
}))

vi.mock(import("server-only"), () => ({}))

vi.mock(import("~/src/modules/license/use-cases/attach-license-key.use-case"), () => ({
  attachLicenseKey: useCaseMocks.attachLicenseKey,
}))

vi.mock(import("~/src/modules/license/use-cases/grant-license.use-case"), () => ({ grantLicense: useCaseMocks.grantLicense }))

vi.mock(import("~/src/modules/license/use-cases/revoke-license.use-case"), () => ({ revokeLicense: useCaseMocks.revokeLicense }))

function orderPayload(productId: string | null = JSON_NULL, externalId?: string) {
  return { data: { customer: { externalId }, customerId: "cus_1", id: "ord_1", productId } }
}

function grantPayload(licenseKeyId?: string, externalId?: string) {
  return { data: { customer: { externalId }, id: "grant_1", properties: { licenseKeyId } } }
}

function resetUseCases(): void {
  useCaseMocks.attachLicenseKey.mockClear()
  useCaseMocks.grantLicense.mockClear()
  useCaseMocks.revokeLicense.mockClear()
}

describe("license webhooks", () => {
  it("grants the tier the buyer paid for", async () => {
    expect.hasAssertions()
    resetUseCases()

    await licenseWebhookHandlers.onOrderPaid(orderPayload(env.POLAR_PRODUCT_ID_COMPLETE, USER_ID))

    expect(useCaseMocks.grantLicense).toHaveBeenCalledWith({
      polarCustomerId: "cus_1",
      polarOrderId: "ord_1",
      tier: "complete",
      userId: USER_ID,
    })
  })

  it("refuses an order for a product this app does not sell", async () => {
    expect.hasAssertions()
    resetUseCases()
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {})

    await licenseWebhookHandlers.onOrderPaid(orderPayload(UNKNOWN_PRODUCT_ID, USER_ID))

    expect(useCaseMocks.grantLicense).not.toHaveBeenCalled()
    consoleError.mockRestore()
  })

  it("refuses an order with no product and no buyer", async () => {
    expect.hasAssertions()
    resetUseCases()
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {})

    await licenseWebhookHandlers.onOrderPaid(orderPayload())

    expect(useCaseMocks.grantLicense).not.toHaveBeenCalled()
    consoleError.mockRestore()
  })

  it("attaches a key from a license benefit grant", async () => {
    expect.hasAssertions()
    resetUseCases()

    await licenseWebhookHandlers.onBenefitGrantCreated(grantPayload("lk_1", USER_ID))

    expect(useCaseMocks.attachLicenseKey).toHaveBeenCalledWith({ polarLicenseKeyId: "lk_1", userId: USER_ID })
  })

  it("ignores a grant for a benefit that carries no license key", async () => {
    expect.hasAssertions()
    resetUseCases()

    await licenseWebhookHandlers.onBenefitGrantCreated(grantPayload(undefined, USER_ID))

    expect(useCaseMocks.attachLicenseKey).not.toHaveBeenCalled()
  })

  it("logs a license grant it cannot tie to a buyer", async () => {
    expect.hasAssertions()
    resetUseCases()
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {})

    await licenseWebhookHandlers.onBenefitGrantCreated(grantPayload("lk_1"))

    expect(useCaseMocks.attachLicenseKey).not.toHaveBeenCalled()
    consoleError.mockRestore()
  })

  it("revokes on a refund and on a revoked grant", async () => {
    expect.hasAssertions()
    resetUseCases()
    const REVOCATIONS = 2

    await licenseWebhookHandlers.onOrderRefunded(orderPayload(env.POLAR_PRODUCT_ID_CORE, USER_ID))
    await licenseWebhookHandlers.onBenefitGrantRevoked(grantPayload("lk_1", USER_ID))

    expect(useCaseMocks.revokeLicense).toHaveBeenCalledTimes(REVOCATIONS)
    expect(useCaseMocks.revokeLicense).toHaveBeenCalledWith(USER_ID)
  })

  it("leaves anonymous revocations alone", async () => {
    expect.hasAssertions()
    resetUseCases()

    await licenseWebhookHandlers.onOrderRefunded(orderPayload())
    await licenseWebhookHandlers.onBenefitGrantRevoked(grantPayload())

    expect(useCaseMocks.revokeLicense).not.toHaveBeenCalled()
  })
})
