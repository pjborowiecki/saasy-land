import { ValidationError } from "~/src/modules/shared-kernel/domain/errors/validation.error"
import { EntityId } from "~/src/modules/shared-kernel/domain/value-objects/entity-id"

const VALID_ID = "01900000-0000-7000-8000-000000000001"

describe("entity id value object", () => {
  it("creates from a valid uuid", () => {
    expect.hasAssertions()
    const id = EntityId.create(`  ${VALID_ID}  `)
    expect(id.value).toBe(VALID_ID)
    expect(id.toString()).toBe(VALID_ID)
  })

  it("rejects invalid ids", () => {
    expect.hasAssertions()
    expect(() => EntityId.create("not-a-uuid")).toThrow(ValidationError)
    expect(() => EntityId.create("")).toThrow(ValidationError)
  })

  it("compares by value", () => {
    expect.hasAssertions()
    expect(EntityId.create(VALID_ID).equals(EntityId.create(VALID_ID))).toBe(true)
    expect(EntityId.create(VALID_ID).equals(EntityId.create("01900000-0000-7000-8000-000000000002"))).toBe(false)
  })
})
