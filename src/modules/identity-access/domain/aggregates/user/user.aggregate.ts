import { UserBannedError } from "~/src/modules/identity-access/domain/errors/identity-access.errors"
import type { Role } from "~/src/modules/identity-access/domain/value-objects/role"
import type { Email } from "~/src/modules/shared-kernel/domain/value-objects/email"
import type { UserId } from "~/src/modules/shared-kernel/domain/value-objects/user-id"

export interface UserProps {
  readonly banned: boolean
  readonly email: Email
  readonly emailVerified: boolean
  readonly id: UserId
  readonly name: string
  readonly role: Role
}

export class User {
  private props: UserProps

  private constructor(props: UserProps) {
    this.props = props
  }

  static reconstitute(props: UserProps): User {
    return new User(props)
  }

  get id(): UserId {
    return this.props.id
  }

  get email(): Email {
    return this.props.email
  }

  get name(): string {
    return this.props.name
  }

  get role(): Role {
    return this.props.role
  }

  get banned(): boolean {
    return this.props.banned
  }

  get emailVerified(): boolean {
    return this.props.emailVerified
  }

  assertNotBanned(): void {
    if (this.props.banned) {
      throw new UserBannedError()
    }
  }

  ban(): void {
    this.props = { ...this.props, banned: true }
  }

  unban(): void {
    this.props = { ...this.props, banned: false }
  }

  changeRole(role: Role): void {
    this.props = { ...this.props, role }
  }
}
