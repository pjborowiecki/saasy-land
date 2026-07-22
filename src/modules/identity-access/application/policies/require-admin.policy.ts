import { Role } from "~/src/modules/identity-access/domain/value-objects/role"
import { ForbiddenError } from "~/src/modules/shared-kernel/domain/errors/forbidden.error"

export function requireAdmin(role: string | undefined): void {
  if (role === undefined) {
    throw new ForbiddenError("Admin access required")
  }
  if (!Role.create(role).isAdmin()) {
    throw new ForbiddenError("Admin access required")
  }
}
