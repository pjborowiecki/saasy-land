import { UserBannedError } from "~/src/modules/identity-access/domain/errors/identity-access.errors"

describe("identity access errors", () => {
  it("constructs a banned user error", () => {
    expect.hasAssertions()
    const error = new UserBannedError()
    expect(error.name).toBe("UserBannedError")
    expect(error.code).toBe("FORBIDDEN")
    expect(error.message).toBe("User is banned")
  })
})
