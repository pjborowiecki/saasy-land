import { DEFAULT_ROLE, ROLE_VALUES, Role, RoleCode } from "~/src/modules/identity-access/domain/value-objects/role"
import { DomainError } from "~/src/modules/shared-kernel/domain/types/domain-error"

describe("role value object", () => {
  it("exposes a single catalog of role codes", () => {
    expect.hasAssertions()
    expect(ROLE_VALUES).toStrictEqual([RoleCode.ADMIN, RoleCode.CUSTOMER])
    expect(DEFAULT_ROLE).toBe(RoleCode.CUSTOMER)
  })

  it("creates a role from a valid code", () => {
    expect.hasAssertions()
    const role = Role.create(RoleCode.ADMIN)
    expect(role.value).toBe(RoleCode.ADMIN)
    expect(role.isAdmin()).toBe(true)
  })

  it("rejects unknown role codes", () => {
    expect.hasAssertions()
    expect(() => Role.create("unknown")).toThrow(DomainError)
  })
})
