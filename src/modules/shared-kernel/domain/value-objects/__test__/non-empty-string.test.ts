import { ValidationError } from "~/src/modules/shared-kernel/domain/errors/validation.error"
import { NonEmptyString } from "~/src/modules/shared-kernel/domain/value-objects/non-empty-string"

describe("non-empty string value object", () => {
  it("trims and creates a non-empty value", () => {
    expect.hasAssertions()
    const value = NonEmptyString.create("  hello  ")
    expect(value.value).toBe("hello")
    expect(value.toString()).toBe("hello")
  })

  it("rejects empty and whitespace-only values", () => {
    expect.hasAssertions()
    expect(() => NonEmptyString.create("")).toThrow(ValidationError)
    expect(() => NonEmptyString.create("   ")).toThrow(ValidationError)
  })

  it("uses the field name in the validation message", () => {
    expect.hasAssertions()
    expect(() => NonEmptyString.create("", "name")).toThrow("name must not be empty")
  })
})
