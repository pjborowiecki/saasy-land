import { DomainError } from "~/src/modules/_core/errors/domain-error"

export class UnauthorizedError extends DomainError {
  constructor(message = "Unauthorized") {
    super("UNAUTHORIZED", message)
    this.name = "UnauthorizedError"
  }
}
