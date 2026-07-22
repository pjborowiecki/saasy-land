import { DomainError } from "~/src/modules/shared-kernel/domain/types/domain-error"

export class ConflictError extends DomainError {
  constructor(message: string) {
    super("CONFLICT", message)
    this.name = "ConflictError"
  }
}
