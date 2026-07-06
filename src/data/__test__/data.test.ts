import { ADMIN_ANALYTICS_REGION_ROWS, ADMIN_USER_ROWS, DASHBOARD_USER_ROWS } from "~/src/data/admin/mock-data"
import { TECH_STACK } from "~/src/data/tech-stack"
import { TESTIMONIALS } from "~/src/data/testimonials"

describe("static data exports", () => {
  it("exports tech stack entries", () => {
    expect.hasAssertions()
    expect(TECH_STACK.length).toBeGreaterThan(0)
    expect(TECH_STACK[0]?.name).toBeTypeOf("string")
  })

  it("exports testimonials", () => {
    expect.hasAssertions()
    expect(TESTIMONIALS.length).toBeGreaterThan(0)
    expect(TESTIMONIALS[0]?.items[0]?.text).toBeTypeOf("string")
  })

  it("exports admin mock data", () => {
    expect.hasAssertions()
    expect(DASHBOARD_USER_ROWS.length).toBeGreaterThan(0)
    expect(ADMIN_USER_ROWS.length).toBeGreaterThan(0)
    expect(ADMIN_ANALYTICS_REGION_ROWS.length).toBeGreaterThan(0)
  })
})
