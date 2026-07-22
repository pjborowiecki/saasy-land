import { USER_ERROR_MESSAGE } from "~/src/modules/user/user.errors"

describe("user error messages", () => {
  it("stores full next-intl paths for user.errors", () => {
    expect.hasAssertions()
    expect(USER_ERROR_MESSAGE.notFound).toBe("user.errors.notFound")
  })
})
