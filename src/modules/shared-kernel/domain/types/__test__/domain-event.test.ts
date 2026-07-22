import { createDomainEvent } from "~/src/modules/shared-kernel/domain/types/domain-event"

describe("domain event factory", () => {
  it("builds an event with an explicit occurredAt", () => {
    expect.hasAssertions()
    const occurredAt = new Date("2026-01-01T00:00:00.000Z")
    const event = createDomainEvent("catalog.product.created", { productId: "p1" }, occurredAt)

    expect(event).toStrictEqual({
      name: "catalog.product.created",
      occurredAt,
      payload: { productId: "p1" },
    })
  })

  it("defaults occurredAt to now", () => {
    expect.hasAssertions()
    const before = Date.now()
    const event = createDomainEvent("catalog.product.created", { productId: "p1" })
    const after = Date.now()

    expect(event.name).toBe("catalog.product.created")
    expect(event.payload).toStrictEqual({ productId: "p1" })
    expect(event.occurredAt.getTime()).toBeGreaterThanOrEqual(before)
    expect(event.occurredAt.getTime()).toBeLessThanOrEqual(after)
  })
})
