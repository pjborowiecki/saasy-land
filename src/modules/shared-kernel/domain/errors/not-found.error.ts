import { DomainError } from "~/src/modules/shared-kernel/domain/types/domain-error"

export class NotFoundError extends DomainError {
  constructor(resource: string) {
    super("NOT_FOUND", `${resource} not found`)
    this.name = "NotFoundError"
  }
}
