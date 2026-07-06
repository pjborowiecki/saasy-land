import { CONSTANTS } from "~/src/constants"

import { canAccess, getPostAuthRedirect, hasAdminAccess, parseUserRoles } from "~/src/integrations/better-auth/auth.access"

describe("parse user roles component", () => {
  it("parses a single role", () => {
    expect.hasAssertions()
    expect(parseUserRoles(CONSTANTS.PERMISSIONS.ROLES.ADMIN)).toStrictEqual([CONSTANTS.PERMISSIONS.ROLES.ADMIN])
  })

  it("parses comma-separated roles from Better Auth admin plugin", () => {
    expect.hasAssertions()
    expect(parseUserRoles("admin,customer")).toStrictEqual([CONSTANTS.PERMISSIONS.ROLES.ADMIN, CONSTANTS.PERMISSIONS.ROLES.CUSTOMER])
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
    expect(hasAdminAccess(CONSTANTS.PERMISSIONS.ROLES.ADMIN)).toBe(true)
  })

  it("returns true when admin is one of multiple roles", () => {
    expect.hasAssertions()
    expect(hasAdminAccess(`customer,${CONSTANTS.PERMISSIONS.ROLES.ADMIN}`)).toBe(true)
  })

  it("returns false for customer role", () => {
    expect.hasAssertions()
    expect(hasAdminAccess(CONSTANTS.PERMISSIONS.ROLES.CUSTOMER)).toBe(false)
  })

  it("returns false for empty or missing roles", () => {
    expect.hasAssertions()
    expect(hasAdminAccess("")).toBe(false)
    expect(hasAdminAccess()).toBe(false)
  })
})

describe("get post auth redirect component", () => {
  it("routes admins to the admin panel", () => {
    expect.hasAssertions()
    expect(getPostAuthRedirect(CONSTANTS.PERMISSIONS.ROLES.ADMIN)).toBe(CONSTANTS.ROUTES.ADMIN)
    expect(getPostAuthRedirect(`customer,${CONSTANTS.PERMISSIONS.ROLES.ADMIN}`)).toBe(CONSTANTS.ROUTES.ADMIN)
  })

  it("routes non-admins to the app", () => {
    expect.hasAssertions()
    expect(getPostAuthRedirect(CONSTANTS.PERMISSIONS.ROLES.CUSTOMER)).toBe(CONSTANTS.ROUTES.APP)
    expect(getPostAuthRedirect("")).toBe(CONSTANTS.ROUTES.APP)
  })
})

describe("can access component", () => {
  it("allows admins to manage products", () => {
    expect.hasAssertions()
    expect(canAccess(CONSTANTS.PERMISSIONS.ROLES.ADMIN, { product: ["create"] })).toBe(true)
  })

  it("denies customers product mutations", () => {
    expect.hasAssertions()
    expect(canAccess(CONSTANTS.PERMISSIONS.ROLES.CUSTOMER, { product: ["create"] })).toBe(false)
  })

  it("returns false for unknown roles", () => {
    expect.hasAssertions()
    // @ts-expect-error unknown role is not in the Role union
    expect(canAccess("unknown-role", { product: ["create"] })).toBe(false)
  })
})
