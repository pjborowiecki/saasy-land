import { describe, expect, it, vi } from "vite-plus/test"

import { grantLicense } from "~/src/modules/license/use-cases/grant-license"

const USER_ID = "018f2b9c-0000-7000-8000-000000000001"
const SINGLE_CALL = 1

const dbMocks = vi.hoisted(() => {
  const onConflictDoUpdate = vi.fn<() => Promise<void>>().mockResolvedValue()
  const values = vi
    .fn<(row: { tier: string; userId: string }) => { onConflictDoUpdate: typeof onConflictDoUpdate }>()
    .mockReturnValue({ onConflictDoUpdate })
  const insertMock = vi.fn<() => { values: typeof values }>().mockReturnValue({ values })

  return { insertMock, onConflictDoUpdate, values }
})

vi.mock(import("@tanstack/react-start/server-only"), () => ({}))

vi.mock(import("~/src/integrations/drizzle-orm/drizzle.database"), async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual, db: Object.assign(actual.db, { insert: dbMocks.insertMock }) }
})

describe("grant-license", () => {
  it("records the purchase against the buyer", async () => {
    expect.hasAssertions()
    dbMocks.insertMock.mockClear()
    dbMocks.values.mockClear()

    await grantLicense({ polarCustomerId: "cus_1", polarOrderId: "ord_1", tier: "complete", userId: USER_ID })

    const [row] = dbMocks.values.mock.calls.map(([value]) => value)

    expect(dbMocks.insertMock).toHaveBeenCalledTimes(SINGLE_CALL)
    expect(row).toHaveProperty("userId", USER_ID)
    expect(row).toHaveProperty("tier", "complete")
  })

  it("upgrades a buyer who already owns a tier instead of duplicating them", async () => {
    expect.hasAssertions()
    dbMocks.onConflictDoUpdate.mockClear()

    await grantLicense({ polarCustomerId: "cus_1", polarOrderId: "ord_2", tier: "core", userId: USER_ID })

    expect(dbMocks.onConflictDoUpdate).toHaveBeenCalledTimes(SINGLE_CALL)
  })
})
