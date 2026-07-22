import { DomainError } from "~/src/modules/shared-kernel/domain/types/domain-error"

export class ProductNotPublishableError extends DomainError {
  constructor() {
    super("VALIDATION", "Archived products cannot be published")
    this.name = "ProductNotPublishableError"
  }
}
