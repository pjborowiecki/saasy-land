import { PERMISSIONS } from "~/src/modules/identity-access/domain/permissions"
import { canAccess, hasAdminAccess, parseUserRoles } from "~/src/modules/identity-access/infrastructure/auth/auth.access"

describe("parse user roles component", () => {
  it("parses a single role", () => {
    expect.hasAssertions()
    expect(parseUserRoles(PERMISSIONS.ROLES.ADMIN)).toStrictEqual([PERMISSIONS.ROLES.ADMIN])
  })

  it("parses comma-separated roles from Better Auth admin plugin", () => {
    expect.hasAssertions()
    expect(parseUserRoles("admin,customer")).toStrictEqual([PERMISSIONS.ROLES.ADMIN, PERMISSIONS.ROLES.CUSTOMER])
  })

  it("returns an empty list for missing roles", () => {
    expect.hasAssertions()
    expect(parseUserRoles()).toStrictEqual([])
    expect(parseUserRoles("")).toStrictEqual([])
  })
})

describe("has admin access component", () => {
  it("returns true for admin role", () => {
    expect.hasAssertions()
    expect(hasAdminAccess(PERMISSIONS.ROLES.ADMIN)).toBe(true)
  })

  it("returns true when admin is one of multiple roles", () => {
    expect.hasAssertions()
    expect(hasAdminAccess(`customer,${PERMISSIONS.ROLES.ADMIN}`)).toBe(true)
  })

  it("returns false for customer role", () => {
    expect.hasAssertions()
    expect(hasAdminAccess(PERMISSIONS.ROLES.CUSTOMER)).toBe(false)
  })

  it("returns false for empty or missing roles", () => {
    expect.hasAssertions()
    expect(hasAdminAccess("")).toBe(false)
    expect(hasAdminAccess()).toBe(false)
  })
})

describe("can access component", () => {
  it("allows admins to manage products", () => {
    expect.hasAssertions()
    expect(canAccess(PERMISSIONS.ROLES.ADMIN, { product: ["create"] })).toBe(true)
  })

  it("denies customers product mutations", () => {
    expect.hasAssertions()
    expect(canAccess(PERMISSIONS.ROLES.CUSTOMER, { product: ["create"] })).toBe(false)
  })

  it("returns false for unknown roles", () => {
    expect.hasAssertions()
    // @ts-expect-error unknown role is not in the RoleName union
    expect(canAccess("unknown-role", { product: ["create"] })).toBe(false)
  })
})
