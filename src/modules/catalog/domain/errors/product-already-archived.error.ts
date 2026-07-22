import { DomainError } from "~/src/modules/shared-kernel/domain/types/domain-error"

export class ProductAlreadyArchivedError extends DomainError {
  constructor() {
    super("CONFLICT", "Product is already archived")
    this.name = "ProductAlreadyArchivedError"
  }
}
