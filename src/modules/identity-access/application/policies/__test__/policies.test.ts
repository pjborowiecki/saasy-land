import { requireAdmin } from "~/src/modules/identity-access/application/policies/require-admin.policy"
import { requireAuthenticated } from "~/src/modules/identity-access/application/policies/require-authenticated.policy"
import { RoleCode } from "~/src/modules/identity-access/domain/value-objects/role"
import { ForbiddenError } from "~/src/modules/shared-kernel/domain/errors/forbidden.error"
import { UnauthorizedError } from "~/src/modules/shared-kernel/domain/errors/unauthorized.error"

const missingRole: string | undefined = undefined
const missingUserId: string | undefined = undefined

describe("require admin policy", () => {
  it("allows admins", () => {
    expect.hasAssertions()
    expect(() => {
      requireAdmin(RoleCode.ADMIN)
    }).not.toThrow()
  })

  it("rejects missing and non-admin roles", () => {
    expect.hasAssertions()
    expect(() => {
      requireAdmin(missingRole)
    }).toThrow(ForbiddenError)
    expect(() => {
      requireAdmin(RoleCode.CUSTOMER)
    }).toThrow(ForbiddenError)
  })
})

describe("require authenticated policy", () => {
  it("returns a present user id", () => {
    expect.hasAssertions()
    expect(requireAuthenticated("user-1")).toBe("user-1")
  })

  it("rejects missing or empty user ids", () => {
    expect.hasAssertions()
    expect(() => requireAuthenticated(missingUserId)).toThrow(UnauthorizedError)
    expect(() => requireAuthenticated("")).toThrow(UnauthorizedError)
  })
})
