import { describe, expect, it } from "vite-plus/test"

import { cn } from "~/src/lib/cn"

describe("cn helper", () => {
  it("merges class names and resolves tailwind conflicts", () => {
    expect.hasAssertions()
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4")
  })

  it("handles omitted optional classes", () => {
    expect.hasAssertions()
    expect(cn("base", "visible")).toBe("base visible")
  })

  it("preserves typography alongside colors and resolves size overrides", () => {
    expect(cn("text-spec", "text-muted-foreground")).toBe("text-spec text-muted-foreground")
    expect(cn("text-muted-foreground", "text-spec")).toBe("text-muted-foreground text-spec")
    expect(cn("text-body", "text-title")).toBe("text-title")
    expect(cn("md:text-body", "md:text-title", "md:text-foreground")).toBe("md:text-title md:text-foreground")
  })
})
