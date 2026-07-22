import {
  ADMIN_PANEL_ROLES,
  DEFAULT_ROLE,
  hasAdminPanelAccess,
  hasPermission,
  PERMISSIONS,
  ROLES_CONFIG,
  ROLE_VALUES,
  RoleCode,
} from "~/src/integrations/better-auth/auth.access"

describe("auth roles", () => {
  it("exposes a single catalog of role codes", () => {
    expect.hasAssertions()
    expect(ROLE_VALUES).toStrictEqual([RoleCode.ADMIN, RoleCode.CUSTOMER])
    expect(DEFAULT_ROLE).toBe(RoleCode.CUSTOMER)
  })
})

describe("role permission config", () => {
  it("grants admins full app resource access", () => {
    expect.hasAssertions()

    const adminConfig = ROLES_CONFIG.admin
    const readOrder = adminConfig.authorize({ order: ["read"] })
    const refundOrder = adminConfig.authorize({ order: ["refund"] })
    const createCategory = adminConfig.authorize({ category: ["create"] })
    const publishProduct = adminConfig.authorize({ product: ["publish"] })
    const manageSettings = adminConfig.authorize({ settings: ["manage"] })

    expect(readOrder.success).toBe(true)
    expect(refundOrder.success).toBe(true)
    expect(createCategory.success).toBe(true)
    expect(publishProduct.success).toBe(true)
    expect(manageSettings.success).toBe(true)
  })

  it("denies customers app resource access", () => {
    expect.hasAssertions()

    const customerConfig = ROLES_CONFIG.customer
    const readOrder = customerConfig.authorize({ order: ["read"] })
    const createCategory = customerConfig.authorize({ category: ["create"] })
    const createProduct = customerConfig.authorize({ product: ["create"] })
    const manageSettings = customerConfig.authorize({ settings: ["manage"] })

    expect(readOrder.success).toBe(false)
    expect(createCategory.success).toBe(false)
    expect(createProduct.success).toBe(false)
    expect(manageSettings.success).toBe(false)
  })

  it("re-exports role catalog constants", () => {
    expect.hasAssertions()
    expect(PERMISSIONS.ROLES).toBe(RoleCode)
    expect(PERMISSIONS.ROLE_VALUES).toStrictEqual(ROLE_VALUES)
    expect(PERMISSIONS.DEFAULT_ROLE).toBe(DEFAULT_ROLE)
  })

  it("defines admin panel roles", () => {
    expect.hasAssertions()
    expect(ADMIN_PANEL_ROLES).toStrictEqual([RoleCode.ADMIN])
  })
})

describe("has permission", () => {
  it("returns true when any assigned role grants the permission", () => {
    expect.hasAssertions()
    expect(hasPermission(`customer,${PERMISSIONS.ROLES.ADMIN}`, PERMISSIONS.user.list)).toBe(true)
    expect(hasPermission(PERMISSIONS.ROLES.ADMIN, PERMISSIONS.product.create)).toBe(true)
  })

  it("returns false when no assigned role grants the permission", () => {
    expect.hasAssertions()
    expect(hasPermission(PERMISSIONS.ROLES.CUSTOMER, PERMISSIONS.user.list)).toBe(false)
    expect(hasPermission(PERMISSIONS.ROLES.CUSTOMER, PERMISSIONS.product.create)).toBe(false)
    expect(hasPermission(PERMISSIONS.ROLES.CUSTOMER, PERMISSIONS.settings.manage)).toBe(false)
    expect(hasPermission("", PERMISSIONS.product.create)).toBe(false)
    expect(hasPermission(undefined, PERMISSIONS.product.create)).toBe(false)
  })

  it("returns false for unknown roles", () => {
    expect.hasAssertions()
    expect(hasPermission("unknown-role", PERMISSIONS.product.create)).toBe(false)
  })
})

describe("has admin panel access", () => {
  it("returns true when the user can list users", () => {
    expect.hasAssertions()
    expect(hasAdminPanelAccess(`customer,${PERMISSIONS.ROLES.ADMIN}`)).toBe(true)
    expect(hasAdminPanelAccess(PERMISSIONS.ROLES.ADMIN)).toBe(true)
  })

  it("returns false for customers without staff permissions", () => {
    expect.hasAssertions()
    expect(hasAdminPanelAccess(PERMISSIONS.ROLES.CUSTOMER)).toBe(false)
    expect(hasAdminPanelAccess("")).toBe(false)
    expect(hasAdminPanelAccess()).toBe(false)
  })
})
