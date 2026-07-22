import { UuidIdGeneratorAdapter } from "~/src/modules/shared-kernel/infrastructure/id/uuid-id-generator.adapter"

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu

describe("uuid id generator adapter", () => {
  it("generates a uuid string", () => {
    expect.hasAssertions()
    const id = new UuidIdGeneratorAdapter().generate()
    expect(id).toMatch(UUID_RE)
  })
})
