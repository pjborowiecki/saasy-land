import { afterEach, describe, expect, it, vi } from "vite-plus/test"

import { POLAR_LICENSE_KEY } from "~/src/integrations/polar/__test__/fixtures/license-key"
import { polar } from "~/src/integrations/polar/polar.config"

import { attachLicenseKey } from "~/src/modules/license/use-cases/attach-license-key"

const USER_ID = "018f2b9c-0000-7000-8000-000000000004"
const LICENSE_KEY_ID = "lk_1"
const FULL_KEY = "SAASY-FULL-KEY"

const dbMocks = vi.hoisted(() => {
  const returning = vi.fn<() => Promise<{ id: string }[]>>()
  const where = vi.fn<() => { returning: typeof returning }>().mockReturnValue({ returning })
  const set = vi.fn<(update: Record<string, unknown>) => { where: typeof where }>().mockReturnValue({ where })
  const updateMock = vi.fn<() => { set: typeof set }>().mockReturnValue({ set })

  return { returning, set, updateMock }
})

vi.mock(import("@tanstack/react-start/server-only"), () => ({}))

vi.mock(import("~/src/integrations/drizzle-orm/drizzle.database"), async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual, db: Object.assign(actual.db, { update: dbMocks.updateMock }) }
})

afterEach(() => vi.restoreAllMocks())

describe("attach-license-key", () => {
  it("stores the full key, which the webhook only sends masked", async () => {
    expect.hasAssertions()
    const get = vi.spyOn(polar.licenseKeys, "get").mockResolvedValue({ ...POLAR_LICENSE_KEY, key: FULL_KEY })
    dbMocks.returning.mockResolvedValue([{ id: "row_1" }])

    await attachLicenseKey({ polarLicenseKeyId: LICENSE_KEY_ID, userId: USER_ID })

    expect(get).toHaveBeenCalledWith({ id: LICENSE_KEY_ID })
    expect(dbMocks.set).toHaveBeenCalledWith({ key: FULL_KEY, polarLicenseKeyId: LICENSE_KEY_ID })
  })

  it("rejects an early benefit delivery and accepts its retry once the order exists", async () => {
    expect.hasAssertions()
    vi.spyOn(polar.licenseKeys, "get").mockResolvedValue({ ...POLAR_LICENSE_KEY, key: FULL_KEY })
    dbMocks.returning.mockResolvedValue([])

    await expect(attachLicenseKey({ polarLicenseKeyId: LICENSE_KEY_ID, userId: USER_ID })).rejects.toThrow(
      "The license purchase has not been recorded yet",
    )

    dbMocks.returning.mockResolvedValue([{ id: "row_1" }])

    await expect(attachLicenseKey({ polarLicenseKeyId: LICENSE_KEY_ID, userId: USER_ID })).resolves.toBeUndefined()
    expect(dbMocks.set).toHaveBeenLastCalledWith({ key: FULL_KEY, polarLicenseKeyId: LICENSE_KEY_ID })
  })
})
