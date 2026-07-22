import { TECH_STACK } from "~/src/app/[locale]/(landing)/_lib/tech-stack"
import { TESTIMONIALS } from "~/src/app/[locale]/(landing)/_lib/testimonials"

describe("landing static data", () => {
  it("exports tech stack entries", () => {
    expect.hasAssertions()
    expect(TECH_STACK.length).toBeGreaterThan(0)
    expect(TECH_STACK[0]?.name).toBeTypeOf("string")
  })

  it("exports testimonials", () => {
    expect.hasAssertions()
    expect(TESTIMONIALS.length).toBeGreaterThan(0)
    expect(TESTIMONIALS[0]?.items[0]?.text).toBeTypeOf("string")
  })
})
