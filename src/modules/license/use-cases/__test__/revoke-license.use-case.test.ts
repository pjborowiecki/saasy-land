import { revokeLicense } from "~/src/modules/license/use-cases/revoke-license.use-case"

const USER_ID = "018f2b9c-0000-7000-8000-000000000002"
const SINGLE_CALL = 1

const dbMocks = vi.hoisted(() => {
  const where = vi.fn<() => Promise<void>>().mockResolvedValue()
  const set = vi.fn<(update: Record<string, unknown>) => { where: typeof where }>().mockReturnValue({ where })
  const updateMock = vi.fn<() => { set: typeof set }>().mockReturnValue({ set })

  return { set, updateMock }
})

vi.mock(import("server-only"), () => ({}))

vi.mock(import("~/src/platform/db/client"), async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual, db: Object.assign(actual.db, { update: dbMocks.updateMock }) }
})

describe("revoke-license", () => {
  it("marks the license revoked without deleting the record", async () => {
    expect.hasAssertions()
    dbMocks.updateMock.mockClear()

    await revokeLicense(USER_ID)

    expect(dbMocks.updateMock).toHaveBeenCalledTimes(SINGLE_CALL)
    expect(dbMocks.set).toHaveBeenCalledWith({ status: "revoked" })
  })
})
