import { cn, cssVars } from "~/src/lib/_utils/ui"

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
describe("css vars component", () => {
  it("returns CSS custom properties for React style objects", () => {
    expect.hasAssertions()
    expect(cssVars({ "--primary": "oklch(0.5 0.2 300)", "--radius": "0.5rem" })).toStrictEqual({
      "--primary": "oklch(0.5 0.2 300)",
      "--radius": "0.5rem",
    })
  })
})
