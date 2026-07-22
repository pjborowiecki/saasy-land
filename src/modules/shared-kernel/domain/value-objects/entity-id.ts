import { ValidationError } from "~/src/modules/shared-kernel/domain/errors/validation.error"

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu

export class EntityId {
  readonly value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(value: string): EntityId {
    const trimmed = value.trim()
    if (!UUID_RE.test(trimmed)) {
      throw new ValidationError("Invalid entity id")
    }
    return new EntityId(trimmed)
  }

  equals(other: EntityId): boolean {
    return this.value === other.value
  }

  toString(): string {
    return this.value
  }
}
