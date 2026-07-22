export interface DomainEvent<TName extends string = string, TPayload = unknown> {
  readonly name: TName
  readonly occurredAt: Date
  readonly payload: TPayload
}

export function createDomainEvent<TName extends string, TPayload>(
  name: TName,
  payload: TPayload,
  occurredAt: Date = new Date(),
): DomainEvent<TName, TPayload> {
  return { name, occurredAt, payload }
}
