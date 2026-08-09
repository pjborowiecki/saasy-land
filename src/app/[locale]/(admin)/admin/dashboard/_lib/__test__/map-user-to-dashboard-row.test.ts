import { JSON_NULL } from "~/src/platform/testing/lib/json-null"

import type { User } from "~/src/modules/user/user.types"

import { ROLE_CODES } from "~/src/integrations/better-auth/auth.access"

import { mapUserRowToDashboardRow } from "~/src/app/[locale]/(admin)/admin/dashboard/_lib/map-user-to-dashboard-row"

const USER_ID = "01900000-0000-7000-8000-000000000099"
const UPDATED_AT = new Date("2026-07-21T12:00:00.000Z")

function makeRow(overrides: Partial<User["select"]> = {}): User["select"] {
  return {
    banExpires: JSON_NULL,
    banReason: JSON_NULL,
    banned: false,
    createdAt: UPDATED_AT,
    email: "ada@example.com",
    emailVerified: true,
    id: USER_ID,
    image: JSON_NULL,
    name: "Ada Lovelace",
    role: ROLE_CODES.CUSTOMER,
    timezone: "UTC",
    twoFactorEnabled: false,
    updatedAt: UPDATED_AT,
    ...overrides,
  }
}

describe("map user row to dashboard row", () => {
  it("maps core fields from the admin row mapper", () => {
    expect.hasAssertions()

    expect(mapUserRowToDashboardRow(makeRow())).toMatchObject({
      email: "ada@example.com",
      id: USER_ID,
      lastActive: "2026-07-21",
      name: "Ada Lovelace",
      role: ROLE_CODES.CUSTOMER,
      status: "active",
    })
    expect(mapUserRowToDashboardRow(makeRow()).initials).toBe("AL")
  })

  it("includes avatar and omits initials when image is set", () => {
    expect.hasAssertions()

    const row = mapUserRowToDashboardRow(makeRow({ image: "https://example.com/a.png" }))

    expect(row.avatar).toBe("https://example.com/a.png")
    expect(row.initials).toBeUndefined()
  })
})
