import { ADMIN_ANALYTICS_REGION_ROWS, ADMIN_USER_ROWS } from "~/src/app/[locale]/(admin)/admin/_lib/mock-data"

describe("admin mock data", () => {
  it("exports user and analytics fixtures", () => {
    expect.hasAssertions()
    expect(ADMIN_USER_ROWS.length).toBeGreaterThan(0)
    expect(ADMIN_ANALYTICS_REGION_ROWS.length).toBeGreaterThan(0)

    expect(ADMIN_USER_ROWS.find((row) => row.id === "u1")?.colors).toBeTypeOf("string")
    expect(ADMIN_USER_ROWS.find((row) => row.id === "u2")?.avatar).toBeTypeOf("string")
  })
})
