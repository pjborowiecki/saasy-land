import { ValidationError } from "~/src/modules/shared-kernel/domain/errors/validation.error"

const EMAIL_RE = /^[^\s@]+@[^\s@.]+\.[^\s@]+$/u

export class Email {
  readonly value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(value: string): Email {
    const normalized = value.trim().toLowerCase()
    if (!EMAIL_RE.test(normalized)) {
      throw new ValidationError("Invalid email")
    }
    return new Email(normalized)
  }

  equals(other: Email): boolean {
    return this.value === other.value
  }

  toString(): string {
    return this.value
  }
}
