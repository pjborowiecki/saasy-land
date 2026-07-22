import { DomainError } from "~/src/modules/shared-kernel/domain/types/domain-error"

export class UnauthorizedError extends DomainError {
  constructor(message = "Unauthorized") {
    super("UNAUTHORIZED", message)
    this.name = "UnauthorizedError"
  }
}
