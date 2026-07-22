import { User } from "~/src/modules/identity-access/domain/aggregates/user/user.aggregate"
import { UserBannedError } from "~/src/modules/identity-access/domain/errors/identity-access.errors"
import { Role, RoleCode } from "~/src/modules/identity-access/domain/value-objects/role"
import { Email } from "~/src/modules/shared-kernel/domain/value-objects/email"
import { UserId } from "~/src/modules/shared-kernel/domain/value-objects/user-id"

const USER_ID = "01900000-0000-7000-8000-000000000099"

function createUser(overrides: Partial<Parameters<typeof User.reconstitute>[0]> = {}): User {
  return User.reconstitute({
    banned: false,
    email: Email.create("user@example.com"),
    emailVerified: true,
    id: UserId.create(USER_ID),
    name: "Ada",
    role: Role.create(RoleCode.CUSTOMER),
    ...overrides,
  })
}

describe("user aggregate", () => {
  it("exposes identity fields", () => {
    expect.hasAssertions()
    const user = createUser()
    expect(user.id.value).toBe(USER_ID)
    expect(user.email.value).toBe("user@example.com")
    expect(user.name).toBe("Ada")
    expect(user.role.value).toBe(RoleCode.CUSTOMER)
    expect(user.emailVerified).toBe(true)
  })

  it("reports banned state", () => {
    expect.hasAssertions()
    expect(createUser().banned).toBe(false)
    expect(createUser({ banned: true }).banned).toBe(true)
  })

  it("bans and unbans a user", () => {
    expect.hasAssertions()
    const user = createUser()
    user.assertNotBanned()

    user.ban()
    expect(user.banned).toBe(true)
    expect(() => {
      user.assertNotBanned()
    }).toThrow(UserBannedError)

    user.unban()
    expect(user.banned).toBe(false)
    user.assertNotBanned()
  })

  it("changes role", () => {
    expect.hasAssertions()
    const user = createUser()
    user.changeRole(Role.create(RoleCode.ADMIN))
    expect(user.role.isAdmin()).toBe(true)
  })
})
