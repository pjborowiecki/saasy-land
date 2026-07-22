import { DomainError } from "~/src/modules/_core/errors/domain-error"

export class ValidationError extends DomainError {
  constructor(message: string) {
    super("VALIDATION", message)
    this.name = "ValidationError"
  }
}
