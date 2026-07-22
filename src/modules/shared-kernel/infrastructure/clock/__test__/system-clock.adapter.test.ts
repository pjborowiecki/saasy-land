import { SystemClockAdapter } from "~/src/modules/shared-kernel/infrastructure/clock/system-clock.adapter"

describe("system clock adapter", () => {
  it("returns the current date", () => {
    expect.hasAssertions()
    const before = Date.now()
    const now = new SystemClockAdapter().now()
    const after = Date.now()

    expect(now).toBeInstanceOf(Date)
    expect(now.getTime()).toBeGreaterThanOrEqual(before)
    expect(now.getTime()).toBeLessThanOrEqual(after)
  })
})
