import { DomainError } from "~/src/modules/_core/errors/domain-error"

export class ConflictError extends DomainError {
  constructor(message: string) {
    super("CONFLICT", message)
    this.name = "ConflictError"
  }
}
