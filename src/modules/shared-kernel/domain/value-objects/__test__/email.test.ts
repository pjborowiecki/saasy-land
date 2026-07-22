import { ValidationError } from "~/src/modules/shared-kernel/domain/errors/validation.error"
import { Email } from "~/src/modules/shared-kernel/domain/value-objects/email"

describe("email value object", () => {
  it("normalizes and creates a valid email", () => {
    expect.hasAssertions()
    const email = Email.create("  Ada@Example.COM ")
    expect(email.value).toBe("ada@example.com")
    expect(email.toString()).toBe("ada@example.com")
  })

  it("rejects invalid emails", () => {
    expect.hasAssertions()
    expect(() => Email.create("not-an-email")).toThrow(ValidationError)
    expect(() => Email.create("a@b")).toThrow(ValidationError)
  })

  it("compares by normalized value", () => {
    expect.hasAssertions()
    expect(Email.create("a@b.co").equals(Email.create("A@B.CO"))).toBe(true)
    expect(Email.create("a@b.co").equals(Email.create("c@d.co"))).toBe(false)
  })
})
