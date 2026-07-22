import { ADMIN_USER_ROWS } from "~/src/app/[locale]/(admin)/admin/_lib/mock-data"
import {
  DEFAULT_ADMIN_USERS_FILTERS,
  areAdminUsersFiltersEqual,
  filterAdminUsers,
} from "~/src/app/[locale]/(admin)/admin/users/_components/tabs/all-users/_lib/users-filters"

describe("users filters", () => {
  it("treats matching filter snapshots as equal", () => {
    expect.hasAssertions()

    expect(areAdminUsersFiltersEqual(DEFAULT_ADMIN_USERS_FILTERS, { role: "all", status: "all" })).toBe(true)
    expect(areAdminUsersFiltersEqual(DEFAULT_ADMIN_USERS_FILTERS, { role: "Editor", status: "all" })).toBe(false)
  })

  it("filters by role and status", () => {
    expect.hasAssertions()

    const filtered = filterAdminUsers(ADMIN_USER_ROWS, { role: "Administrator", status: "Active" })

    for (const user of filtered) {
      expect(user.role).toBe("Administrator")
      expect(user.status).toBe("Active")
    }
  })
})
