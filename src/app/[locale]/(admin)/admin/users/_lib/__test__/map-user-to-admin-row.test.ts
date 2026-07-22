/* eslint-disable unicorn/no-null -- Drizzle nullable columns use null in row fixtures. */
import type { User } from "~/src/modules/user/user.types"

import { RoleCode } from "~/src/integrations/better-auth/auth.access"

import { mapUserRowToAdminRow } from "~/src/app/[locale]/(admin)/admin/users/_lib/map-user-to-admin-row"

const USER_ID = "01900000-0000-7000-8000-000000000099"
const UPDATED_AT = new Date("2026-07-21T12:00:00.000Z")

function makeRow(overrides: Partial<User["select"]> = {}): User["select"] {
  return {
    banExpires: null,
    banReason: null,
    banned: false,
    createdAt: UPDATED_AT,
    email: "ada@example.com",
    emailVerified: true,
    id: USER_ID,
    image: null,
    isAnonymous: false,
    name: "Ada Lovelace",
    role: RoleCode.CUSTOMER,
    timezone: null,
    twoFactorEnabled: false,
    updatedAt: UPDATED_AT,
    ...overrides,
  }
}

describe("map user row to admin row", () => {
  it("maps an active customer", () => {
    expect.hasAssertions()

    expect(mapUserRowToAdminRow(makeRow())).toMatchObject({
      email: "ada@example.com",
      initials: "AL",
      isBanned: false,
      lastActive: "2026-07-21",
      name: "Ada Lovelace",
      role: RoleCode.CUSTOMER,
      status: "Active",
      statusColor: "emerald",
    })
  })

  it("maps banned and pending statuses", () => {
    expect.hasAssertions()

    expect(mapUserRowToAdminRow(makeRow({ banned: true })).status).toBe("Banned")
    expect(mapUserRowToAdminRow(makeRow({ emailVerified: false })).status).toBe("Pending")
  })

  it("uses image when present and skips initials", () => {
    expect.hasAssertions()

    const row = mapUserRowToAdminRow(makeRow({ image: "https://example.com/a.png" }))

    expect(row.avatar).toBe("https://example.com/a.png")
    expect(row.initials).toBeUndefined()
    expect(row.colors).toBeUndefined()
  })

  it("derives initials from a single-word name", () => {
    expect.hasAssertions()
    expect(mapUserRowToAdminRow(makeRow({ name: "Prince" })).initials).toBe("PR")
  })
})
