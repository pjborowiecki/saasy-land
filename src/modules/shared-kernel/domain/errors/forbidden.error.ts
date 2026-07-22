import { DomainError } from "~/src/modules/shared-kernel/domain/types/domain-error"

export class ForbiddenError extends DomainError {
  constructor(message = "Forbidden") {
    super("FORBIDDEN", message)
    this.name = "ForbiddenError"
  }
}
