export type DomainErrorCode = "CONFLICT" | "FORBIDDEN" | "NOT_FOUND" | "UNAUTHORIZED" | "VALIDATION"

export class DomainError extends Error {
  readonly code: DomainErrorCode

  constructor(code: DomainErrorCode, message: string) {
    super(message)
    this.name = "DomainError"
    this.code = code
  }
}
