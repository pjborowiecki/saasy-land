import { loadUsersPageSearchParams } from "~/src/app/[locale]/(admin)/admin/users/_lib/users-search-params"

describe("users page search params", () => {
  it("defaults to the all users tab", () => {
    expect.hasAssertions()

    expect(loadUsersPageSearchParams({}).tab).toBe("allUsers")
    expect(loadUsersPageSearchParams({ tab: "invalid" }).tab).toBe("allUsers")
  })

  it("parses supported tab values", () => {
    expect.hasAssertions()

    expect(loadUsersPageSearchParams({ tab: "roles" }).tab).toBe("roles")
    expect(loadUsersPageSearchParams({ tab: "invitations" }).tab).toBe("invitations")
  })
})
