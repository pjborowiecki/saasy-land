import { ValidationError } from "~/src/modules/shared-kernel/domain/errors/validation.error"
import { UserId } from "~/src/modules/shared-kernel/domain/value-objects/user-id"

const VALID_ID = "01900000-0000-7000-8000-000000000001"

describe("user id value object", () => {
  it("creates from a valid entity id", () => {
    expect.hasAssertions()
    const id = UserId.create(VALID_ID)
    expect(id.value).toBe(VALID_ID)
    expect(id.toString()).toBe(VALID_ID)
  })

  it("rejects invalid ids", () => {
    expect.hasAssertions()
    expect(() => UserId.create("bad")).toThrow(ValidationError)
  })

  it("compares by value", () => {
    expect.hasAssertions()
    expect(UserId.create(VALID_ID).equals(UserId.create(VALID_ID))).toBe(true)
    expect(UserId.create(VALID_ID).equals(UserId.create("01900000-0000-7000-8000-000000000002"))).toBe(false)
  })
})
