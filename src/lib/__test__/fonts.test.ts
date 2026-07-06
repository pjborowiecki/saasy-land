import { geistMono, geistSans } from "~/src/lib/fonts"

describe("fonts helper", () => {
  it("loads sans and mono font variables", () => {
    expect.hasAssertions()
    expect(geistSans.variable).toBe("--font-geist-sans")
    expect(geistMono.variable).toBe("--font-geist-mono")
  })
})
