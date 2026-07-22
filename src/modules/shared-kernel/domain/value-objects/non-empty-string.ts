import { ValidationError } from "~/src/modules/shared-kernel/domain/errors/validation.error"

export class NonEmptyString {
  readonly value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(value: string, fieldName = "value"): NonEmptyString {
    const trimmed = value.trim()
    if (trimmed.length === 0) {
      throw new ValidationError(`${fieldName} must not be empty`)
    }
    return new NonEmptyString(trimmed)
  }

  toString(): string {
    return this.value
  }
}
