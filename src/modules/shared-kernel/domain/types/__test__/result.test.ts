import { err, ok } from "~/src/modules/shared-kernel/domain/types/result"

const SUCCESS_VALUE = "ready"

describe("result helpers", () => {
  it("wraps a success value", () => {
    expect.hasAssertions()
    expect(ok(SUCCESS_VALUE)).toStrictEqual({ ok: true, value: SUCCESS_VALUE })
  })

  it("wraps an error value", () => {
    expect.hasAssertions()
    expect(err("boom")).toStrictEqual({ error: "boom", ok: false })
  })
})
