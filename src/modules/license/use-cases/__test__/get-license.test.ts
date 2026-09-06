import { describe, expect, it, vi } from "vite-plus/test"

import { getLicense } from "~/src/modules/license/use-cases/get-license"

const USER_ID = "018f2b9c-0000-7000-8000-000000000003"

const dbMocks = vi.hoisted(() => {
  const limit = vi.fn<() => Promise<{ key: string }[]>>()
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

describe("get-license", () => {
  it("returns the buyer's license", async () => {
    expect.hasAssertions()
    dbMocks.limit.mockResolvedValue([{ key: "SAASY-1234" }])

    await expect(getLicense(USER_ID)).resolves.toHaveProperty("key", "SAASY-1234")
  })

  it("returns nothing for someone who has not bought", async () => {
    expect.hasAssertions()
    dbMocks.limit.mockResolvedValue([])

    await expect(getLicense(USER_ID)).resolves.toBeUndefined()
  })
})
