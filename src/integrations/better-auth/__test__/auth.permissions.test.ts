import { CONSTANTS } from "~/src/constants"

import { ROLES_CONFIG } from "~/src/integrations/better-auth/auth.permissions"

describe("role permission config", () => {
  it("grants admins full app resource access", () => {
    expect.hasAssertions()

    expect(ROLES_CONFIG.admin.authorize({ order: ["read"] }).success).toBe(true)
    expect(ROLES_CONFIG.admin.authorize({ order: ["refund"] }).success).toBe(true)
    expect(ROLES_CONFIG.admin.authorize({ product: ["publish"] }).success).toBe(true)
    expect(ROLES_CONFIG.admin.authorize({ settings: ["manage"] }).success).toBe(true)
  })

  it("denies customers app resource access", () => {
    expect.hasAssertions()

    expect(ROLES_CONFIG.customer.authorize({ order: ["read"] }).success).toBe(false)
    expect(ROLES_CONFIG.customer.authorize({ product: ["create"] }).success).toBe(false)
    expect(ROLES_CONFIG.customer.authorize({ settings: ["manage"] }).success).toBe(false)
  })

  it("uses the configured default role constant", () => {
    expect.hasAssertions()
    expect(CONSTANTS.PERMISSIONS.DEFAULT_ROLE).toBe(CONSTANTS.PERMISSIONS.ROLES.CUSTOMER)
  })
})
