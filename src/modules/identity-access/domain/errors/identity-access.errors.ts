import { DomainError } from "~/src/modules/shared-kernel/domain/types/domain-error"

export class UserBannedError extends DomainError {
  constructor() {
    super("FORBIDDEN", "User is banned")
    this.name = "UserBannedError"
  }
}
