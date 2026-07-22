import { DomainError } from "~/src/modules/shared-kernel/domain/types/domain-error"

export class ValidationError extends DomainError {
  constructor(message: string) {
    super("VALIDATION", message)
    this.name = "ValidationError"
  }
}
