import {
  getBlogPostStatusDotClass,
  getDashboardStatusDotClass,
  getProductIconClass,
  getRoleIconClass,
  getRoleTypeBadgeClass,
  getStatusBadgeClass,
  getStatusDotClass,
  getTagBadgeClass,
  getVisibilityBadgeClass,
} from "~/src/app/[locale]/(admin)/admin/_lib/status-colors"

describe("admin status color helpers", () => {
  it("returns badge and dot classes for each status color", () => {
    expect.hasAssertions()

    expect(getStatusBadgeClass("emerald")).toContain("emerald")
    expect(getStatusDotClass("rose")).toContain("rose")
  })

  it("maps dashboard and blog status dots", () => {
    expect.hasAssertions()

    expect(getDashboardStatusDotClass("Online")).toContain("emerald")
    expect(getDashboardStatusDotClass("Idle")).toContain("amber")
    expect(getBlogPostStatusDotClass("published")).toContain("emerald")
    expect(getBlogPostStatusDotClass("scheduled")).toContain("blue")
  })

  it("maps role, visibility, tag, and product variants", () => {
    expect.hasAssertions()

    expect(getRoleTypeBadgeClass("fuchsia")).toContain("fuchsia")
    expect(getRoleIconClass("default")).toContain("muted-foreground")
    expect(getVisibilityBadgeClass("public")).toContain("emerald")
    expect(getTagBadgeClass("blue")).toContain("blue")
    expect(getProductIconClass("emerald")).toContain("emerald")
  })
})
