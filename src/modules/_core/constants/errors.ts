export const ERROR_CODES = {
  AUTH_API_ERROR: "AUTH_API_ERROR",
  CONFLICT: "CONFLICT",
  FORBIDDEN: "FORBIDDEN",
  INTERNAL_ERROR: "INTERNAL_ERROR",
  NOT_FOUND: "NOT_FOUND",
  TOO_MANY_REQUESTS: "TOO_MANY_REQUESTS",
  UNAUTHORIZED: "UNAUTHORIZED",
  VALIDATION: "VALIDATION",
} as const

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES]

export class AppError extends Error {
  readonly code: ErrorCode

  constructor(code: ErrorCode, message: string = code) {
    super(message)
    this.name = "AppError"
    this.code = code
  }
}
