import { Link, getPathname, permanentRedirect, redirect, usePathname, useRouter } from "~/src/integrations/next-intl/i18n.navigation"

describe("i18n navigation re-exports", () => {
  it("exports Link", () => {
    expect.hasAssertions()
    expect(Link).toBeDefined()
  })

  it("exports navigation helpers", () => {
    expect.hasAssertions()
    expect(getPathname).toBeTypeOf("function")
    expect(permanentRedirect).toBeTypeOf("function")
    expect(redirect).toBeTypeOf("function")
    expect(usePathname).toBeTypeOf("function")
    expect(useRouter).toBeTypeOf("function")
  })
})
