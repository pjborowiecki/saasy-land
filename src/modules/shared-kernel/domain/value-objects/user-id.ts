import { EntityId } from "~/src/modules/shared-kernel/domain/value-objects/entity-id"

export class UserId {
  readonly value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(value: string): UserId {
    return new UserId(EntityId.create(value).value)
  }

  equals(other: UserId): boolean {
    return this.value === other.value
  }

  toString(): string {
    return this.value
  }
}
