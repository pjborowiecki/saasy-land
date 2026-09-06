import { describe, expect, it } from "vite-plus/test"

import { ADMIN_ANALYTICS_REGION_ROWS, ADMIN_ROLE_ROWS } from "~/src/data/admin"

describe("admin mock data", () => {
  it("exports role and analytics fixtures", () => {
    expect.hasAssertions()
    expect(ADMIN_ROLE_ROWS.length).toBeGreaterThan(0)
    expect(ADMIN_ANALYTICS_REGION_ROWS.length).toBeGreaterThan(0)
  })
})
