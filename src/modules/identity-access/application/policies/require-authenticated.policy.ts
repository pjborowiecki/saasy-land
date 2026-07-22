import { UnauthorizedError } from "~/src/modules/shared-kernel/domain/errors/unauthorized.error"

export function requireAuthenticated(userId: string | undefined): string {
  if (userId === undefined || userId.length === 0) {
    throw new UnauthorizedError()
  }
  return userId
}
