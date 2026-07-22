import { cn } from "~/src/presentation/utils"

describe("cn helper", () => {
  it("merges class names and resolves tailwind conflicts", () => {
    expect.hasAssertions()
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4")
  })
  it("handles omitted optional classes", () => {
    expect.hasAssertions()
    expect(cn("base", "visible")).toBe("base visible")
  })
})
