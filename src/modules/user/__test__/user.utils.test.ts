import { describe, expect, it } from "vite-plus/test"

import { getUserStatus } from "~/src/modules/user/user.utils"

describe("user status helpers", () => {
  it("returns banned when the user is banned", () => {
    expect.hasAssertions()

    expect(getUserStatus({ banned: true, emailVerified: true })).toBe("banned")
    expect(getUserStatus({ banned: true, emailVerified: false })).toBe("banned")
  })

  it("returns pending when email is not verified", () => {
    expect.hasAssertions()

    expect(getUserStatus({ banned: false, emailVerified: false })).toBe("pending")
  })

  it("returns active when verified and not banned", () => {
    expect.hasAssertions()

    expect(getUserStatus({ banned: false, emailVerified: true })).toBe("active")
  })
})
