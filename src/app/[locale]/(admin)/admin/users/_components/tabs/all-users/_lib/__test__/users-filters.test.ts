import { RoleCode } from "~/src/integrations/better-auth/auth.access"

import type { AdminUserRow } from "~/src/app/[locale]/(admin)/admin/_types"
import {
  DEFAULT_ADMIN_USERS_FILTERS,
  areAdminUsersFiltersEqual,
  filterAdminUsers,
} from "~/src/app/[locale]/(admin)/admin/users/_components/tabs/all-users/_lib/users-filters"

const FILTERED_ADMIN_COUNT = 1

const SAMPLE_USERS: readonly AdminUserRow[] = [
  {
    email: "admin@example.com",
    id: "1",
    lastActive: "2026-07-21",
    name: "Admin",
    role: RoleCode.ADMIN,
    status: "Active",
    statusColor: "emerald",
  },
  {
    email: "customer@example.com",
    id: "2",
    lastActive: "2026-07-20",
    name: "Customer",
    role: RoleCode.CUSTOMER,
    status: "Pending",
    statusColor: "amber",
  },
]

describe("users filters", () => {
  it("treats matching filter snapshots as equal", () => {
    expect.hasAssertions()

    expect(areAdminUsersFiltersEqual(DEFAULT_ADMIN_USERS_FILTERS, { role: "all", status: "all" })).toBe(true)
    expect(areAdminUsersFiltersEqual(DEFAULT_ADMIN_USERS_FILTERS, { role: RoleCode.ADMIN, status: "all" })).toBe(false)
  })

  it("filters by role and status", () => {
    expect.hasAssertions()

    const filtered = filterAdminUsers(SAMPLE_USERS, { role: RoleCode.ADMIN, status: "Active" })

    expect(filtered).toHaveLength(FILTERED_ADMIN_COUNT)
    expect(filtered[0]?.role).toBe(RoleCode.ADMIN)
    expect(filtered[0]?.status).toBe("Active")
  })
})
