import type { User } from "~/src/modules/identity-access/domain/aggregates/user/user.aggregate"
import type { UserId } from "~/src/modules/shared-kernel/domain/value-objects/user-id"

export interface UserRepository {
  readonly findById: (id: UserId) => Promise<User | undefined>
  readonly save: (user: User) => Promise<void>
}
