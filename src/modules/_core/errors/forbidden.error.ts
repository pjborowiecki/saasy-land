import { DomainError } from "~/src/modules/_core/errors/domain-error"

export class ForbiddenError extends DomainError {
  constructor(message = "Forbidden") {
    super("FORBIDDEN", message)
    this.name = "ForbiddenError"
  }
}
