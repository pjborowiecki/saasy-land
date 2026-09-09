import { describe, expect, it } from "vite-plus/test"

import {
  getBlogPostStatusBadgeClass,
  getBlogPostStatusDotClass,
  getDashboardStatusDotClass,
  getStatusBadgeClass,
  getStatusDotClass,
  getVisibilityBadgeClass,
  getVisibilityMarkClass,
} from "~/src/presentation/components/custom/admin/constants/status-colors"

describe("admin status color helpers", () => {
  it("maps the three meaningful states onto badge tokens", () => {
    expect.hasAssertions()

    expect(getStatusBadgeClass("emerald")).toContain("text-ring")
    expect(getStatusBadgeClass("rose")).toContain("text-destructive")
    expect(getStatusBadgeClass("neutral")).toContain("text-muted-foreground")
  })

  it("maps the same states onto dot tokens", () => {
    expect.hasAssertions()

    expect(getStatusDotClass("emerald")).toBe("bg-ring")
    expect(getStatusDotClass("rose")).toBe("bg-destructive")
    expect(getStatusDotClass("neutral")).toContain("muted-foreground")
  })

  it("maps dashboard statuses", () => {
    expect.hasAssertions()

    expect(getDashboardStatusDotClass("Online")).toBe("bg-ring")
    expect(getDashboardStatusDotClass("Idle")).toContain("amber")
    expect(getDashboardStatusDotClass("Banned")).toBe("bg-destructive")
    expect(getDashboardStatusDotClass("Offline")).toContain("muted-foreground")
  })

  it("maps blog statuses", () => {
    expect.hasAssertions()

    expect(getBlogPostStatusDotClass("published")).toBe("bg-ring")
    expect(getBlogPostStatusDotClass("scheduled")).toContain("amber")
    expect(getBlogPostStatusDotClass("draft")).toContain("muted-foreground")
    expect(getBlogPostStatusBadgeClass("published")).toContain("text-ring")
    expect(getBlogPostStatusBadgeClass("draft")).toContain("text-muted-foreground")
  })

  it("marks visibility as a state", () => {
    expect.hasAssertions()

    expect(getVisibilityBadgeClass("public")).toContain("text-ring")
    expect(getVisibilityBadgeClass("hidden")).toContain("text-muted-foreground")
    expect(getVisibilityMarkClass("public")).toBe("bg-ring")
    expect(getVisibilityMarkClass("hidden")).toContain("muted-foreground")
  })

  it("gives amber only to states that are waiting on somebody", () => {
    expect.hasAssertions()

    expect(getStatusBadgeClass("amber")).toContain("amber")
    expect(getStatusDotClass("amber")).toBe("bg-amber-500")
  })
})
