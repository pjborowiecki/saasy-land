import { DomainError } from "~/src/modules/shared-kernel/domain/types/domain-error"

/** Single source of truth for assignable user roles (DB enum, Better Auth, domain VO). */
export const RoleCode = {
  ADMIN: "admin",
  CUSTOMER: "customer",
} as const

export type RoleName = (typeof RoleCode)[keyof typeof RoleCode]

export const ROLE_VALUES = [RoleCode.ADMIN, RoleCode.CUSTOMER] as const satisfies readonly RoleName[]

export const DEFAULT_ROLE = RoleCode.CUSTOMER

function isRoleName(value: string): value is RoleName {
  return (ROLE_VALUES as readonly string[]).includes(value)
}

export class Role {
  readonly value: RoleName

  private constructor(value: RoleName) {
    this.value = value
  }

  static create(value: string): Role {
    if (!isRoleName(value)) {
      throw new DomainError("VALIDATION", `Invalid role: ${value}`)
    }
    return new Role(value)
  }

  isAdmin(): boolean {
    return this.value === RoleCode.ADMIN
  }
}
