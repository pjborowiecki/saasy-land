/* eslint-disable unicorn/no-null -- Drizzle nullable columns use null in row fixtures. */
import type { User } from "~/src/modules/user/user.types"
import { getUserStatus } from "~/src/modules/user/user.utils"

import { RoleCode } from "~/src/integrations/better-auth/auth.access"

import { filterAdminUsers } from "~/src/app/[locale]/(admin)/admin/users/_components/all-users-tab/components/all-users-table/filters"

const FILTERED_ADMIN_COUNT = 1
const UPDATED_AT = new Date("2026-07-21T12:00:00.000Z")

function makeRow(overrides: Partial<User["select"]> = {}): User["select"] {
  return {
    banExpires: null,
    banReason: null,
    banned: false,
    createdAt: UPDATED_AT,
    email: "admin@example.com",
    emailVerified: true,
    id: "01900000-0000-7000-8000-000000000001",
    image: null,
    isAnonymous: false,
    name: "Admin",
    role: RoleCode.ADMIN,
    timezone: "UTC",
    twoFactorEnabled: false,
    updatedAt: UPDATED_AT,
    ...overrides,
  }
}

const SAMPLE_USERS: readonly User["select"][] = [
  makeRow(),
  makeRow({
    email: "customer@example.com",
    emailVerified: false,
    id: "01900000-0000-7000-8000-000000000002",
    name: "Customer",
    role: RoleCode.CUSTOMER,
  }),
]

describe("users filters", () => {
  it("filters by role and status", () => {
    expect.hasAssertions()

    const filtered = filterAdminUsers(SAMPLE_USERS, { role: RoleCode.ADMIN, status: "active" })

    expect(filtered).toHaveLength(FILTERED_ADMIN_COUNT)
    expect(filtered[0]?.role).toBe(RoleCode.ADMIN)
    expect(getUserStatus(filtered[0]!)).toBe("active")
  })
})
